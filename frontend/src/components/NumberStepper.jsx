import { Minus, Plus } from 'lucide-react';
import IconButton from './IconButton';

// example: <NumberStepper value={2} onClick={setValue} className="optional extra styling" />
export default function NumberStepper({ value = 0, min = 0, onClick, className = '' }) {

  // checks minimum then lowers the value by 1
  function minus() {
    if (value > min) {
      onClick(value - 1);
    }
  }
  // incrases the value by 1
  function plus() {
    onClick(value + 1);
  }

  return (
    <div className={"flex items-center justify-between gap-4 px-2 py-2 rounded-2xl " + className}>
      <IconButton label="Decrease" onClick={minus} className="!bg-[#EAF4E9] cursor-pointer"><Minus className="w-5 h-5 text-[var(--color-forest)]" /></IconButton>
      <span className="text-lg font-bold text-[var(--color-charcoal)]">{value}</span>
      <IconButton label="Increase" onClick={plus} className="!bg-[#EAF4E9] cursor-pointer"><Plus className="w-5 h-5 text-[var(--color-forest)]" /></IconButton>
    </div>
  );
}