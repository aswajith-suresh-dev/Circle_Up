import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MentorRoute = ({ children }) => {

  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "mentor") {
    return <Navigate to="/home" />;
  }

  return children;
};

export default MentorRoute;