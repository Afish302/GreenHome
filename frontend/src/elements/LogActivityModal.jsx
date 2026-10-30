import { useState } from 'react';
import PrimaryButton from './PrimaryButton';
import OptionCard from './OptionCard';

export default function LogActivityModal({ isOpen, onClose, onSaveActivity }) {
  const [selectedCategory, setSelectedCategory] = useState('waste');
  const [activityName, setActivityName] = useState('');

  if (!isOpen) return null;

  const categories = [
    { id: 'energy', title: 'Energy', icon: '⚡' },
    { id: 'waste', title: 'Waste', icon: '🌱' },
    { id: 'transport', title: 'Transport', icon: '🚌' },
    { id: 'water', title: 'Water', icon: '💧' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSaveActivity) {
      onSaveActivity({ category: selectedCategory, name: activityName });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4 transition-opacity">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-xl space-y-5 animate-in slide-in-from-bottom duration-200">
        {/* Modal Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Log Activity</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Every little action makes a difference.
            </p>
          </div>
          {/* Top-right X Close IconButton */}
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold hover:bg-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Selector Grid */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <OptionCard
                  key={cat.id}
                  icon={cat.icon}
                  title={cat.title}
                  selected={selectedCategory === cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                />
              ))}
            </div>
          </div>

          {/* Activity Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Activity Details
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Composted Kitchen Waste"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#1E6B35] focus:ring-1 focus:ring-[#1E6B35] bg-gray-50/50"
            />
          </div>

          {/* Save Action Button */}
          <div className="pt-2">
            <PrimaryButton type="submit">Save Activity</PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}