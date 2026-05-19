import axios from "axios";
import { useState } from "react";
import { useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const navigate = useNavigate();

  const signup = async (userInfo) => {
    try {
      if (!userInfo.email || !userInfo.password || !userInfo.fullName) {
        toast.error("All fields are required");
        return console.log("All fields are required");
      }
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`,
        userInfo,
        { withCredentials: true },
      );
      toast.success("User registered");
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
      setUser(response.data.user);
      toast.success("Login Success");
      navigate("/");
    } catch (err) {
      setUser(null);
      toast.error(
        err?.response?.data?.error?.message || "Something went wrong",
      );
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        },
      );
      setUser(null);
      toast.success("User signed out");
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.error?.message || "Something went wrong",
      );
    }
  };

  const checkAuth = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
        { withCredentials: true },
      );
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, userLoading, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
