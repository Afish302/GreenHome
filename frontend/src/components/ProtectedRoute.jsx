import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './lib/useAuth';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Supabase is still reading the saved session: wait, don't redirect yet
  if (loading) {
    return <p className="p-4 text-sm text-gray-500">Checking login…</p>;
  }

  // Not logged in: go to /login and remember where they wanted to go
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Logged in: show the page inside this route
  return <Outlet />;
}