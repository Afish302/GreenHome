import { Link } from 'react-router-dom';

// give it a page address to navigate, or an action to run when clicked.
// navigation example: <Button navigate="/login">Sign In</Button>
// action example: <Button onClick={handleClick}>Text</Button>
// variant example: <Button variant="outline">Text</Button>
export default function Button({ navigate, onClick, type = 'button', variant = 'primary', children }) {

  // shared style
  const preset = "w-full sm:w-auto px-8 py-4 text-center font-bold text-base rounded-2xl shadow-md transition-all active:scale-[0.98]";

  // the variants
  const variants = {
    primary: "bg-[var(--color-forest)] hover:bg-[var(--color-forest-dark)] text-white",
    secondary: "bg-[#EAF4E9] hover:brightness-95 text-[var(--color-forest)]",
    outline: "bg-transparent border border-slate-200 hover:bg-slate-50 text-[var(--color-charcoal)]",
    red: "bg-transparent border border-red-200 hover:bg-red-50 text-red-600",
    text: "bg-transparent text-[var(--color-forest)] hover:underline !w-auto !px-0 !py-0 !shadow-none",
  };

  const style = preset + ' ' + variants[variant];

  // nav button, used when a page address is given.
  if (navigate) {
    return <Link to={navigate} onClick={onClick} className={style}>{children}</Link>;
  }
  // action button, used when no page address is given.
  return <button type={type} onClick={onClick} className={style}>{children}</button>;
}