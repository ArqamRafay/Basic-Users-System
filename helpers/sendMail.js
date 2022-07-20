const asyncHandler = require('./asyncMiddleware');

const events = asyncHandler(async (eID) => {
  var api_key = 'key-c41211a47e9454d935d95aa3ced164d8';
  var domain = 'feedbackwow.net';
  var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });

  return await mailgun.get(`/${domain}/events`, { "message-id": eID, "event": "delivered OR failed" });
});

const sendMail = async (data) => {
  // var api_key = 'key-59737dc73a7a97cfa26ff8c92f25017d';
  // var domain = 'sandbox6d9a645fa1ef49628c5fc0c56decb58e.mailgun.org';
  var api_key = 'key-c41211a47e9454d935d95aa3ced164d8';
  var domain = 'feedbackwow.net';
  var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });
  console.log('Start: send Mail info');
  console.log(data);
  console.log('End: send mail info');
  var body = {
    from: data.from,
    to: data.to.toString(),
    // bcc: data.bcc.toString(),
    subject: data.subject,
    text: data.text,
    // html: `<html><head></head><body><h1>Hello Nadir</h1><br /><p>${data.text}</p></body></html>`,
    "o:tag": [data.distribution_id, 'distribution_id'],
    "o:tracking": "yes",
    "o:tracking-opens": "yes",
    "o:tracking-clicks": "yes",
  };
  try {
    let se = await mailgun.messages().send(body);
    return se;

  } catch (err) {
    return err;
  };

  // mailgun.messages().send(body).then(result => {
  //   // return result ;
  //   console.log("heeelloooo");
  // })
  // .catch(err => {
  //   console.log('ERRRRRRRRRRRR :', err);
  //   return err;
  // })
}

// original api sendmail

// const sendMail = asyncHandler(async (data) => {
//     // var api_key = 'key-59737dc73a7a97cfa26ff8c92f25017d';
//     // var domain = 'sandbox6d9a645fa1ef49628c5fc0c56decb58e.mailgun.org';
//     var api_key = 'key-c41211a47e9454d935d95aa3ced164d8';
//     var domain = 'feedbackwow.net';
//     var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
//
//   var body = {
//     from: data.from,
//     to: data.to.toString(),
//     // bcc: data.bcc.toString(),
//     subject: data.subject,
//     text: data.text,
//     "o:tag": [data.distribution_id, 'distribution_id'],
//     "o:tracking" :"yes",
//     "o:tracking-opens" : "yes",
//     "o:tracking-clicks" : "yes",
//   };
//   return await mailgun.messages().send(body);
// });
module.exports = {
  sendMail,
  events
}
