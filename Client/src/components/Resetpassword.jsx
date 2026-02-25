import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  Theme,
  Card,
  Text,
  TextField,
  Button,
  Flex
} from "@radix-ui/themes";

const Resetpassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      toast.error("Password match nahi ho raha");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Token expired");
        return;
      }

      toast.success("Password reset successful");
      navigate("/login");
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <Theme appearance="dark" accentColor="sky">
      <div className="login-bg">
        <Card size="4" className="login-card">
          <form onSubmit={handleReset}>
            <Flex direction="column" gap="4">
              <Text size="6" weight="bold" align="center">
                Reset Password
              </Text>

              <TextField.Root
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <TextField.Root
                type="password"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />

              <Button size="3" type="submit">
                Reset Password
              </Button>
            </Flex>
          </form>
        </Card>
      </div>
    </Theme>
  );
};

export default Resetpassword;
