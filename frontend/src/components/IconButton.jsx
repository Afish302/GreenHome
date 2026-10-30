import { Link } from 'react-router-dom';

// give it an icon and a label, plus a page address to navigate or an action to run when clicked.
// navigation example: <IconButton label="Back" navigate="/"><ArrowLeft /></IconButton>
// action example: <IconButton label="Close" onClick={handleClick}><X /></IconButton>
export default function IconButton({ label = 'TEXT HERE!', navigate, onClick, children }) {

  const style = "w-10 h-10 flex items-center justify-center rounded-full text-[var(--color-charcoal)] hover:bg-slate-100 transition-all active:scale-[0.95]";

  // nav icon button, used when a page address is given.
  if (navigate) {
    return <Link to={navigate} onClick={onClick} aria-label={label} className={style}>{children}</Link>;
  }
  // action icon button, used when no page address is given.
  return <button type="button" onClick={onClick} aria-label={label} className={style}>{children}</button>;
}