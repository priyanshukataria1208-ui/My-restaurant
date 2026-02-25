import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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

const Register = () => {
  const navigate = useNavigate();

  const [formdata, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      setFormData((p) => ({ ...p, phone: value.replace(/\D/g, "") }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/v1/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed");
        return;
      }

      toast.success("Registration Successful 🎉");
      navigate("/Login");
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <Theme
      appearance="dark"
      accentColor="sky"
      grayColor="sand"
      radius="large"
      panelBackground="translucent"
    >
      <div className="login-bg">
        <Card size="4" className="login-card">
          <form onSubmit={handleRegister}>
            <Flex direction="column" gap="4">
              <Text size="6" weight="bold" align="center">
                Create Account
              </Text>

              <TextField.Root
                placeholder="Username"
                name="name"
                value={formdata.name}
                onChange={handleChange}
                required
              />

              <TextField.Root
                placeholder="Email"
                type="email"
                name="email"
                value={formdata.email}
                onChange={handleChange}
                required
              />

              <TextField.Root
                placeholder="Password"
                type="password"
                name="password"
                value={formdata.password}
                onChange={handleChange}
                required
              />

              <TextField.Root
                placeholder="Phone Number"
                name="phone"
                value={formdata.phone}
                onChange={handleChange}
                required
              />

              <Button size="3" type="submit">
                Sign Up
              </Button>

              <Text size="2" align="center" color="gray">
                Already have an account? <Link href="/login">Login</Link>
              </Text>
            </Flex>
          </form>
        </Card>
      </div>
    </Theme>
  );
};

export default Register;
