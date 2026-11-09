import { useEffect, useState } from 'react';
import { X, Zap, Recycle, Bus, Droplet, Sprout } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { IMPACT_LABEL } from '../lib/impactUnits';

// Category metadata matching the 4-in-a-row compact design
const categories = [
  { id: 'Energy', label: 'Energy', icon: Zap },
  { id: 'Waste', label: 'Waste', icon: Recycle },
  { id: 'Transport', label: 'Transport', icon: Bus },
  { id: 'Water', label: 'Water', icon: Droplet },
];

// Activity options come from the activity_presets table. The numbers shown here are only a
// preview: the database calculates the real points (log_activity), so they can't be faked.
// onSave({ title, quantity }) must return { error } (null on success).
export default function LogActivityModal({ isOpen, onClose, onSave }) {
  const [presets, setPresets] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Waste');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [quantity, setQuantity] = useState('1.5');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    supabase.from('activity_presets').select('*').order('title').then(({ data, error }) => {
      if (error) setLoadError('Could not load activities. Please try again.');
      else setPresets(data);
    });
  }, [isOpen]);

  if (!isOpen) return null;

  const currentOptions = presets.filter((p) => p.category === selectedCategory.toLowerCase());
  const activePreset = currentOptions.find((p) => p.title === selectedActivity) || currentOptions[0];

  // Same formulas as log_activity, for the preview only
  const qtyNum = parseFloat(quantity);
  const validQty = activePreset && qtyNum > 0 && qtyNum <= activePreset.max_quantity;
  const calculatedImpact = activePreset && validQty ? (qtyNum * activePreset.impact_per_unit).toFixed(1) : '0.0';
  const calculatedPts = activePreset && validQty ? Math.round(qtyNum * activePreset.pts_per_unit) : 0;

  // Switching category selects that category's first activity
  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setSelectedActivity('');
  };

  const handleSave = async () => {
    if (!validQty || saving) return;
    setSaving(true);
    setSaveError('');
    let error;
    try {
      ({ error } = await onSave({ title: activePreset.title, quantity: qtyNum }));
    } catch (err) {
      error = err; // never leave the button stuck on "Saving…"
    }
    setSaving(false);
    if (error) {
      console.error('Log activity failed:', error);
      setSaveError(error.message || 'Could not save. Please try again.');
    } else onClose();
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
              value={activePreset?.title || ''}
              onChange={(e) => setSelectedActivity(e.target.value)}
              disabled={!presets.length}
              className="w-full px-4 py-3 bg-gray-50/70 border border-gray-100 rounded-2xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 appearance-none cursor-pointer"
            >
              {!presets.length && <option>{loadError || 'Loading…'}</option>}
              {currentOptions.map((opt) => (
                <option key={opt.title} value={opt.title}>
                  {opt.title}
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
              min="0"
              max={activePreset?.max_quantity}
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full text-base font-bold text-gray-900 bg-transparent focus:outline-none"
              placeholder="0.0"
            />
            <span className="text-xs font-semibold text-gray-400">{activePreset?.unit}</span>
          </div>
          {activePreset && !validQty && (
            <p className="text-xs text-red-600">
              Enter an amount above 0 and up to {activePreset.max_quantity} {activePreset.unit}.
            </p>
          )}
        </div>

        {/* 4. Estimated Savings Summary Box */}
        <div className="bg-[#EAF4E9] p-3.5 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-[#1E6B35]">
            <Sprout className="w-5 h-5" />
            <span className="text-xs font-bold">
              Estimated savings: {calculatedImpact} {IMPACT_LABEL[activePreset?.impact_unit] ?? activePreset?.impact_unit}
            </span>
          </div>
          <span className="text-xs font-extrabold text-[#1E6B35] bg-white/80 px-2.5 py-1 rounded-full">
            +{calculatedPts} pts
          </span>
        </div>

        {saveError && <p className="text-xs text-red-600 text-center">{saveError}</p>}

        {/* 5. CTA Button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={!validQty || saving}
          className="w-full py-3.5 bg-[#1E6B35] hover:bg-emerald-900 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-sm rounded-full shadow-md transition-all active:scale-[0.99] cursor-pointer"
        >
          {saving ? 'Saving…' : 'Save Activity'}
        </button>
      </div>
    </div>
  );
}
