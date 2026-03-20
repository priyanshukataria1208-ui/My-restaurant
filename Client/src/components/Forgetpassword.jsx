import React, { useState } from "react";
import toast from "react-hot-toast";

import {
  Theme,
  Card,
  Text,
  TextField,
  Button,
  Flex
} from "@radix-ui/themes";

import Loader from "./Loading";
import { API_V1_URL } from "../lib/config";

const Forgetpassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ loader ON

    try {
      const res = await fetch(
        `${API_V1_URL}/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "User not found");
        setLoading(false); // ✅ loader OFF
        return;
      }

      toast.success("Reset link sent to your email 📩");
      setEmail("");
      setLoading(false); // ✅ loader OFF

    } catch (err) {
      toast.error("Server error");
      setLoading(false); // ✅ loader OFF
    }
  };

  // ✅ Loader with food logo
  if (loading) return <Loader />;

  return (
    <Theme appearance="dark" accentColor="sky">
      <div className="login-bg">
        <Card size="4" className="login-card">
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="4">
              <Text size="6" weight="bold" align="center">
                Forgot Password
              </Text>

              <TextField.Root
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button size="3" type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </Flex>
          </form>
        </Card>
      </div>
    </Theme>
  );
};

export default Forgetpassword;
