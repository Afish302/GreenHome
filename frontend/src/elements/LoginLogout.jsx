import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

// Shows "Log in | Register" when logged out, and "Log out" when logged in.
// Use it anywhere: <AuthButtons />
export default function AuthButtons({ className = '' }) {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  // Still checking the saved session: show nothing, so the buttons don't flicker
  if (loading) return null;

  async function handleLogout() {
    await signOut();                      // ends the Supabase session
    navigate('/', { replace: true });     // back to the landing page
  }

  const linkStyle =
    'text-sm md:text-base font-semibold text-[var(--color-forest)] hover:underline rounded-md px-3 py-1.5';

  // Logged in
  if (user) {
    return (
      <div className={'flex items-center gap-2 ' + className}>
        <button type="button" onClick={handleLogout} className={linkStyle}>
          Log out
        </button>
      </div>
    );
  }

  // Logged out
  return (
    <div className={'flex items-center gap-1 ' + className}>
      <Link to="/login" className={linkStyle}>Log in</Link>
      <span className="text-gray-300" aria-hidden="true">|</span>
      <Link to="/register" className={linkStyle}>Register</Link>
    </div>
  );
}
