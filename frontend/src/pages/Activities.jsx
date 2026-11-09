import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/useAuth';

// Components & Elements
import ActivityCard from '../components/ActivityCard';
import LogActivityModal from '../elements/LogActivityModal';
import { IMPACT_LABEL } from '../lib/impactUnits';

const DAY = 864e5;

// activities row -> what the card and filters need
function toView(row) {
  const at = new Date(row.created_at);
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    points: row.points,
    impactText: row.impact_value != null ? `saved ${row.impact_value} ${IMPACT_LABEL[row.impact_unit] ?? row.impact_unit}` : '',
    time: at.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    day: at.toDateString(),
    at,
  };
}

// "Today" / "Yesterday" / "Monday", with the date on the right
function dayLabels(day) {
  const d = new Date(day);
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - DAY).toDateString();
  const name = day === today ? 'Today' : day === yesterday ? 'Yesterday' : d.toLocaleDateString([], { weekday: 'long' });
  return [name, d.toLocaleDateString([], { month: 'long', day: 'numeric' })];
}

export default function Activities() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = ['All', 'Energy', 'Waste', 'Transport', 'Water'];

  // The "Read own activities" policy only returns this user's rows, so no user filter is needed.
  // ponytail: loads the whole history; add .limit() / paging if lists get long.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    supabase.from('activities').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) setError('Could not load your activities.');
        else setActivities(data.map(toView));
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [user]);

  // Points are calculated by the database (log_activity), never sent from here.
  const handleSave = async ({ title, quantity }) => {
    const { data, error } = await supabase.rpc('log_activity', { p_title: title, p_quantity: quantity });
    if (error) return { error };
    if (!data?.id) return { error: new Error('Saved, but no activity came back. Reload the page.') };
    setActivities((list) => [toView(data), ...list]);
    return { error: null };
  };

  const handleDelete = async (act) => {
    if (!window.confirm(`Delete "${act.title}"? This removes its ${act.points} pts.`)) return;
    const { error } = await supabase.rpc('delete_activity', { p_id: act.id });
    if (error) return window.alert('Could not delete this activity. Please try again.');
    setActivities((list) => list.filter((a) => a.id !== act.id));
  };

  const weekPts = activities
    .filter((a) => a.at > Date.now() - 7 * DAY)
    .reduce((sum, a) => sum + a.points, 0);

  // Client-side filtering logic for Search and Category Pills
  const filteredActivities = activities.filter((act) => {
    const matchesCategory =
      selectedCategory === 'All' || act.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.impactText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Group by calendar day, newest first (the list is already sorted)
  const groups = [];
  for (const act of filteredActivities) {
    const last = groups[groups.length - 1];
    if (last && last.day === act.day) last.items.push(act);
    else groups.push({ day: act.day, items: [act] });
  }

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
            +{weekPts} pts this week
          </span>
        </div>

        {loading || error ? (
          <p className="text-sm text-center text-gray-500 py-10">{error || 'Loading…'}</p>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-3xl border border-gray-100 space-y-1">
            {activities.length === 0 ? (
              <>
                <p className="text-sm font-bold text-gray-700">No activities yet</p>
                <p className="text-xs text-gray-400">Tap “Log New Activity” to add your first one.</p>
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-gray-700">No activities found</p>
                <p className="text-xs text-gray-400">Try adjusting your category filter or search term.</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {groups.map(({ day, items }) => {
              const [name, date] = dayLabels(day);
              return (
                <div key={day} className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-gray-400 font-semibold px-1">
                    <span>{name}</span>
                    <span>{date}</span>
                  </div>
                  {items.map((act) => (
                    <ActivityCard
                      key={act.id}
                      title={act.title}
                      category={act.category}
                      points={act.points}
                      impactText={act.impactText}
                      time={act.time}
                      onDelete={() => handleDelete(act)}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 6. Log Activity Modal */}
      {isModalOpen && (
        <LogActivityModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}