const { automaticDemo } = require("../controller/automaticDemo.controller");
const verifyToken = require("../middlewares/authorization");

const router = require("express").Router();

// Vehicle Tracking Demo API's
router.post("/",verifyToken,automaticDemo);

module.exports = router;
