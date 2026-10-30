import { Minus, Plus } from 'lucide-react';
import IconButton from './IconButton';

// example: <NumberStepper value={2} onClick={setValue} />
export default function NumberStepper({ value = 0, min = 0, onClick }) {

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
    <div className="flex items-center justify-between px-2 py-2 rounded-2xl border border-slate-200 bg-white">
      <IconButton label="Decrease" onClick={minus}><Minus className="w-5 h-5" /></IconButton>
      <span className="text-lg font-bold text-[var(--color-charcoal)]">{value}</span>
      <IconButton label="Increase" onClick={plus}><Plus className="w-5 h-5" /></IconButton>
    </div>
  );
}