import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/auth";
import toast from "react-hot-toast";

export default function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) {
    toast.error("Login to access protected pages.", { id: "auth-toast" });
    return <Navigate to="/login" replace />;
  } else {
    return children;
  }
}
