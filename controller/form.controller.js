const { generateOtp } = require("../services/generateOtp");
const { ipStackApiCall } = require("../services/ipStackApiCall");
const { officeCallerLead } = require("../services/officeCallerLead");
const { twilioSendOtp } = require("../services/twilioSendOtp");
const jwt = require("jsonwebtoken");
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./storage');
const {textlocalSendOtp} = require('../services/textlocalSendOtp.js');
const { checkPhoneNumber } = require("../validators/phoneNumberValidator");
const path = require('path');
const ejs = require('ejs');
const { sendgridOtpSend } = require("../services/sendgridOtpSend");

require('dotenv').config();

// Get users geo details
exports.getGeoDetails = async (req, res) => {
  let pure_ip = req.header("x-forwarded-for") || req.socket.remoteAddress || req.ip || req.connection.remoteAddress;

  try {


    // const ipAddress = "::ffff:106.193.146.135";
    // const ipAddress = "::ffff:106.193.146.135";

    const splitIP = pure_ip.split(':');

    const ipComponents = {
      prefix: splitIP[0],
      address: splitIP[splitIP.length - 1]
    };

    console.log(ipComponents);

    let geoData = await ipStackApiCall(
      pure_ip == "::1" ? "47.29.129.0" : ipComponents.address
    );

    res.status(200).json({
      result: true,
      data: geoData,
      message: "successfully fetch user's geo details !",
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      message: error.message,
    });
  }
};

let otpStorage = [];
var saveUtmSource = '';
var saveDemoPath = '';

// Handler function for OTP operations
exports.handleOtpVerification = async (req, res) => {
  try {
    let { action, number, otp, email } = req.body;

    console.log("req.body ==> ",req.body);

    // Validation
    if (!number) {
      return res.status(400).json({ error: "Invalid number" });
    }
    if (!action || typeof action !== "string") {
      return res.status(400).json({ error: "Invalid action type" });
    }
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Invalid email" });
    }

    // Send OTP logic here
    if (action === "send") {
      otpStorage = [];

      // Generate OTP (replace this with your own OTP generation code)
      let generatedOtp = generateOtp();

      otpStorage.push({ otp: generatedOtp, timestamp: Date.now() });
       /*
      =======================================================================
                                    OTP SENT
      =======================================================================
      */
        let numberIs = checkPhoneNumber(number);
        let response;
        let smsResponse;
        let mailResponse;
        let currentDomain = saveUtmSource?.match(/\/\/([^/?#]+)/)[1];
        
        console.log("currentDomain", currentDomain);

        // Sendgride otp mail template
        const otp_templatePath = path.join(__dirname ,"../views/vt_demo_otp_template.ejs");
        const otp_templatePath_mail = await ejs.renderFile(otp_templatePath,{otp:generatedOtp});

        if(numberIs == 'indian'){
          // TextLoacal SMS
          if(process.env.NODE_ENV == 'production'){
            smsResponse = await textlocalSendOtp(number,generatedOtp,currentDomain);
            mailResponse = await sendgridOtpSend(email,otp_templatePath_mail,generatedOtp,currentDomain);
            response = { status:'success',mode:'production', smsResponse, mailResponse }
          }else{
            response = {
              status:'success',
              mode:'testing',
              otp:generatedOtp,
              smsResponse,mailResponse
            }
          }
        }
        else if(numberIs == 'international'){
          // Twilio SMS
          if(process.env.NODE_ENV == 'production'){
            smsResponse = await twilioSendOtp(number, generatedOtp, currentDomain);
            mailResponse = await sendgridOtpSend(email,otp_templatePath_mail,generatedOtp,currentDomain);
            response = { status:'success',mode:'production', smsResponse, mailResponse }
          }else{
            response = {
              status:'success',
              mode:'testing',
              otp:generatedOtp,
              smsResponse,mailResponse
            }
          }
        }
        else{
          return res.status(401).json({ success: false, message: "Invalid phone number!" });
        }
      /*======================================================================================= */

      console.log("Response ::: ", response);

      // if(smsResponse.status != 'success'){
      //   return res.json({
      //     success: false,
      //     expiry: 0,
      //     message: "Failed to sent SMS OTP!",
      //   });
      // }
        

      let addDetails = localStorage.setItem(`user-${number}`, JSON.stringify(otpStorage));

      return res.json({
        success: true,
        expiry: 60,
        message: "OTP sent successfully",
        response: process.env.NODE_ENV == "testing" ? response : undefined
      });


      // Verify OTP logic here
    } else if (action === "verify") {
      // Find the OTP in the storage and check if it's valid
      let otpEntry = otpStorage.find((entry) => entry.otp == parseInt(otp));
      if (otpEntry) {
        let currentTime = Date.now();
        let elapsedTime = currentTime - otpEntry.timestamp;

        if (elapsedTime <= 1 * 60 * 1000) {
          // Check if less than 1 minutes have passed
          otpStorage = [];
          const token = jwt.sign({ success: true }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRY,
          });
          
          let userDetails= JSON.parse(localStorage.getItem(`user-${number}`));
          userDetails[0].token=token
          localStorage.setItem(`user-${number}`, JSON.stringify(userDetails));


              console.log("userDetails",userDetails);

          return res.cookie("token", token).json({
            success: true,
            message: "OTP verification successful",
            token,
          });
        } else {
          otpStorage = [];
          return res
            .status(401)
            .json({ success: false, message: "OTP expired" });
        }
      } else {
        otpStorage = [];
        return res.status(401).json({ success: false, message: "Invalid OTP" });
      }
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid action" });
    }
  } catch (error) {
    res.status(500).json({
      result: false,
      message: error.message,
    });
  }
};

// Custom validation function for the number field
const validateNumber = (number) => {
  const numberRegex = /^\+?\d{1,15}$/;
  return numberRegex.test(number);
};


exports.submitFormDetails = async (req, res) => {
  try {
    const { name, email, country, city, number, utm_source } = req.body;

    // Custom validation logic
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Invalid name" });
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid email" });
    }

    if (!country || typeof country !== "string") {
      return res.status(400).json({ error: "Invalid country" });
    }

    if (!city || typeof city !== "string") {
      return res.status(400).json({ error: "Invalid city" });
    }

    if (!number) {
      return res.status(400).json({ error: "Invalid number" });
    }

    if (!utm_source || typeof utm_source !== "string") {
      return res.status(400).json({ error: "Invalid utm source" });
    }

    let currentDemo = saveDemoPath;
    let currentDomain = utm_source?.match(/\/\/([^/?#]+)/)[1];

    // Save deatils in CRM
    const saveLead = await officeCallerLead(
      name,
      email,
      number,
      city,
      country,
      `${currentDomain == "fleetmanagement.ae" ? "FM" : "VT"} Demo - ${currentDemo}`,
      utm_source  
    );
    console.log(saveLead);

    let userDetails= JSON.parse(localStorage.getItem(`user-${number}`));  // fetch existing

    // console.log("userDetails",userDetails);
    
    if(userDetails != null){ 
      userDetails[0].name=name
      userDetails[0].email=email
      userDetails[0].country=country
      userDetails[0].city=city
      userDetails[0].number=number
      userDetails[0].utm_source=utm_source
      localStorage.setItem(`user-${number}`, JSON.stringify(userDetails)); // update existing
    }else{
      localStorage.setItem(`user-${number}`, JSON.stringify({ // add new
        name,email,country,city,number,utm_source
      }));
    }


    res.status(200).json({
      result: true,
      message: "form submitted successfully !",
      data:JSON.parse(localStorage.getItem(`user-${number}`))
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      message: error.message,
    });
  }
};


exports.getToken = (req, res) => {
  const token = req.cookies.token
  res.status(200).json({
    result: true,
    token
  })
}

exports.sendDemoPath = (req, res) => {

  let demoPath = req.body.demoPath;
  let utm_source = req.body.utm_source;

  if (!demoPath || typeof demoPath !== "string") {
    return res.status(400).json({ error: "Invalid Demo Path" });
  }
  if (!utm_source || typeof utm_source !== "string") {
    return res.status(400).json({ error: "Invalid utm source" });
  }

  saveDemoPath = demoPath;
  saveUtmSource = utm_source;

  if (saveDemoPath != '' && saveUtmSource != '') {
    return res.status(200).json({
      result: true,
      message: 'demo path and utm source saved'
    })
  } else {
    return res.status(200).json({
      result: false,
      message: 'somthing went wrong!'
    })
  }
}

exports.getDemoPath = (req, res) => {
  if (saveDemoPath != '' && saveUtmSource != '') {
    return res.status(200).json({
      result: true,
      path: saveDemoPath,
      utm_source: saveUtmSource
    })
  } else {
    return res.status(200).json({
      result: false,
      message: 'somthing went wrong!'
    })
  }
}

exports.getUserDetails=async(req, res)=>{
let token=req.params.token
console.log('token',token)
let result=[]
for (let i = 0; i < localStorage.length; i++) {
  const file = localStorage.key(i);
  const foundData = searchDataByToken(file, token);
  console.log('foundData',foundData)
  if (foundData) {
    result.push(foundData)
    break; // Exit loop if data is found in any file
  }
}
console.log('result.length',result.length)
if (Array.isArray(result) && result.length > 0) {
  res.status(200).send({
    result:true,
    message:"User Details",
    data:result[0]
  })
} else {
  console.log('>>>>>>>>>>>>>>>Else')
  res.status(404).send({
    result:false,
    message:"User Details not found",
  })
}
}


function searchDataByToken(file, token) {
  const data = JSON.parse(localStorage.getItem(file));
  if (data) {
    const foundData = data.find((item) => item.token === token);
    return foundData;
  }
  return null;
}


var saveToken = '';

exports.sendToken = (req, res) => {

  let token = req.body.token;

  if (!token || typeof token !== "string") {
    return res.status(400).json({ error: "Invalid Demo token" });
  }

  saveToken = token;


  if (saveToken != '') {
    return res.status(200).json({
      result: true,
      message: 'demonToken saved'
    })
  } else {
    return res.status(200).json({
      result: false,
      message: 'somthing went wrong!'
    })
  }
}

exports.getToken = (req, res) => {
  if (saveToken != '') {
    return res.status(200).json({
      result: true,
      token: saveToken,
    })
  } else {
    return res.status(200).json({
      result: false,
      message: 'somthing went wrong!'
    })
  }
}