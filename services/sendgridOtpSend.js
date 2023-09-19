const sgMail = require('@sendgrid/mail');
require('dotenv').config()

exports.sendgridOtpSend = async (customer_mail, customer_mail_template,otp, current_domain_text) => {

    // let admin_ID = "info@testbytes.net";
    let admin_ID = "info@fleetmanagement.ae";
    let admin_mail = "info@fleetmanagement.ae";
    
    sgMail.setApiKey(process.env.SENDGRID_APY_KEY);

    const messageForCustomer = {
        from: admin_ID, // Change to your verified sender
        to: customer_mail, // Change to your recipient
        subject: `OTP is ${otp} for your ${current_domain_text == "fleetmanagement.ae" ? "Fleet Management" : "Vehicle Tracking"} Demo`,
        text: 'testing',
        html: customer_mail_template,
    };

    try {
        customer_sent = await sgMail.send(messageForCustomer);
        // console.log("customer_sent Response",customer_sent[0].statusCode);
        // console.log("customer_sent Response",customer_sent[0].headers);
 
        
        if ((customer_sent[0].statusCode == 200 || customer_sent[0].statusCode == 202 || customer_sent[0].statusCode == "200" || customer_sent[0].statusCode == "202") ) {


            return {
                customer_sent : 1,
                admin_sent : 1,
                message:"success",
                result : 'Please check your mail, including spam folder.',
            };

        };
        
    } catch (error) {
        return {
                mail_sent : 0,
                message:error,
                result : 'Something Went wrong.',
            };
    };

};
