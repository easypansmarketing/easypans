import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Check if user information is stored in localStorage
  const userInfo = localStorage.getItem('userInfo');

  // If user is logged in, render the child route (e.g., RecipeDetail)
  // Otherwise, redirect them to the login page
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
