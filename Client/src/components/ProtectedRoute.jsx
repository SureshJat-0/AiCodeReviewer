import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/authContext";

export default function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) {
    toast.error("Login to access protected pages.", { id: "auth-toast" });
    return <Navigate to="/login" replace />;
  } else {
    return children;
  }
}
