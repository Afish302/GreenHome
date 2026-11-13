import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { LoaderCircle } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { getRecyclingTotals } from '../lib/recyclingStats';
import { RECYCLING_RULES } from '../lib/recyclingRules';

// One colour per category, used in both charts so a category looks the same everywhere.
// Built around the app's greens (forest and mint in index.css) plus earthy tones.
const CATEGORY_COLOURS = {
  battery: '#1B5E20', // forest-dark
  cardboard: '#A9805B', // warm brown
  food_waste: '#C9A227', // muted gold
  general_waste: '#8A9490', // grey-green
  glass: '#4DB6AC', // soft teal
  metal: '#546E7A', // blue-grey
  paper: '#81C784', // mint
  plastic: '#2E7D32', // forest
  textiles: '#D4846A', // terracotta
};
const FALLBACK_COLOUR = '#2E7D32';

const cardClass =
  'rounded-[18px] bg-white p-4 shadow-sm outline outline-[1.3px] -outline-offset-[1.3px] outline-gray-200';

/**
 * Shows how many items the signed-in user has scanned: a total, a bar chart and a pie chart.
 * It loads fresh numbers every time it is shown.
 */
export default function RecyclingChart() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    if (!user) return undefined;
    let cancelled = false; // ignore a slow response if the page has moved on
    getRecyclingTotals(user.id)
      .then((totals) => {
        if (cancelled) return;
        setRows(totals);
        setStatus('ready');
      })
      .catch((err) => {
        console.error('Loading recycling data failed:', err);
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  // One entry for every known category (0 if never scanned), in the order of recyclingRules.js
  const amounts = Object.fromEntries(rows.map((r) => [r.category, r.amount]));
  const data = Object.entries(RECYCLING_RULES).map(([category, rule]) => ({
    category,
    name: rule.label,
    amount: amounts[category] ?? 0,
    colour: CATEGORY_COLOURS[category] ?? FALLBACK_COLOUR,
  }));
  const total = data.reduce((sum, d) => sum + d.amount, 0);
  const pieData = data.filter((d) => d.amount > 0); // a pie only shows slices that exist

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-[28px] font-semibold leading-[34px] text-charcoal">Your recycling</h2>
        <p className="text-sm text-charcoal-muted">Every item you scan is counted here.</p>
      </div>

      {status === 'loading' && (
        <div className="flex items-center gap-2 text-sm text-charcoal-muted" role="status">
          <LoaderCircle className="size-4 animate-spin text-forest" aria-hidden="true" />
          Loading your recycling...
        </div>
      )}

      {status === 'error' && (
        <p className="text-sm text-red-700" role="alert">
          We couldn't load your recycling data. Please try again later.
        </p>
      )}

      {status === 'ready' && (
        <>
          <div className="flex items-center justify-between rounded-[18px] bg-mint-light px-5 py-4">
            <span className="text-sm font-medium text-forest-dark">Total items recycled</span>
            <span className="text-3xl font-bold tabular-nums text-forest" data-testid="total">
              {total}
            </span>
          </div>

          {total === 0 && (
            <p className="text-sm text-charcoal-muted">Nothing yet. Scan an item and it will show up here.</p>
          )}

          {/* Bar chart: one column per category, names along the bottom */}
          <div className={cardClass} data-testid="bar-chart">
            <p className="mb-3 text-sm font-semibold text-charcoal">Items by category</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                  <CartesianGrid vertical={false} stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    angle={-40}
                    textAnchor="end"
                    height={64}
                    tick={{ fontSize: 12, fill: '#4a4a4a' }}
                    tickLine={false}
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#4a4a4a' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#e8f5e9' }} formatter={(value) => [value, 'Items']} />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={36}>
                    {data.map((d) => (
                      <Cell key={d.category} fill={d.colour} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie chart: each category's share of everything scanned */}
          {total > 0 && (
            <div className={cardClass} data-testid="pie-chart">
              <p className="mb-3 text-sm font-semibold text-charcoal">Share of your recycling</p>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="amount"
                      nameKey="name"
                      innerRadius="50%"
                      outerRadius="80%"
                      paddingAngle={pieData.length > 1 ? 2 : 0}
                    >
                      {pieData.map((d) => (
                        <Cell key={d.category} fill={d.colour} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} (${Math.round((value / total) * 100)}%)`, name]} />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ fontSize: 12 }}
                      formatter={(value) => <span style={{ color: '#4a4a4a' }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
