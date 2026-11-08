import { useState } from 'react';
import { X, Zap, Recycle, Bus, Droplet, Sprout } from 'lucide-react';

export default function LogActivityModal({ isOpen, onClose, onSave }) {
  const [selectedCategory, setSelectedCategory] = useState('Waste');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [quantity, setQuantity] = useState('1.5');
  const [unit, setUnit] = useState('kg');

  if (!isOpen) return null;

  // Category metadata matching the 4-in-a-row compact design
  const categories = [
    { id: 'Energy', label: 'Energy', icon: Zap },
    { id: 'Waste', label: 'Waste', icon: Recycle },
    { id: 'Transport', label: 'Transport', icon: Bus },
    { id: 'Water', label: 'Water', icon: Droplet },
  ];

  // Dynamic activity options per category
  const activityPresets = {
    Waste: [
      { label: 'Composted Kitchen Waste', defaultUnit: 'kg', impactPerUnit: 2, ptsPerUnit: 10 },
      { label: 'Recycled Plastic & Paper', defaultUnit: 'kg', impactPerUnit: 1.5, ptsPerUnit: 8 },
      { label: 'Avoided Single-Use Plastic', defaultUnit: 'items', impactPerUnit: 0.5, ptsPerUnit: 5 },
    ],
    Energy: [
      { label: 'Reduced Energy Use', defaultUnit: 'kWh', impactPerUnit: 2.5, ptsPerUnit: 10 },
      { label: 'Switched to LED Bulbs', defaultUnit: 'bulbs', impactPerUnit: 1.2, ptsPerUnit: 5 },
      { label: 'Air-Dried Laundry', defaultUnit: 'loads', impactPerUnit: 1.8, ptsPerUnit: 7 },
    ],
    Transport: [
      { label: 'Used Public Transit', defaultUnit: 'km', impactPerUnit: 0.3, ptsPerUnit: 2 },
      { label: 'Biked / Walked Trip', defaultUnit: 'km', impactPerUnit: 0.5, ptsPerUnit: 4 },
      { label: 'Carpooled to Work', defaultUnit: 'trips', impactPerUnit: 2.0, ptsPerUnit: 10 },
    ],
    Water: [
      { label: 'Collected Rainwater', defaultUnit: 'L', impactPerUnit: 1, ptsPerUnit: 1 },
      { label: 'Shortened Shower Time', defaultUnit: 'mins', impactPerUnit: 5, ptsPerUnit: 2 },
      { label: 'Fixed Water Leak', defaultUnit: 'fixes', impactPerUnit: 15, ptsPerUnit: 15 },
    ],
  };

  // Handle switching category: auto-select the first activity of that category
  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    const firstOption = activityPresets[catId][0];
    setSelectedActivity(firstOption.label);
    setUnit(firstOption.defaultUnit);
  };

  const currentOptions = activityPresets[selectedCategory] || [];
  const activePreset = currentOptions.find((a) => a.label === selectedActivity) || currentOptions[0];

  // Calculate dynamic savings & points
  const qtyNum = parseFloat(quantity) || 0;
  const calculatedImpact = (qtyNum * (activePreset?.impactPerUnit || 1)).toFixed(1);
  const calculatedPts = Math.round(qtyNum * (activePreset?.ptsPerUnit || 5));

  const handleSave = () => {
    if (onSave) {
      onSave({
        category: selectedCategory,
        title: selectedActivity || currentOptions[0]?.label,
        quantity: qtyNum,
        unit,
        impactText: `saved ${calculatedImpact} ${selectedCategory === 'Waste' ? 'kg CO₂' : selectedCategory === 'Energy' ? 'kWh' : selectedCategory === 'Water' ? 'L water' : 'kg CO₂'}`,
        points: calculatedPts,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Top Handle / Header */}
        <div className="space-y-3">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto sm:hidden" />
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Log Activity</h3>
              <p className="text-xs text-gray-400 font-medium">Every little action makes a difference.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 1. Category 4-in-a-row Compact Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700">Category</label>
          <div className="grid grid-cols-4 gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#1E6B35] bg-[#EAF4E9] text-[#1E6B35] ring-1 ring-[#1E6B35]'
                      : 'border-gray-100 bg-gray-50/60 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1 stroke-[2]" />
                  <span className="text-xs font-semibold leading-none">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Dynamic Activity Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700">Activity</label>
          <div className="relative">
            <select
              value={selectedActivity || currentOptions[0]?.label}
              onChange={(e) => {
                setSelectedActivity(e.target.value);
                const preset = currentOptions.find((opt) => opt.label === e.target.value);
                if (preset) setUnit(preset.defaultUnit);
              }}
              className="w-full px-4 py-3 bg-gray-50/70 border border-gray-100 rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 appearance-none cursor-pointer"
            >
              {currentOptions.map((opt) => (
                <option key={opt.label} value={opt.label}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
              ▼
            </div>
          </div>
        </div>

        {/* 3. Quantity Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700">Quantity</label>
          <div className="flex items-center gap-2 bg-gray-50/70 border border-gray-100 rounded-2xl px-4 py-2">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full text-base font-bold text-gray-900 bg-transparent focus:outline-none"
              placeholder="0.0"
            />
            <span className="text-xs font-semibold text-gray-400 capitalize">{unit}</span>
          </div>
        </div>

        {/* 4. Estimated Savings Summary Box */}
        <div className="bg-[#EAF4E9] p-3.5 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-[#1E6B35]">
            <Sprout className="w-5 h-5" />
            <span className="text-xs font-bold">
              Estimated savings: {calculatedImpact} {selectedCategory === 'Water' ? 'L water' : selectedCategory === 'Energy' ? 'kWh' : 'kg CO₂'}
            </span>
          </div>
          <span className="text-xs font-extrabold text-[#1E6B35] bg-white/80 px-2.5 py-1 rounded-full">
            +{calculatedPts} pts
          </span>
        </div>

        {/* 5. CTA Button */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full py-3.5 bg-[#1E6B35] hover:bg-emerald-900 text-white font-bold text-sm rounded-full shadow-md transition-all active:scale-[0.99] cursor-pointer"
        >
          Save Activity
        </button>
      </div>
    </div>
  );
}