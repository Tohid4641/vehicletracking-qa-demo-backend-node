const request = require("request");
require('dotenv').config();
const { TXTLCL_API_KEY, TXTLCL_SENDER, TXTLCL_OTP_TEMPLATE_VT, TXTLCL_OTP_TEMPLATE_FM } = process.env;


exports.textlocalSendOtp = async (number,otp,currentDomain) => {
  var options = {
    url:`https://api.textlocal.in/send/?apikey=${TXTLCL_API_KEY}&numbers=${number}&sender=${TXTLCL_SENDER}&message=${currentDomain == "fleetmanagement.ae" ? otp+TXTLCL_OTP_TEMPLATE_FM : otp+TXTLCL_OTP_TEMPLATE_VT}`,
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    },
  };
  // console.log("options",options);
  return new Promise((resolve, reject) => {
    request(options, function (error, response) {
      if (error) {
        reject(error);
      }else{
        // console.log("smsApicall resp",response.body)
        resolve(JSON.parse(response.body));
      }
    });
  });
};