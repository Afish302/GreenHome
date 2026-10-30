import { CircleCheck } from 'lucide-react';

// example: <OptionCard icon={<Icon />} label="Label" selected={true} onClick={handleClick} />
export default function OptionCard({ icon, label = 'TEXT HERE!', selected = false, onClick }) {

  // unselected style
  let style = "w-full flex items-center gap-3 px-4 py-4 rounded-2xl border text-left text-sm bg-white border-slate-200 text-[var(--color-charcoal)]";
  let tick = null;

  // selected style
  if (selected) {
    style = "w-full flex items-center gap-3 px-4 py-4 rounded-2xl border text-left text-sm bg-[#EAF4E9] border-[var(--color-forest)] text-[var(--color-forest)] font-bold";
    tick = <CircleCheck className="w-5 h-5 ml-auto" />;
  }

  return (
    <button type="button" onClick={onClick} className={style}>
      {icon}
      <span className="mr-auto">{label}</span>
      {tick}
    </button>
  );
}