import axios from "axios";
import { useState } from "react";
import { useContext, createContext } from "react";
import toast from "react-hot-toast";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [token, setToken] = useState(localStorage.getItem("token"));

  const signup = async (userInfo) => {
    try {
      if (!userInfo.email || !userInfo.password || !userInfo.fullName) {
        toast.error("All fields are required");
        return console.log("All fields are required");
      }
      const response = await axios.post(
        "http://localhost:3000/api/auth/signup",
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
        "http://localhost:3000/api/auth/login",
        userInfo,
        { withCredentials: true },
      );
      const { token, user } = response.data;
      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("user", JSON.stringify(user));
      setToken(token);
      setUser(user);
      toast.success("Login Success");
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
  };

  return (
    <AuthContext.Provider value={{ user, token, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
