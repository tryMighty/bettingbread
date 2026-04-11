import { useAuth } from '../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import Preloader from './Preloader';

/**
 * ProtectedRoute component for guarding immersive dashboard pages.
 * Handles loading states and redirects unauthenticated users to home.
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Preloader message="Authenticating Link" subtext="Verifying Neural Signature" />;
  }

  if (!user) {
    // Redirect to home if not logged in
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (adminOnly && !user.isAdmin) {
    // Redirect to dashboard if not an admin
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
