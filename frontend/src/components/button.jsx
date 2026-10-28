import { Link } from 'react-router-dom';

// give it a page address to navigate, or an action to run when clicked.
// navigation example: <Button to="/login">Sign In</Button>
// action example: <Button onClick={handleCLick}>Text</Button>
export default function Button({ to, onClick, type = 'button', children }) {
  const style = "w-full sm:w-auto px-8 py-4 bg-[var(--color-forest)] hover:bg-[var(--color-forest-dark)] text-white text-center font-bold text-base rounded-2xl shadow-md transition-all active:scale-[0.98]";

  // nav button, used when a page address is given.
  if (to) {
    return <Link to={to} onClick={onClick} className={style}>{children}</Link>;
  }
  // action button, used when no page address is given.
  return <button type={type} onClick={onClick} className={style}>{children}</button>;
}