import { CircleCheck } from 'lucide-react';

// example: <OptionCard icon={<Icon />} label="Label" selected={true} onClick={handleClick} className="optional extra styling" />
export default function OptionCard({ icon, label = 'TEXT HERE!', selected = false, onClick, className = '' }) {

  // unselected style
  let style = "w-full flex items-center gap-3 px-4 py-4 rounded-2xl border text-left text-sm bg-white border-slate-200 text-[var(--color-charcoal)] font-semibold cursor-pointer";
  let tick = null;

  // selected style
  if (selected) {
    style = "w-full flex items-center gap-3 px-4 py-4 rounded-2xl border text-left text-sm bg-[#EAF4E9] border-[#81C784] text-[var(--color-forest)] font-semibold cursor-pointer";
    tick = <CircleCheck className="w-5 h-5 ml-auto" />;
  }

  return (
    <button type="button" onClick={onClick} className={style + ' ' + className}>
      {icon}
      <span className="mr-auto">{label}</span>
      {tick}
    </button>
  );
}