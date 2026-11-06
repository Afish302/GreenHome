import { Link } from 'react-router-dom';

// give it an icon, plus a page address to navigate or an action to run when clicked.
// navigation example: <IconButton navigate="/" className="added styling"><ArrowLeft /></IconButton>
// action example: <IconButton onClick={handleClick} className="added styling"><X /></IconButton>
export default function IconButton({ navigate, onClick, children, className = '' }) {

  const style = "w-10 h-10 flex items-center justify-center rounded-full text-[var(--color-charcoal)] transition-all cursor-pointer " + className;

  // nav icon button, used when a page address is given.
  if (navigate) {
    return <Link to={navigate} onClick={onClick} className={style}>{children}</Link>;
  }
  // action icon button, used when no page address is given.
  return <button type="button" onClick={onClick} className={style}>{children}</button>;
}