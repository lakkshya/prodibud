import { Navigate } from "react-router-dom";

// ProtectedRoute component takes children as props (i.e., the component which is wrapped inside it)
const ProtectedRoute = ({ children }) => {
  // Get the JWT token from local storage to check if the user is logged in
  const token = localStorage.getItem("token");

  // If token exists, user is authenticated -> render the protected component
  // If token doesn't exist, redirect the user to the login page
  return token ? children : <Navigate to="/login" replace />;
};

// Export the component so it can be used in your route definitions
export default ProtectedRoute;
