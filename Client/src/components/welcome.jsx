import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { UserPlus, LogIn, User, Sparkles } from "lucide-react";
import { useDispatch } from "react-redux";
import { session } from "../Features/guestSlice";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

const Welcome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { login } = useContext(AuthContext);

  const qrSlug = searchParams.get("qrSlug");

  const getDeviceId = () => {
    let id = localStorage.getItem("deviceId");
    if (!id) {
      id =
        crypto?.randomUUID?.() ||
        `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem("deviceId", id);
    }
    return id;
  };

  const handleContinueAsGuest = async () => {
    try {
      const deviceId = getDeviceId();

      // ✅ create guest session
      const res = await dispatch(
        session({ deviceId, qrSlug })
      ).unwrap();

      // ✅ sync with AuthContext (IMPORTANT)
      login(
        null,        // ❌ guest has no accessToken
        "guest",     // role
        deviceId,    // use deviceId as userId
        "Guest"      // display name
      );

      navigate("/");
    } catch (err) {
      console.error("Guest session failed:", err);
    }
  };

  return (
    <div className="super-bg min-h-screen flex items-center justify-center px-6 py-10 relative overflow-hidden">

      {/* Color Particles */}
      <div className="particle p1"></div>
      <div className="particle p2"></div>
      <div className="particle p3"></div>
      <div className="particle p4"></div>

      <div className="relative w-full max-w-md mx-auto animate-fadeUp">

        {/* Logo Section */}
        <div className="text-center mb-12 animate-fadeScale">
          <div className="flex justify-center mb-6">
            <div className="logo-box">
              <img src="logo.png" alt="" />
            </div>
          </div>

          <h1 className="title-glow">Food</h1>
          <p className="subtitle">Restaurant Management</p>

          <p className="desc">
            Experience fine dining with our curated menu and exceptional service
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-5 mb-8">
          <Link to="/Reg" className="btn-colorful group">
            <UserPlus className="w-5 h-5 group-hover:scale-125 transition" />
            Register
          </Link>

          <Link to="/Login" className="btn-outline group">
            <LogIn className="w-5 h-5 group-hover:scale-125 transition" />
            Login
          </Link>

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <span className="flex-1 h-px bg-white/20"></span>
            <span className="text-xs text-white/60">OR</span>
            <span className="flex-1 h-px bg-white/20"></span>
          </div>

          <button
            onClick={handleContinueAsGuest}
            className="btn-glassy group mt-2"
          >
            <User className="w-5 h-5 group-hover:scale-125 transition" />
            Continue as Guest
          </button>
        </div>

        {/* Benefits */}
        <div className="glass-card animate-slideUp">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-pink-300 animate-pulse" />
            <h3 className="benefit-title">Why Join Us?</h3>
          </div>

          <ul className="benefit-list">
            <li>Earn loyalty points on every order</li>
            <li>Exclusive member discounts and offers</li>
            <li>Priority support and faster service</li>
            <li>Track your order history and preferences</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Welcome;
