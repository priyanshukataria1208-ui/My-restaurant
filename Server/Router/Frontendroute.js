const router = require("express").Router();
const { generateAccessToken, generateRefreshToken } = require("../utlis/jwt")
const UserC = require("../Controller/Usercontroller");
const SessionTokenVerify = require("../middleware/SessionTokenVerify")

router.post("/register", UserC.Register);
router.post("/login", UserC.Login);
router.post("/forgot-password", UserC.ForgotPassword);
router.post("/reset-password/:token", UserC.ResetPassword);

router.post("/convert", SessionTokenVerify, (req, res) => {
    console.log("Hello")
})

var admin = require("firebase-admin");

var serviceAccount = require("../key/test-e872e-firebase-adminsdk-fbsvc-9dc7f5ea0e.json");
const User = require("../Models/User");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

router.post("/google/verify", async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({
                success: false,
                message: "ID Token missing",
            });
        }

        // 🔐 Google token verify (Firebase Admin)
        const decoded = await admin.auth().verifyIdToken(idToken);

        const { email, name, uid } = decoded;

        // 👤 User check
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                googleId: uid,
                role: "user",
            });
        }

        // 🔑 JWT using separate file
        const accessToken = generateAccessToken({
            id: user._id,
            role: user.role,
        });

        const refreshToken = generateRefreshToken({
            id: user._id,
        });

        return res.status(200).json({
            success: true,
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
            },
        });

    } catch (error) {
        console.error("Google Verify Error:", error);

        return res.status(401).json({
            success: false,
            message: "Google token verification failed",
        });
    }
})
router.post('/refresh', UserC.refresh)


module.exports = router;
