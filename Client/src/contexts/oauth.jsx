import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./authContext";

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
  }, [token, navigate, setUser]);

  return <div>Loading...</div>;
}
