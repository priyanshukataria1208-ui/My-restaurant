const router = require("express").Router();
const { generateAccessToken, generateRefreshToken } = require("../utlis/jwt")
const UserC = require("../Controller/Usercontroller");
const SessionTokenVerify = require("../middleware/SessionTokenVerify")

var admin = require("firebase-admin");

var serviceAccount = require("../key/test-e872e-firebase-adminsdk-fbsvc-4035a1735e.json");
const User = require("../Models/User");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/register", UserC.Register);
router.post("/login", UserC.Login);
router.post("/forgot-password", UserC.ForgotPassword);
router.post("/reset-password/:token", UserC.ResetPassword);

router.post("/convert", SessionTokenVerify, (req, res) => {
  console.log("Hello")
})


router.post("/google/verify", async (req, res, next) => {
  try {
    // Google frontend se credential aata hai
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google token missing",
      });
    }

    const { user, accessToken, refreshToken } =
      await googleAuthServiece(credential);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/refresh', UserC.refresh)


module.exports = router;
