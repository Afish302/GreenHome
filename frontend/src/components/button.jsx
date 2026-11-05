import { Link } from 'react-router-dom';

// give it a page address to navigate, or an action to run when clicked.
// navigation example: <Button navigate="/login" className="optional extra styling">Sign In</Button>
// action example: <Button onClick={handleClick} className="optional extra styling">Text</Button>
// variant example: <Button variant="outline" className="optional extra styling">Text</Button>
export default function Button({ navigate, onClick, type = 'button', variant = 'primary', children, className = '' }) {

  // shared style
  const preset = "w-full sm:w-auto px-8 py-4 text-center font-bold text-base rounded-2xl shadow-md transition-all cursor-pointer";

  // the variants
  const variants = {
    primary: "bg-[var(--color-forest)] text-white",
    secondary: "bg-[#EAF4E9] text-[var(--color-forest)]",
    outline: "bg-transparent border border-slate-200 text-[var(--color-charcoal)]",
    red: "bg-transparent border border-red-200 hover:bg-red-50 text-red-600",
    text: "bg-transparent text-[var(--color-forest)] !w-auto !px-0 !py-0 !shadow-none",
  };

  const style = preset + ' ' + variants[variant] + ' ' + className;

  // nav button, used when a page address is given.
  if (navigate) {
    return <Link to={navigate} onClick={onClick} className={style}>{children}</Link>;
  }
  // action button, used when no page address is given.
  return <button type={type} onClick={onClick} className={style}>{children}</button>;
}