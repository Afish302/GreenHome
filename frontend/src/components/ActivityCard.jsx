import { Recycle, Bus, Zap, Droplet, Pencil } from 'lucide-react';

export default function ActivityCard({ title, category, points, impactText, onEdit }) {
  const getCategoryIcon = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'waste':
        return <Recycle className="w-5 h-5 text-[#2E7D32]" />;
      case 'transport':
        return <Bus className="w-5 h-5 text-[#2E7D32]" />;
      case 'energy':
        return <Zap className="w-5 h-5 text-[#2E7D32]" />;
      case 'water':
        return <Droplet className="w-5 h-5 text-[#2E7D32]" />;
      default:
        return <Recycle className="w-5 h-5 text-[#2E7D32]" />;
    }
  };

  return (
    <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-between gap-3 transition-all hover:border-gray-200">
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Category Circle Icon */}
        <div className="w-11 h-11 rounded-full bg-[#8BC34A]/25 flex items-center justify-center shrink-0">
          {getCategoryIcon(category)}
        </div>

        {/* Text Details */}
        <div className="space-y-1 min-w-0">
          <h4 className="text-[15px] font-bold text-gray-900 leading-tight truncate">
            {title}
          </h4>

          <div className="flex items-center gap-2 pt-0.5">
            {/* Green Points Pill */}
            <span className="px-2.5 py-0.5 bg-[#EAF4E9] text-[#1E6B35] text-xs font-bold rounded-full inline-block">
              +{points} pts
            </span>
            {/* Impact Details */}
            <span className="text-xs font-medium text-gray-500 truncate">
              {impactText}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Action Button */}
      <button
        type="button"
        onClick={onEdit}
        className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors shrink-0 cursor-pointer"
        aria-label="Edit activity"
      >
        <Pencil className="w-4 h-4 stroke-[1.75]" />
      </button>
    </div>
  );
}