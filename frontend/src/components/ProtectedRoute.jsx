import { Navigate } from "react-router-dom";

/*
Used for protecting routing and general security.

inputs: 
children - the children components to be rendered
*/
export default function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user");
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
