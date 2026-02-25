import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  useEffect(() => {
    setAccessToken(localStorage.getItem("accessToken"));
    setRole(localStorage.getItem("role"));
    setUserId(localStorage.getItem("userId"));
    setName(localStorage.getItem("name"));
    setRefreshToken(localStorage.getItem("refreshToken"));
  }, []);

  const login = (token, role, userId, name, refreshToken) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("role", role);
    localStorage.setItem("userId", userId);
    localStorage.setItem("name", name);
    localStorage.setItem("refreshToken", refreshToken);

    setAccessToken(token);
    setRole(role);
    setUserId(userId);
    setName(name);
    setRefreshToken(refreshToken);
  };

  const logout = () => {
    localStorage.clear();
    setAccessToken(null);
    setRole(null);
    setUserId(null);
    setName(null);
    setRefreshToken(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, role, userId, name, refreshToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
