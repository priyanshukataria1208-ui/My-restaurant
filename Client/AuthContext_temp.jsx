import React, { createContext, useState, useEffect } from "react";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [role, setRole] = useState(null)
  const [userId, setUseId] = useState(null)
  const [name, setName] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const Role = localStorage.getItem("role")
    const UserId = localStorage.getItem("userId")
    const Name = localStorage.getItem("name")
    const RefreshToken = localStorage.getItem("refreshToken")
    if (UserId) setUseId(UserId)
    if (token) setAccessToken(token);
    if (Role) setRole(Role)
    if (Name) setName(Name)
    if (RefreshToken) setRefreshToken(RefreshToken)


  }, []);

  const login = (token, Role, UserId, Name, RefreshToken) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("role", Role)
    localStorage.setItem("userId", UserId)
    localStorage.setItem("name", Name)
    localStorage.setItem("refreshToken", RefreshToken)
    setAccessToken(token);
    setRole(Role)
    setUseId(UserId)
    setName(Name)
    setRefreshToken(RefreshToken)
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role")
    localStorage.removeItem("userId")
    localStorage.removeItem("name")
    localStorage.removeItem("refreshToken")
    setAccessToken(null);
    setRole(null)
    setUseId(null)
    setName(null)
    setRefreshToken(null)
  };

  return (
    <AuthContext.Provider value={{ accessToken, role, userId, name, refreshToken, login, logout, }}>
      {children}
    </AuthContext.Provider>
  );
};
