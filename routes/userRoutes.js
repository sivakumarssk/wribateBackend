const express = require("express");
const { sendOtp, register, login, forgotPassword, resetPassword } = require("../controller/authController");
const { createWribate, getAllWribate, getsingleWribate, myWribates } = require("../controller/startWribateController");
const authenticateToken = require("../middlerware/authMiddleware");

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

//start wribate
router.post("/createWribate",authenticateToken,createWribate)
router.get("/getAllWribates",authenticateToken,getAllWribate)
router.get("/getsingleWribate/:id",authenticateToken,getsingleWribate)
router.get("/myCreatedWribates",authenticateToken,myWribates)

module.exports = router;
