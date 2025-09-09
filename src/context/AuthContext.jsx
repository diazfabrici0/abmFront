import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [auth_token, setAuthToken] = useState(
    localStorage.getItem("auth_token") || null
  );

  const login = (userData, token) => {
    setUser(userData);
    setAuthToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("auth_token", token);
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("auth_token");
  };

  // Refresh token
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!auth_token) return;
      try {
        const res = await api.post(
          "/refresh",
          {},
          { headers: { Authorization: `Bearer ${auth_token}` } }
        );
        setAuthToken(res.data.auth_token);
        localStorage.setItem("auth_token", res.data.auth_token);
      } catch (err) {
        console.error("Error refrescando token:", err);
        logout();
      }
    }, 15 * 60 * 1000); // Cada 15 minutos

    return () => clearInterval(interval);
  }, [auth_token]);

  return (
    <AuthContext.Provider value={{ user, auth_token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
