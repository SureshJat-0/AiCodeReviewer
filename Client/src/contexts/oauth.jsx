import { useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "./auth";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  useEffect(() => {
    async function getUser() {
      try {
        await axios.post(
          `/api/oauth/exchange`,
          { token },
          { withCredentials: true },
        );
        const res = await axios.get(`/api/auth/me`, { withCredentials: true });
        if (!res.data) {
          console.log("Failed to login");
          return;
        }
        setUser(res.data.user);
        window.history.replaceState({}, "", "/auth/oauth/success");
      } catch (err) {
        console.log(err);
      } finally {
        navigate("/");
      }
    }
    getUser();
  }, []);

  return <div>Loading...</div>;
}
