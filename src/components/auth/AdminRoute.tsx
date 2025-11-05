import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

  // This component checks for two things:
  // 1. Is the user logged in? (userInfo exists)
  // 2. Is the user's role 'admin'?
  return userInfo && userInfo.role === 'admin' ? (
    // If both are true, it renders the requested admin page
    <Outlet />
  ) : (
    // Otherwise, it redirects to the login page
    <Navigate to="/login" replace />
  );
};

export default AdminRoute;

