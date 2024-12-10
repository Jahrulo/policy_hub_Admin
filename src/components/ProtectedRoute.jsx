import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loading from "./Loader";
import { supabase } from "../services/supabase";

const ProtectedRoute = () => {
  const [isLoading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const getUserSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error || !data?.session) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
          setUserRole(data.session.user.user_metadata.role);
        }
      } catch (err) {
        console.error("Error fetching session:", err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    getUserSession();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 w-screen h-screen flex justify-center items-center">
        <Loading size={48} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check if the current path is an admin-only path
  const isAdminPath = location.pathname.startsWith("/dashboard");
  const isStaffsPage = location.pathname === "/dashboard/staffs";
  const isCorrespondencesPage =
    location.pathname === "/dashboard/correspondences";
  const isDetailsPage = location.pathname.startsWith(
    "/dashboard/correspondences/details"
  );

  // If user is not admin and tries to access admin-only pages (excluding settings)
  if (userRole !== "admin" && isStaffsPage) {
    return <Navigate to="/dashboard/correspondences" />;
  }

  // Allow access to settings, correspondences, and details pages for all authenticated users
  if (
    location.pathname === "/dashboard/settings" ||
    isCorrespondencesPage ||
    isDetailsPage ||
    (userRole === "admin" && isAdminPath)
  ) {
    return <Outlet />;
  }

  // Default redirect to correspondences page
  return <Navigate to="/dashboard/correspondences" />;
};

export default ProtectedRoute;
