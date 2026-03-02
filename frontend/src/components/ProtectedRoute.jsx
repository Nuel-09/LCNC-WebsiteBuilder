import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

function ProtectedRoute() {
  const { token } = useAppContext();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
