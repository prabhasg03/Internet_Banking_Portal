import { createContext, useState } from "react";
import api from "../api/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Initialize user from localStorage if available
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const roles = localStorage.getItem("roles");
    if (token && username && roles) {
      return { token, username, roles: JSON.parse(roles) };
    }
    return null;
  });

  async function login(username, password) {
    try {
      // Send username/password as plain JSON
      const res = await api.post("/api/auth/login", { username, password });

      // Store token and roles properly
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("roles", JSON.stringify(res.data.roles));

      // Update context state
      setUser({
        token: res.data.token,
        username: res.data.username,
        roles: res.data.roles,
      });

      return res.data;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error; // let caller handle errors if needed
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("roles");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}