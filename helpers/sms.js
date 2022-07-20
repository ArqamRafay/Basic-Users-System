const asyncHandler = require("../helpers/asyncMiddleware"),
  twilio = require("twilio"),
  Op = require('sequelize').Op,
  Twilio_feedbackwow_credentials = require("../models").Twilio_feedbackwow_credentials,
  Distribution_option = require("../models").Distribution_option,
  Sms_recipients_and_respondents = require("../models")
    .Sms_recipients_and_respondents,
  Sms_respondents_detail = require("../models").Sms_respondents_detail,
  Question = require("../models").Question,
  Question_choice = require("../models").Question_choice,
  Answer = require("../models").Answer,
  querystring = require('querystring'),
  _ = require("lodash");

const findActiveSurvey = asyncHandler(async (to, from) => {
  const active = await Sms_recipients_and_respondents.findOne({
    where: { to: to, from: from }
  });

  return active;
})

const findOldestQueued = asyncHandler(async (to, from, loop=false) => {

  const oldestQueued = await Sms_recipients_and_respondents.findOne({
    order: [["createdAt", "ASC"]],
    where: { to: to, from: from, survey_state: "queued" }
  });

  if (!loop && (!oldestQueued || !oldestQueued.id))
    throw "THIS USER IS NOT HAVING ANY SURVEY IN QUEUE";

  return oldestQueued;
});

const findFirstQuestion = asyncHandler(async (survey_id, loop=false) => {

  const question = await Question.findOne({
    order: [["createdAt", "ASC"]],
    where: { survey_id: survey_id, question_type_id: {
      [Op.ne]: 10
    }}
  });

  if (!question || !question.id) {
    const changeStateToNoQuestion = await Sms_recipients_and_respondents.update({ survey_state: 'no_question_found' }, { where: { survey_id: survey_id } });
    if (!loop) throw "THIS SURVEY DOESNOT CONTAIN ANY QUESTION";
  }

  if(question.question_type_id==8){
    let labels = await findQuestionmmslabels(question.id);
    let choices = await findQuestionChoices_mms(question.id);
    return {question, choices,labels};
  }else {

    let choices = await findQuestionChoices(question.id);
    return {question, choices};
  }
  // if (!choices) choices = '';
});

const findQuestionChoices = asyncHandler(async (qID) => {
  let choicesTogether = '';
  const questionChoices = await Question_choice.findOne({
    where: { question_id: qID }
  });
  if (
    questionChoices &&
    questionChoices.name &&
    questionChoices.name.length > 0
  ) {
    // choicesTogether = questionChoices.name;
    // choicesTogether = questionChoices.name.reduce((total, one, index) => {
    //   let val;
    //   one = one.slice(0, 2) + " for " + one.slice(2)
    //   index === 0 ? (val = total + _.upperFirst(one) + "\n") : (val = total + _.upperFirst(one) + "\n");
    //   console.log("----------------------------%%%%%%%%% val==========================   ", val);
    //   return val;
    // }, []);


    choicesTogether = questionChoices.name.reduce((total, one, index) => {
      let val;
      one = index+1 + " for " + one
      index === 0 ? (val = total + _.upperFirst(one) + "\n") : (val = total + _.upperFirst(one) + "\n");
      console.log("----------------------------%%%%%%%%% val==========================   ", val);
      return val;
    }, []);
  }

  return choicesTogether;
});



const findQuestionChoices_mms = asyncHandler(async (qID) => {
  let choicesTogether = '';
  const questionChoices = await Question_choice.findOne({
    where: { question_id: qID }
  });
  if (
    questionChoices &&
    questionChoices.picname &&
    questionChoices.picname.length > 0
  ) {
    // choicesTogether = questionChoices.name;
    // choicesTogether = questionChoices.name.reduce((total, one, index) => {
    //   let val;
    //   one = one.slice(0, 2) + " for " + one.slice(2)
    //   index === 0 ? (val = total + _.upperFirst(one) + "\n") : (val = total + _.upperFirst(one) + "\n");
    //   console.log("----------------------------%%%%%%%%% val==========================   ", val);
    //   return val;
    // }, []);
    choicesTogether = questionChoices.picname;

    // choicesTogether = questionChoices.name.reduce((total, one, index) => {
    //   let val;
    //   one = index+1 + " for " + one
    //   index === 0 ? (val = total + _.upperFirst(one) + "\n") : (val = total + _.upperFirst(one) + "\n");
    //   console.log("----------------------------%%%%%%%%% val==========================   ", val);
    //   return val;
    // }, []);
  }

  return choicesTogether;
});

const findQuestionmmslabels = asyncHandler(async (qID) => {
  let labelsTogether = '';
  const questionChoices = await Question_choice.findOne({
    where: { question_id: qID }
  });
  if (
    questionChoices &&
    questionChoices.picname &&
    questionChoices.picname.length > 0
  ) {
    // choicesTogether = questionChoices.name;
    // choicesTogether = questionChoices.name.reduce((total, one, index) => {
    //   let val;
    //   one = one.slice(0, 2) + " for " + one.slice(2)
    //   index === 0 ? (val = total + _.upperFirst(one) + "\n") : (val = total + _.upperFirst(one) + "\n");
    //   console.log("----------------------------%%%%%%%%% val==========================   ", val);
    //   return val;
    // }, []);


    labelsTogether = questionChoices.picname.reduce((total, one, index) => {
      let val;
      one = index+1 + " for " + one
      index === 0 ? (val = total + _.upperFirst(one) + "\n") : (val = total + _.upperFirst(one) + "\n");
      console.log("----------------------------%%%%%%%%% val==========================   ", val);
      return val;
    }, []);
  }

  return labelsTogether;
});

const sendSurvey = asyncHandler(async (reqObj, loop=false) => {

  const credentials = await Twilio_feedbackwow_credentials.findOne();

  if (!loop && !credentials) throw "INVALID TWILIO CREDENTIALS";

  const client = require("twilio")(credentials.sid, credentials.auth_token);
  console.log("qwqwqwqwqwqqwqwqw   &&&&&&&&&&& ",reqObj);
  // if(reqObj.to.charAt(0) !=="+"){
  //
  //   console.log("{{{{{{{{{{{{{{{{{{{{{{  + NOT FOUND   }}}}}}}}}}}}}}}}}}}}}}");
  // }
  try{
    let sendSms = await client.messages.create({
      from: reqObj.from, // From a valid Twilio number
      to: reqObj.to, // Text this number
      body: reqObj.body,
      statusCallback: "https://server.feedbackwow.org/webhooks/smsstatus"
      // statusCallback: "https://62fcd05d.ngrok.io/webhooks/smsstatus"
    });

    console.log('*********************************');
    console.log("_.omit(sendSms, _version)   ", _.omit(sendSms, "_version"));
    console.log('*********************************');
    //
    return _.omit(sendSms, "_version");
    // return sendSms = { status: 'queued' };
  }catch(e){
    // console.log("e------------- ",e);
    return e;
  }

});


const sendSurvey_mms = asyncHandler(async (reqObj, loop=false) => {

  const credentials = await Twilio_feedbackwow_credentials.findOne();

  if (!loop && !credentials) throw "INVALID TWILIO CREDENTIALS";

  const client = require("twilio")(credentials.sid, credentials.auth_token);
  console.log("waqas-=-=-MMS=-=-=-=-=-=-=-=-=-=-=- ",reqObj);
  // if(reqObj.to.charAt(0) !=="+"){
  //
  //   console.log("{{{{{{{{{{{{{{{{{{{{{{  + NOT FOUND   }}}}}}}}}}}}}}}}}}}}}}");
  // }
  try{
    let sendSms = await client.messages.create({
      from: reqObj.from, // From a valid Twilio number
      to: reqObj.to, // Text this number
      // mediaUrl: ['https://demo.twilio.com/owl.png','https://res.cloudinary.com/sixlogs-pvt-ltd/image/upload/v1551069834/dressmePro/xdljYax2X4_5VH5ZlAOicySgMNwYtRYVLcbOMOMMhfAdTCjrHEBkowQuwjFxsjpdf_5tpMXyGU5WsM88AujWe8cFT2i1PcCpNAP-fm8bUtUejl8PiwGc5zJ0o8VBYYoYLSFh9HYlk6DmNUqofg.png'],
      mediaUrl: reqObj.media,
      body: reqObj.body,


      statusCallback: "https://server.feedbackwow.com/webhooks/smsstatus"
      // statusCallback: "https://57f06c25.ngrok.io/webhooks/smsstatus"
    });

    console.log('*********************************');
    console.log("_.omit(sendSms, _version)   ", _.omit(sendSms, "_version"));
    console.log('*********************************');
    //
    return _.omit(sendSms, "_version");
    // return sendSms = { status: 'queued' };
  }catch(e){
    // console.log("e------------- ",e);
    return e;
  }

});


const sendPassword = asyncHandler(async (reqObj, loop=false) => {

  const credentials = await Twilio_feedbackwow_credentials.findOne();

  if (!loop && !credentials) throw "INVALID TWILIO CREDENTIALS";

  const client = require("twilio")(credentials.sid, credentials.auth_token);

  let sendSms = await client.messages.create({
    from: reqObj.from, // From a valid Twilio number
    to: reqObj.to, // Text this number
    body: reqObj.body,
    statusCallback: "https://server.feedbackwow.org/webhooks/forgotpass"
    // statusCallback: "http://feedbackwow-server.us-west-2.elasticbeanstalk.com/webhooks/smsstatus"
  });

  return _.omit(sendSms, "_version");
  // return sendSms = { status: 'queued' };
});



const updateRecords = asyncHandler(async (oldestQueued, question) => {
  var updateObj = [
    { survey_state: "active" },
    { where: { id: oldestQueued.id }, returning: true }
  ]
  if (oldestQueued.days_for_expire_when_active && oldestQueued.days_for_expire_when_active > 0) {
    setNewExpiry = new Date();
    setNewExpiry.setDate(setNewExpiry.getDate() + oldestQueued.days_for_expire_when_active);

    const checkDistributionExpiry = await Distribution_option.findOne({ where: { distribution_id: oldestQueued.distribution_id } });
    if (
      checkDistributionExpiry &&
      checkDistributionExpiry.distribution_expire_date &&
      ( new Date(checkDistributionExpiry.distribution_expire_date) < new Date(setNewExpiry) )
    ) {
      updateObj[0]['individual_survey_expire_date'] = new Date(checkDistributionExpiry.distribution_expire_date);
    } else {
      updateObj[0]['individual_survey_expire_date'] = setNewExpiry;
    }
  }
  const query = await Sms_recipients_and_respondents.update(updateObj[0], updateObj[1]);

  if (query[1][0] && query[1][0].id) {
     subQuery = await Sms_respondents_detail.create({
     twilio_sms_status: 'queued',
     question_id: question.id,
     sms_recipients_and_respondents_id: query[1][0].id
     // question_type_id: FIND AND PUT IT HERE
    });
  }

  return { query, subQuery };
});

const sendVerificationCode = asyncHandler(async (mobile_no, code) => {

  console.log(mobile_no, code);


  // var accountSid = "ACcb688c7ab56603a7bbbf704d9a0f6c9f"; // Your Account SID from www.twilio.com/console
  // var authToken = "2b7c24e00568614f18aa46fd33716e74"; // Your Auth Token from www.twilio.com/console
  //
  // var client = require("twilio")(accountSid, authToken);

  const credentials = await Twilio_feedbackwow_credentials.findOne();
  if (!credentials) throw "CREDENTIALS NOT FOUND";

  const client = require("twilio")(credentials.sid, credentials.auth_token);

  sendSms = await client.messages.create({
      // from: "+18572693855", // From a valid Twilio number
      from: "+18329811222", // From a valid Twilio number
      to: mobile_no, // Text this number
      body: "Thankyou for using FeedbackWow. Your verification code is : " + code,
      statusCallback: 'https://server.feedbackwow.org/webhooks/smsstatus'
      // statusCallback: 'http://feedbackwow-server.us-west-2.elasticbeanstalk.com/webhooks/smsstatus'
      // statusCallback: 'https://server.feedbackwow.org/webhooks/smsstatus'
  });
  //  ERROR HANDLING IF ELSE
  // console.log(_.omit(message, "_version"));
  return _.omit(sendSms, "_version");

});

module.exports = {
  findQuestionChoices_mms,
  findQuestionmmslabels,
  sendSurvey_mms,
  findOldestQueued,
  findFirstQuestion,
  findQuestionChoices,
  sendSurvey,
  updateRecords,
  sendVerificationCode,
  sendPassword
}
