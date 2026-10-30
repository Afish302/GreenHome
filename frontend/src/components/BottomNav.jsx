import { NavLink } from 'react-router-dom';
import { Home, Users, ListChecks, Settings } from 'lucide-react';

export default function BottomNav() {

  const tabStyle = "group flex flex-col items-center gap-1";
  const iconStyle = "px-5 py-1.5 rounded-full text-[var(--color-charcoal-muted)] group-aria-[current=page]:bg-[#EAF4E9] group-aria-[current=page]:text-[var(--color-forest)]";
  const textStyle = "text-sm text-[var(--color-charcoal-muted)] group-aria-[current=page]:font-bold group-aria-[current=page]:text-[var(--color-forest)]";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around py-3">

      {/* home */}
      <NavLink to="/" end className={tabStyle}>
        <div className={iconStyle}><Home className="w-6 h-6" /></div>
        <span className={textStyle}>Home</span>
      </NavLink>
      {/* community */}
      <NavLink to="/community" className={tabStyle}>
        <div className={iconStyle}><Users className="w-6 h-6" /></div>
        <span className={textStyle}>Community</span>
      </NavLink>
      {/* activities */}
      <NavLink to="/activities" className={tabStyle}>
        <div className={iconStyle}><ListChecks className="w-6 h-6" /></div>
        <span className={textStyle}>Activities</span>
      </NavLink>
      {/* settings */}
      <NavLink to="/settings" className={tabStyle}>
        <div className={iconStyle}><Settings className="w-6 h-6" /></div>
        <span className={textStyle}>Settings</span>
      </NavLink>
    </nav>
  );
}