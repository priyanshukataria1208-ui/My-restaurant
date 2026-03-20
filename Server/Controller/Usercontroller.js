const User = require("../Models/User");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../utlis/jwt");
const jwt = require("jsonwebtoken");
const transporter = require("../services/templates/emailservice");
const registerTemplates = require("../services/templates/registerTemplate");
const crypto = require("crypto");
const resertemplate = require("../services/templates/resettemplate");
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

exports.Register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        status: 400,
        message: "name, email, password and phone are required",
      });
    }

    const usercheck = await User.findOne({ name });
    if (usercheck) {
      return res.status(401).json({
        status: 401,
        message: "Username is already taken",
      });
    }

    const emailcheck = await User.findOne({ email });
    if (emailcheck) {
      return res.status(409).json({
        status: 409,
        message: "Email is already registered",
      });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const record = new User({
      name,
      email,
      password: hashedPass,
      phone,
      role: "customer",
      accountTypes: "REGISTERED",
    });

    await record.save();

    try {
      const info = await transporter.sendMail({
        from: '"priyanshukataria1208@gmail.com',
        to: record.email,
        subject: "Hello",
        text: registerTemplates(record.name, "Comit"),
      });
      console.log("Message sent:", info.messageId);
    } catch (mailError) {
      console.log("REGISTER MAIL ERROR:", mailError.message);
    }

    return res.status(201).json({
      status: 201,
      apiData: record,
      message: "Successfully Registered",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.Login = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({
        success: false,
        message: "name and password are required",
      });
    }

    const user = await User.findOne({ name });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Password",
      });
    }

    const effectiveRole =
      user.accountTypes === "REGISTERED" && user.role === "guest"
        ? "customer"
        : user.role;

    const tokenPayload = {
      name: user.name,
      email: user.email,
      role: effectiveRole,
      id: user._id,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    user.refreshToken = refreshToken;
    user.refreshTokenExpiresTime = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );
    user.lastlogin = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      accessToken,
      refreshToken,
      user: {
        name: user.name,
        email: user.email,
        role: effectiveRole,
        id: user._id,
      },
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetLink = `${frontendUrl}/reset-password/${resetToken}`;

    const info = await transporter.sendMail({
      from: '"priyanshukataria1208@gmail.com',
      to: user.email,
      subject: "Hello",
      html: resertemplate(user.name, resetLink),
    });
    console.log("Message sent:", info.messageId);

    return res.status(200).json({
      success: true,
      message: "Reset password link sent to email",
    });
  } catch (error) {
    console.log("FORGOT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.ResetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token invalid or expired",
      });
    }

    const hashedPass = await bcrypt.hash(req.body.password, 10);

    user.password = hashedPass;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.log("RESET ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    let decoded;
    try {
      decoded = jwt.verify(
        refreshToken,
        "6971cd8ae32d2e2fd4b9f4b03a19c2c937e837f900402aa733279e14"
      );
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          error: "Refresh token expired",
        });
      }
    }

    console.log(decoded);
    const user = await User.findOne({ _id: decoded.id });
    if (!user.refreshToken) {
      return res.json({
        success: false,
        message: "No refresh token found in db",
      });
    }
    if (user.refreshTokenExpiresTime < new Date()) {
      return res.send("Refresh token expired");
    }

    const accessToken = generateAccessToken({
      name: user.name,
      email: user.email,
      role: user.role,
      id: user._id,
    });
    res.json({
      success: true,
      accessToken,
    });
  } catch (error) {
    res.json({
      message: error.name,
    });
  }
};
