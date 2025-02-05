const User = require("../model/User");
const Otp = require("../model/Otp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Email transport setup
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASS },
});

// Generate & Send OTP
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user && user.verified) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    await Otp.findOneAndDelete({ email });

    const otpEntry = new Otp({ email, otp });
    await otpEntry.save();

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "OTP sent to email." });
  } catch (error) {
    console.log(error);    
    res.status(500).json({ error: "Server error" });
  }
};

// Register User with OTP Verification
exports.register = async (req, res) => {
  try {
    const { username, email, password, otp } = req.body;

    const validOtp = await Otp.findOne({ email, otp });
    if (!validOtp) return res.status(400).json({ message: "Invalid or expired OTP." });

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already registered." });

    const user = new User({ username, email, password, verified: true });
    await user.save();
    await Otp.deleteOne({ email });

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.verified) return res.status(400).json({ message: "Please verify your email first." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Forgot Password (OTP Based)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    await Otp.findOneAndDelete({ email });

    const otpEntry = new Otp({ email, otp });
    await otpEntry.save();

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Password reset OTP sent." });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const validOtp = await Otp.findOne({ email, otp });
    if (!validOtp) return res.status(400).json({ message: "Invalid or expired OTP." });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    user.password = newPassword;
    await user.save();
    await Otp.deleteOne({ email });

    res.json({ message: "Password reset successfully." });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
