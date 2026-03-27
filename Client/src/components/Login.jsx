import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "./context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";

import {
  Theme,
  Card,
  Text,
  TextField,
  Button,
  Flex,
  Link,
} from "@radix-ui/themes";

import "@radix-ui/themes/styles.css";
import Loader from "./Loading";
import { API_V1_URL } from "../lib/config";

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

  // 🔥 LOGIN FIXED
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      console.log("API:", API_V1_URL);

      const res = await axios.post(
        `${API_V1_URL}/login`,
        formdata
      );


      console.log("LOGIN RESPONSE:", res.data);

      if (!res.data.success) {
        toast.error("Invalid credentials");
        return;
      }

      // ✅ TOKEN SAVE (MAIN FIX)
      localStorage.setItem("accesstoken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // context
      login(
        res.data.accessToken,
        res.data.user.role,
        res.data.user.id,
        res.data.user.name,
        res.data.refreshToken
      );

      toast.success("Login Successful 🚀");

      navigate(res.data.user.role === "admin" ? "/admindash" : "/");
    } catch (err) {
      console.log("LOGIN ERROR:", err);
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 GOOGLE LOGIN FIXED
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const popupResult = await signInWithPopup(auth, googleProvider);
      const idToken = await popupResult.user.getIdToken();

      const res = await axios.post(
        `${API_V1_URL}/google/verify`,
        { credential: idToken }
      );


      if (!res.data.success) {
        throw new Error("Google login failed");
      }

      // ✅ SAME FIX
      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      login(
        res.data.accessToken,
        res.data.user.role,
        res.data.user.id,
        res.data.user.name,
        res.data.refreshToken
      );

      toast.success("Google Login Successful 🚀");

      navigate(res.data.user.role === "admin" ? "/admindash" : "/");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Google login error");
    } finally {
      setLoading(false);
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
                Don't have an account? <Link href="/Reg">Create one</Link>
              </Text>

              <Button
                type="button"
                size="3"
                variant="outline"
                onClick={handleGoogleLogin}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "center",
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
