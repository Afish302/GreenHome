// src/pages/elements/OptionCard.jsx
export default function OptionCard({ icon, title, selected = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-2xl border transition-all duration-150 cursor-pointer flex items-center justify-between ${
        selected
          ? 'bg-mint-light border-[#1E6B35] text-[#1E6B35] font-semibold shadow-sm'
          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon && <span className="text-xl">{icon}</span>}
        <span className="text-sm font-medium">{title}</span>
      </div>

      {/* Checkmark Radio Circle */}
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
          selected ? 'bg-[#1E6B35] border-[#1E6B35] text-white' : 'border-gray-300 bg-white'
        }`}
      >
        {selected && <span className="text-[10px] font-bold">✓</span>}
      </div>
    </div>
  );
}