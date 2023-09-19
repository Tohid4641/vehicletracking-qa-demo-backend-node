const { manualDemoNext, manualDemoPrev, manualDemoReset } = require("../controller/manualDemo.controller");
const verifyToken = require("../middlewares/authorization");

const router = require("express").Router();

// Vehicle Tracking Demo API's
router.get('/reset',verifyToken,manualDemoReset);
router.post("/next",verifyToken, manualDemoNext)
router.post("/prev",verifyToken,manualDemoPrev)

module.exports = router;
