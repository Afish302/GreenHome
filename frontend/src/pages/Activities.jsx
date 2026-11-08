import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Search } from 'lucide-react';

// Components & Elements
import ActivityCard from '../components/ActivityCard';
import LogActivityModal from '../elements/LogActivityModal';

export default function Activities() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['All', 'Energy', 'Waste', 'Transport', 'Water'];

  // Static mock dataset matching Figma design entries
  const [activities] = useState([
    {
      id: 1,
      title: 'Composted Kitchen Waste',
      category: 'Waste',
      points: 15,
      impactText: 'saved 3 kg CO₂',
      time: 'Today, 10:15 AM',
      group: 'Today',
    },
    {
      id: 2,
      title: 'Used Public Transit',
      category: 'Transport',
      points: 20,
      impactText: 'saved 4.2 kg CO₂',
      time: 'Today, 8:30 AM',
      group: 'Today',
    },
    {
      id: 3,
      title: 'Reduced Energy Use',
      category: 'Energy',
      points: 10,
      impactText: 'saved 2.5 kWh',
      time: 'Yesterday, 7:00 PM',
      group: 'Yesterday',
    },
    {
      id: 4,
      title: 'Collected Rainwater',
      category: 'Water',
      points: 10,
      impactText: 'saved 20 L water',
      time: 'Yesterday, 9:45 AM',
      group: 'Yesterday',
    },
  ]);

  // Client-side filtering logic for Search and Category Pills
  const filteredActivities = activities.filter((act) => {
    const matchesCategory =
      selectedCategory === 'All' || act.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.impactText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const todayList = filteredActivities.filter((a) => a.group === 'Today');
  const yesterdayList = filteredActivities.filter((a) => a.group === 'Yesterday');

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          type="button"
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-800 transition-colors cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Activities
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Small steps. A greener tomorrow.
          </p>
        </div>
      </div>

      {/* 2. Log New Activity CTA Button */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="w-full py-3.5 bg-[var(--color-forest,#1E6B35)] hover:bg-emerald-900 text-white font-bold text-sm rounded-full flex items-center justify-center gap-2 shadow-md shadow-emerald-900/10 transition-all active:scale-[0.99] cursor-pointer"
      >
        <Plus className="w-4 h-4 stroke-[3]" />
        <span>Log New Activity</span>
      </button>

      {/* 3. Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search your activities"
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm placeholder:text-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 shadow-2xs transition-all"
        />
      </div>

      {/* 4. Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[var(--color-forest,#1E6B35)] text-white shadow-xs'
                : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 5. Activity History List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Activity History</h2>
          <span className="text-xs font-bold text-emerald-700">
            +55 pts this week
          </span>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-3xl border border-gray-100 space-y-1">
            <p className="text-sm font-bold text-gray-700">No activities found</p>
            <p className="text-xs text-gray-400">Try adjusting your category filter or search term.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Today Group */}
            {todayList.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-gray-400 font-semibold px-1">
                  <span>Today</span>
                  <span>October 7</span>
                </div>
                {todayList.map((act) => (
                  <ActivityCard
                    key={act.id}
                    title={act.title}
                    category={act.category}
                    points={act.points}
                    impactText={act.impactText}
                    time={act.time}
                  />
                ))}
              </div>
            )}

            {/* Yesterday Group */}
            {yesterdayList.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-gray-400 font-semibold px-1">
                  <span>Yesterday</span>
                  <span>October 6</span>
                </div>
                {yesterdayList.map((act) => (
                  <ActivityCard
                    key={act.id}
                    title={act.title}
                    category={act.category}
                    points={act.points}
                    impactText={act.impactText}
                    time={act.time}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 6. Modal Trigger Placeholder */}
      {isModalOpen && LogActivityModal && (
        <LogActivityModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}