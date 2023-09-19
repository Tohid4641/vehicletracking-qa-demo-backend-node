const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM } = process.env;
const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);


exports.twilioSendOtp = async (recipientPhoneNumber,otp, currentDomainText) => {

  try {
    client.messages
    .create({
      body: `OTP is ${otp}. One time password to proceed on ${currentDomainText == "fleetmanagement.ae" ? "Fleet Management" : "Vehicle Tracking"} Free Demo. It is valid for 1 minutes. Do not share your OTP with anyone. Have a great day!`,
      from: TWILIO_FROM,
      to: recipientPhoneNumber,
    })
    .then((res) => {
      console.log('OTP sent successfully by twilio!',res);
      return {
        status:'success',
        response:res
      }
    })
    .catch((error) => {
      console.error('Failed to send OTP:', error.message);
      return {
        status:'failure',
        response:error
      }
    });

  } catch (error) {
    return {
      status:'failure',
      response:error
    }
  }
};
