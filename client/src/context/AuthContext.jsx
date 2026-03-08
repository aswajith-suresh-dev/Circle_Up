import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (userData, token) => {
    localStorage.setItem("token", token);

    try {
      const res = await api.get("/auth/profile");
      const fullUser = res.data.user;

      localStorage.setItem("user", JSON.stringify(fullUser));
      setUser(fullUser);

    } catch (err) {
      console.error(err);
      setUser(userData);
    }
  };

  const updateUser = (newUser) => {
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

 useEffect(() => {
  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const res = await api.get("/auth/profile");
      setUser(res.data.user);

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  loadProfile();
}, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);