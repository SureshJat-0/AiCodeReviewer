import axios from "axios";
import { useState } from "react";
import { useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("token")));
  const navigate = useNavigate();

  const signup = async (userInfo) => {
    try {
      if (!userInfo.email || !userInfo.password || !userInfo.fullName) {
        toast.error("All fields are required");
        return console.log("All fields are required");
      }
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`,
        userInfo,
        { withCredentials: true },
      );
      toast.success("User registerd");
      await login({ email: userInfo.email, password: userInfo.password });
    } catch (err) {
      toast.error(
        err?.response?.data?.error?.message || "Something went wrong",
      );
    }
  };

  const login = async (userInfo) => {
    try {
      if (!userInfo.email || !userInfo.password) {
        toast.error("All fields are required");
      }
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        userInfo,
        { withCredentials: true },
      );
      const { token, user } = response.data;
      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("user", JSON.stringify(user));
      setToken(token);
      setUser(user);
      toast.success("Login Success");
      navigate("/");
    } catch (err) {
      toast.error(
        err?.response?.data?.error?.message || "Something went wrong",
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    toast.success("User signed out");
  };

  return (
    <AuthContext.Provider value={{ user, token, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
