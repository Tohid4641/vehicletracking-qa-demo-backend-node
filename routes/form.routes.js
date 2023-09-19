const { submitFormDetails, getGeoDetails, handleOtpVerification, getToken, sendDemoPath, getDemoPath, getUserDetails, sendToken } = require("../controller/form.controller");

const router = require("express").Router();

// Vehicle Tracking QA Form API's
router.post("/submit-details", submitFormDetails)
router.get("/get-geo-details", getGeoDetails)
router.post("/handle-otp", handleOtpVerification)

router.post('/send-demo-path',sendDemoPath)
router.get('/get-demo-path',getDemoPath)

router.post('/send-token',sendToken)
router.get('/get-token',getToken)

router.get('/get-user-details/:token',getUserDetails)


module.exports = router;
