import { Sprout, Bus, Zap, Droplets, Pencil } from 'lucide-react';
import Badge from './badge';

export default function ActivityCard({ title, category, points, impactText, time, onEdit }) {
  // Map categories to Lucide icons
  const getCategoryIcon = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'waste':
        return <Sprout className="w-5 h-5 text-emerald-700" />;
      case 'transport':
        return <Bus className="w-5 h-5 text-emerald-700" />;
      case 'energy':
        return <Zap className="w-5 h-5 text-emerald-700" />;
      case 'water':
        return <Droplets className="w-5 h-5 text-emerald-700" />;
      default:
        return <Sprout className="w-5 h-5 text-emerald-700" />;
    }
  };

  return (
    <div className="bg-white p-4 rounded-3xl border border-gray-100/80 shadow-xs flex items-center justify-between gap-3 hover:border-gray-200 transition-all">
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Icon Circle */}
        <div className="w-12 h-12 rounded-full bg-emerald-100/70 flex items-center justify-center shrink-0">
          {getCategoryIcon(category)}
        </div>

        {/* Text details */}
        <div className="space-y-1 min-w-0">
          <h4 className="text-sm font-bold text-gray-900 leading-tight truncate">
            {title}
          </h4>
          <p className="text-xs text-gray-400 font-medium leading-none">
            {time}
          </p>

          <div className="flex items-center gap-2 pt-0.5">
            <Badge label={`+${points} pts`} />
            <span className="text-xs font-semibold text-emerald-700/90 truncate">
              {impactText}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Action Button */}
      <button
        type="button"
        onClick={onEdit}
        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors shrink-0 cursor-pointer"
        aria-label="Edit activity"
      >
        <Pencil className="w-4 h-4" />
      </button>
    </div>
  );
}