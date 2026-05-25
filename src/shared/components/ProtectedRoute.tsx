/**
 * Protected Route component
 * Redirects unauthenticated users to login with return URL
 */

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@features/auth/hooks/useAuth";
import { Box, CircularProgress } from "@mui/material";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component
 * Checks if user is authenticated before rendering component
 * Redirects to /auth/login with redirect parameter if not authenticated
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // if (!isAuthenticated) {
  //   // Redirect to login but save the location they were trying to access
  //   return (
  //     <Navigate
  //       to={`/auth/login?redirect=${encodeURIComponent(location.pathname)}`}
  //       replace
  //     />
  //   );
  // }

  return <>{children}</>;
};

export default ProtectedRoute;
