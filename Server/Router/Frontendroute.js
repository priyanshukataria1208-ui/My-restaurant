const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const { generateAccessToken, generateRefreshToken } = require("../utlis/jwt")
const UserC = require("../Controller/Usercontroller");
const SessionTokenVerify = require("../middleware/SessionTokenVerify")

var admin = require("firebase-admin");
const User = require("../Models/User");

const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const firebaseKeyPath = path.join(
  __dirname,
  "..",
  "key",
  "test-e872e-firebase-adminsdk-fbsvc-4035a1735e.json"
);
const isGoogleAuthConfigured =
  Boolean(process.env.GOOGLE_CLIENT_ID) && fs.existsSync(firebaseKeyPath);

if (isGoogleAuthConfigured && !admin.apps.length) {
  const serviceAccount = require(firebaseKeyPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

router.post("/register", UserC.Register);
router.post("/login", UserC.Login);
router.post("/forgot-password", UserC.ForgotPassword);
router.post("/reset-password/:token", UserC.ResetPassword);

router.post("/convert", SessionTokenVerify, (req, res) => {
  console.log("Hello")
})


router.post("/google/verify", async (req, res, next) => {
  try {
    if (!isGoogleAuthConfigured) {
      return res.status(503).json({
        success: false,
        message:
          "Google login is not configured. Add GOOGLE_CLIENT_ID and the Firebase service account key file.",
      });
    }

    // Google frontend se credential aata hai
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google token missing",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    res.status(200).json({
      success: true,
      message: "Google token verified",
      data: payload,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/refresh', UserC.refresh)


module.exports = router;
