import { useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "./auth";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function getUser() {
      const res = await axios.get(`/api/auth/me`, { withCredentials: true });
      if (!res.data) {
        console.log("Failed to login");
        return;
      }
      setUser(res.data.user);
      navigate("/");
    }
    getUser();
  }, []);

  return <div>Loading...</div>;
}
