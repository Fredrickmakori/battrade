import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../services/firebase";

const ProtectedRoute = ({ element, allowedRole }) => {
  return <AuthChecker allowedRole={allowedRole}>{element}</AuthChecker>;
};

const AuthChecker = ({ children, allowedRole }) => {
  const user = auth.currentUser;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return auth.currentUser
    .getIdTokenResult(true)
    .then((idTokenResult) => {
      if (allowedRole === "admin" && !idTokenResult.claims["admin"]) {
        return <Navigate to="/" replace />; // Redirect non-admins
      } else {
        return children; //Render the component
      }
    })
    .catch((error) => {
      console.error("Error checking admin status:", error);
      // Handle the error appropriately (e.g., display an error message to the user)
      return <Navigate to="/error" replace />; //Redirect to an error page
    });
};

export default ProtectedRoute;
