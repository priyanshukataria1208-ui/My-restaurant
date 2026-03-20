const router = require("express").Router();
const { generateAccessToken, generateRefreshToken } = require("../utlis/jwt");
const UserC = require("../Controller/Usercontroller");
const SessionTokenVerify = require("../middleware/SessionTokenVerify");
const User = require("../Models/User");
const { admin, hasFirebaseAdminConfig } = require("../config/firebaseadmin");

const createUniqueUserName = async (baseName) => {
  let candidate = (baseName || "user").trim().replace(/\s+/g, "_");
  if (!candidate) {
    candidate = "user";
  }

  let suffix = 0;
  let uniqueName = candidate;

  while (await User.findOne({ name: uniqueName })) {
    suffix += 1;
    uniqueName = `${candidate}_${suffix}`;
  }

  return uniqueName;
};

router.post("/register", UserC.Register);
router.post("/login", UserC.Login);
router.post("/forgot-password", UserC.ForgotPassword);
router.post("/reset-password/:token", UserC.ResetPassword);

router.post("/convert", SessionTokenVerify, (req, res) => {
  console.log("Hello")
})


router.post("/google/verify", async (req, res, next) => {
  try {
    if (!hasFirebaseAdminConfig) {
      return res.status(503).json({
        success: false,
        message:
          "Google login is not configured. Add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.",
      });
    }

    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google token missing",
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(credential);
    const email = decodedToken.email;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Google account email not found",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      const baseName =
        decodedToken.name ||
        email.split("@")[0] ||
        "google_user";
      const uniqueName = await createUniqueUserName(baseName);

      user = await User.create({
        name: uniqueName,
        email,
        password: "",
        phone: decodedToken.phone_number || "",
        role: "customer",
        accountTypes: "REGISTERED",
        isActive: true,
        totalOrders: 0,
        totalSpend: 0,
        loyaltyPoints: 0,
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

    res.status(200).json({
      success: true,
      message: "Google Login Successful",
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
    next(error);
  }
});

router.post('/refresh', UserC.refresh)


module.exports = router;
