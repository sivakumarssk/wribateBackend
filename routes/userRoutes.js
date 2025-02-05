const express = require("express");
const { sendOtp, register, login, forgotPassword, resetPassword } = require("../controller/authController");

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
