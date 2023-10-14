var express = require("express");
router = express.Router();
const { signup, signin, forgotPassword } = require("../controllers/authentication");

router.post("/register", signup);
router.post("/login", signin);
router.post("/forgot-password", forgotPassword);

module.exports = router;