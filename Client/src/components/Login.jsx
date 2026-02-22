import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "./context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { auth, googleProvider } from "../../../Server/config/firebase";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";

import {
  Theme,
  Card,
  Text,
  TextField,
  Button,
  Flex,
  Link
} from "@radix-ui/themes";

import "@radix-ui/themes/styles.css";
import Loader from "./Loading";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const [formdata, setFormData] = useState({
    name: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // ✅ NORMAL LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:3000/api/v1/login",
        formdata
      );

      if (!res.data.success) {
        toast.error("Invalid credentials");
        return;
      }

      login(
        res.data.accessToken,
        res.data.user.role,
        res.data.user.id,
        res.data.user.name,
        res.data.refreshToken
      );

      toast.success("Login Successful");
      navigate(res.data.user.role === "admin" ? "/admindash" : "/");

    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false); // 🔥 loader always OFF
    }
  };

  // ✅ GOOGLE LOGIN (FIXED)
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const popupResult = await signInWithPopup(auth, googleProvider);
      const idToken = await popupResult.user.getIdToken();

      const res = await axios.post(
        "http://localhost:3000/api/v1/google/verify",
        { idToken }
      );

      if (!res.data.success) {
        throw new Error("Google login failed");
      }

      login(
        res.data.accessToken,
        res.data.user.role,
        res.data.user.id,
        res.data.user.name,
        res.data.refreshToken
      );

      toast.success("Google Login Successful");
      navigate(res.data.user.role === "admin" ? "/admindash" : "/");

    } catch (error) {
      console.error(error);
      toast.error("Google login error");
    } finally {
      setLoading(false); // 🔥 loader guaranteed off
    }
  };

  if (loading) return <Loader />;

  return (
    <Theme appearance="dark" accentColor="sky">
      <div className="login-bg">
        <Card size="4" className="login-card">
          <form onSubmit={handleLogin}>
            <Flex direction="column" gap="4">
              <Text size="6" weight="bold" align="center">
                Sign in
              </Text>

              <TextField.Root
                placeholder="Username"
                name="name"
                value={formdata.name}
                onChange={handleChange}
                required
              />

              <TextField.Root
                type="password"
                placeholder="Password"
                name="password"
                value={formdata.password}
                onChange={handleChange}
                required
              />

              <Link size="2" href="/forget">
                Forgot password?
              </Link>

              <Button size="3" type="submit">
                Sign In
              </Button>

              <Text size="2" align="center" color="gray">
                Don’t have an account? <Link href="/Reg">Create one</Link>
              </Text>

              {/* 🔥 IMPORTANT FIX */}
              <Button
                type="button"
                size="3"
                variant="outline"
                onClick={handleGoogleLogin}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "center"
                }}
              >
                <FcGoogle size={22} />
                Continue with Google
              </Button>
            </Flex>
          </form>
        </Card>
      </div>
    </Theme>
  );
};

export default Login;
