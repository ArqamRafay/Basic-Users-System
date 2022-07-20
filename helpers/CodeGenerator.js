const asyncHandler = require("./asyncMiddleware"),
  verificationCode = require("./sms"),
  sendMail = require("../helpers/sendMail"),
  sms_verification = require("../models").verification;

const emailValidate= async(email)=>{
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

// const generate = asyncHandler(async (user_id, mobile_no,email_account,is_email_verified,is_sms_verified,regen) => {
  const generate = asyncHandler(async (data) => {

  var checkemail;
  var email;
  var email_account=data.email;
  var regen= data.regen;
  var user_id= data.userId;
  var mobile_no= data.num;
  var is_email_verified=data.is_email_veri;
  var is_sms_verified= data.is_sms_veri;

  if(email_account!=null || regen==true ){


    email=email_account;
     checkemail= await emailValidate(email);
     if(checkemail== true){

       let expire_date = new Date();
       expire_date.setHours(expire_date.getHours() + 1);

       const email_codeCheck = await sms_verification.findOne({
         where: { user_id: user_id }
       });

       let verification, result, veri_email, result_email, email_data;

       if (email_codeCheck && email_codeCheck.email_code && is_email_verified!=true) {
         veri_email = await sms_verification.update(
           {
             email_code: Math.floor(Math.random() * 90000) + 10000,
             email_expire_date: expire_date
           },
           {
             where: { user_id: user_id },
             returning: true
           }
         );
         result_email = veri_email[1][0];
       }
       else {
         veri_email = await sms_verification.create({
           email_code: Math.floor(Math.random() * 90000) + 10000,
           email_expire_date: expire_date,
           user_id: user_id
         });
         result_email = veri_email;
       }

       //SEND CODE TO email
       email_data={
         "to":email_account,
         "from": "no-reply@feedbackwow.com",
         "text": "Thankyou for signing up on Feedback Wow. Your verification code is "+ result_email.email_code,
         "subject": "Email Verification"
       }
       let email = await sendMail.sendMail(email_data);
   // if user enter mobile num
       if(mobile_no && mobile_no!=null){
         let expire_date = new Date();
         expire_date.setHours(expire_date.getHours() + 1);

         const codeCheck = await sms_verification.findOne({
           where: { user_id: user_id }
         });

         let verification, result;

         if (codeCheck && is_sms_verified!=true) {
           verification = await sms_verification.update(
             {
               sms_code: Math.floor(Math.random() * 90000) + 10000,
               sms_expire_date: expire_date
             },
             {
               where: { user_id: user_id },
               returning: true
             }
           );
           result = verification[1][0];
         }
         else {
           verification = await sms_verification.create({
             sms_code: Math.floor(Math.random() * 90000) + 10000,
             sms_expire_date: expire_date,
             user_id: user_id
           });
           result = verification;
         }
         //SEND CODE TO MOBILE NUMBER
         sendsms = await verificationCode.sendVerificationCode(mobile_no, result.sms_code);
         return result;

       }
        return result_email;
     }
  }




});

const reGenerateemail= asyncHandler(async(user_id, email_account,is_email_verified)=>{
  if(email_account!=null || regen==true ){


    email=email_account;
     checkemail= await emailValidate(email);
     if(checkemail== true){

       let expire_date = new Date();
       expire_date.setHours(expire_date.getHours() + 1);

       const email_codeCheck = await sms_verification.findOne({
         where: { user_id: user_id }
       });

       let verification, result, veri_email, result_email, email_data;

       if (email_codeCheck && email_codeCheck.email_code && is_email_verified!=true) {
         veri_email = await sms_verification.update(
           {
             email_code: Math.floor(Math.random() * 90000) + 10000,
             email_expire_date: expire_date
           },
           {
             where: { user_id: user_id },
             returning: true
           }
         );
         result_email = veri_email[1][0];
       }
       else {
         veri_email = await sms_verification.create({
           email_code: Math.floor(Math.random() * 90000) + 10000,
           email_expire_date: expire_date,
           user_id: user_id
         });
         result_email = veri_email;
       }

       //SEND CODE TO email
       email_data={
         "to":email_account,
         "from": "no-reply@feedbackwow.com",
         "text": "Thankyou for using Feedback Wow. Your verification code is "+ result_email.email_code,
         "subject": "Email Verification"
       }
       let email = await sendMail.sendMail(email_data);

        return result_email;
     }
  }
});

const reGeneratesms= asyncHandler(async(user_id, mobile_no,is_sms_verified)=>{
  // if user enter mobile num
      if(mobile_no && mobile_no!=null && is_sms_verified!= true){

        let expire_date = new Date();
        expire_date.setHours(expire_date.getHours() + 1);

        const codeCheck = await sms_verification.findOne({
          where: { user_id: user_id }
        });

        let verification, result;

        if (codeCheck) {
          verification = await sms_verification.update(
            {
              sms_code: Math.floor(Math.random() * 90000) + 10000,
              sms_expire_date: expire_date
            },
            {
              where: { user_id: user_id },
              returning: true
            }
          );
          result = verification[1][0];
        }
        else {
          verification = await sms_verification.create({
            sms_code: Math.floor(Math.random() * 90000) + 10000,
            sms_expire_date: expire_date,
            user_id: user_id
          });
          result = verification;
        }
        //SEND CODE TO MOBILE NUMBER
        sendsms = await verificationCode.sendVerificationCode(mobile_no, result.sms_code);
        return result;

      }

})
module.exports = {
  generate,
  reGeneratesms,
  reGenerateemail
};
