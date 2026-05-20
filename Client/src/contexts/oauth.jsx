import { useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./auth";

export default function Google() {
  const { setUser } = useAuth();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const _id = params.get("_id");
    const email = params.get("email");
    const fullName = params.get("fullName");
    if (!_id || !email || !fullName) {
      toast.error("parameters are required");
      window.location.href = "/";
      return;
    }
    setUser({ _id, email, fullName });
    window.history.replaceState({}, "", "/");
    window.location.href = "/";
  }, []);
  return <div>Loading...</div>;
}
