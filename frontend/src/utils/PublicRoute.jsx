import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const token = localStorage.getItem('token'); // Check if the user is authenticated

  // If the user is authenticated, redirect to the dashboard
  if (token) {
    return <Navigate to="/dashboard" />;
  }

  // If not authenticated, render the child routes
  return <Outlet />;
};

export default PublicRoute;