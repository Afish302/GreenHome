import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, TrendingUp, TrendingDown } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

// Reusable Components from src/components/
import ProgressCircle from '../components/ProgressCircle';
import MetricCard from '../components/MetricCard';
import Badge from '../components/badge';
import Button from '../components/button';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Dynamic user profile state fetched from Supabase
  const [userProfile, setUserProfile] = useState({
    userName: '',
    score: 0,
    prevScore: 0, // Baseline used to calculate +/- points delta
  });

  // Mock community data matching Figma UI
  const communities = [
    {
      id: 1,
      name: 'Neighborhood Recycling',
      members: '248 members',
      tag: 'Recycling week',
      joined: true,
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=120&q=80',
    },
    {
      id: 2,
      name: 'Solar Powered Homes',
      members: '186 members',
      tag: 'Sun-powered October',
      joined: false,
      image: 'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=120&q=80',
    },
    {
      id: 3,
      name: 'Zero Waste Club',
      members: '512 members',
      tag: 'Plastic-free week',
      joined: false,
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=120&q=80',
    },
  ];

  // Fetch real User metrics from Supabase on component mount
useEffect(() => {
  async function fetchUserData() {
    try {
      setLoading(true);

      // Fetch all rows first to verify connection and avoid .single() error crashes
      const { data, error } = await supabase
        .from('Users')
        .select('id, UserName, Score');

      if (error) {
        console.error('Supabase Query Error:', error.message);
        throw error;
      }

      // If data exists, pick the first user record
      if (data && data.length > 0) {
        const firstUser = data[0];
        setUserProfile({
          userName: firstUser.UserName || 'User',
          score: firstUser.Score ?? 0,
          prevScore: (firstUser.Score ?? 0) - 8,
        });
      }
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  }

  fetchUserData();
}, []);

  // Compute calculated values dynamically
  const scoreDiff = userProfile.score - userProfile.prevScore;
  const isPositiveDiff = scoreDiff >= 0;

  const getStatusText = (score) => {
    if (score >= 80) return 'Growing greener.';
    if (score >= 50) return 'Making progress.';
    return 'Getting started.';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* =========================================================
          SECTION 1: USER GREETING & PROFILE
         ========================================================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Welcome back, {userProfile.userName}! 👋
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Small steps. A greener tomorrow.
          </p>
        </div>

        {/* User Profile Avatar */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            alt={`${userProfile.userName} Profile`}
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
          />
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
        </div>
      </div>

      {/* =========================================================
          SECTION 2: YOUR IMPACT (Score & Metric Cards)
         ========================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Your impact</h2>
          <select className="text-xs text-gray-500 bg-transparent font-medium focus:outline-none cursor-pointer">
            <option>This month</option>
            <option>Last month</option>
            <option>This year</option>
          </select>
        </div>

        {/* Dynamic Eco Score Highlight Card */}
        <div className="bg-[#E8F5E9]/60 p-5 rounded-3xl border border-emerald-100 flex items-center gap-5">
          {/* Dynamic Progress Circle Component */}
          <div className="shrink-0">
            <ProgressCircle
              value={userProfile.score}
              max={100}
              size={90}
              strokeWidth={8}
              color="#1E6B35"
            />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-[var(--color-forest,#15803d)] uppercase tracking-wider">
              Eco Score
            </span>
            <h3 className="text-xl font-black text-gray-900 leading-tight">
              {getStatusText(userProfile.score)}
            </h3>
            <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              {isPositiveDiff ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
              )}
              <span>
                {Math.abs(scoreDiff)} points {isPositiveDiff ? 'up from' : 'down from'} last month
              </span>
            </p>
          </div>
        </div>

        {/* Secondary Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            title="Carbon Saved"
            value="120"
            unit="kg"
            trend="↑ 18% vs. last month"
            icon="leaf"
          />
          <MetricCard
            title="Energy Efficiency"
            value="A+"
            badgeText="Top 10% of green homes"
            icon="zap"
          />
        </div>
      </section>

      {/* =========================================================
          SECTION 3: BETTER TOGETHER (Community Group List)
         ========================================================= */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Better together</h2>
            <p className="text-xs text-gray-500">Find your community. Grow your impact.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/community')}
            className="text-xs font-bold text-[var(--color-forest,#15803d)] hover:underline flex items-center"
          >
            See all
          </button>
        </div>

        {/* Community List */}
        <div className="space-y-2.5">
          {communities.map((item) => (
            <div
              key={item.id}
              className="bg-white p-3 rounded-2xl border border-gray-100 flex items-center justify-between gap-3 shadow-xs hover:border-gray-200 transition-all"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-gray-900 leading-none">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-gray-400 font-medium">
                    {item.members}
                  </p>
                  <Badge variant="emerald" size="sm">
                    • {item.tag}
                  </Badge>
                </div>
              </div>

              {/* Action Button */}
              <Button
                variant={item.joined ? 'outline' : 'primary'}
                size="sm"
                className="shrink-0 rounded-full px-4 text-xs font-bold"
              >
                {item.joined ? 'View' : 'Join'}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          SECTION 4: RECYCLING SCANNER CALLOUT
         ========================================================= */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recycling scanner</h2>
          <span className="text-xs text-gray-400">Scan and sort</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between gap-3 shadow-xs">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-900">Scan packaging</h3>
            <p className="text-xs text-gray-500">
              Open camera and get recycling guidance.
            </p>
            <Badge variant="emerald" size="sm">
              • Ready to scan
            </Badge>
          </div>

          <button
            type="button"
            onClick={() => navigate('/scanner')}
            className="bg-[var(--color-forest,#15803d)] text-white px-4 py-3 rounded-2xl flex flex-col items-center justify-center gap-1 hover:opacity-90 transition-opacity shadow-sm shrink-0"
          >
            <Camera className="w-5 h-5" />
            <span className="text-xs font-bold">Scan</span>
          </button>
        </div>
      </section>

    </div>
  );
}