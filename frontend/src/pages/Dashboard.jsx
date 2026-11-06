import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, TrendingUp, TrendingDown, Leaf, Zap } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

// Components
import ProgressCircle from '../components/ProgressCircle';
import MetricCard from '../components/MetricCard';
import Badge from '../components/badge';
import Button from '../components/button';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({
    userName: '',
    score: 0,
    prevScore: 0,
    carbonSaved: 0,
    energyRating: 'B',
    energySubject: 'Calculating rating...',
  });

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

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);

      // 1. Fetch user Record from Supabase
      const { data: userData, error: UserError } = await supabase
        .from('Users')
        .select('*')  
        .limit(1);

        if (UserError) throw UserError;

        if (userData && userData.length > 0) {
          const user = userData[0];
          const currentScore = user.Score ?? 0;
      // 2. Dynamic Carbon Calculation
      const calculatedCarbon = Math.round(currentScore * 0.1);

      // 3. Fetch electricityUsage table for Energy Efficiency calculation
      let rating = 'A+';
      let ratingSub = 'Top 10% of green homes';

      const { data: usageData } = await supabase
        .from ('electricityUsage')
        .select('*')
        .limit(1);
      
      if (usageData && usageData.length > 0) {
        const usage = usageData[0].amount || usageData[0].kwh || 0;
        if (usage > 500) {
          rating = 'B';
          ratingSub = 'Average home usage';
        } else if (usage > 300) {
          rating = 'A';
          ratingSub = 'Top 25% of green homes';
        }
      }

          setUserProfile({
            userName: user.UserName || 'User',
            score: currentScore,
            prevScore: currentScore - 8,
            carbonSaved: calculatedCarbon || 120,
            energyRating: rating,
            energySubject: ratingSub,
          });
        } 
      } catch (err) {
        console.error('💥 Fetch execution failed:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

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
      {/* 1. Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Welcome back, {userProfile.userName}! 👋
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Small steps. A greener tomorrow.
          </p>
        </div>

        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            alt={`${userProfile.userName} Profile`}
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
          />
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
        </div>
      </div>

      {/* 2. Impact Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Your impact</h2>
          <select className="text-xs text-gray-500 bg-transparent font-medium focus:outline-none cursor-pointer">
            <option>This month</option>
            <option>Last month</option>
            <option>This year</option>
          </select>
        </div>

        {/* Eco Score Section */}
        <div className="bg-[#E8F5E9]/60 p-5 rounded-3xl border border-emerald-100 flex items-center gap-5">
          <div className="shrink-0">
            <ProgressCircle
              value={userProfile.score > 100 ? userProfile.score % 100 : userProfile.score}
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

        {/* Secondary Metrics Section */}
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            label="Carbon Saved"
            value={String(userProfile.carbonSaved)}
            type=""
            subtext={userProfile.energySubject}
          />
          <MetricCard
            icon={<Zap className="w-4 h-4 text-emerald-600" />}
            label="Energy Efficiency"
            value={userProfile.energyRating}
            type=""
            subtext={userProfile.energySubject}
          />
        </div>
      </section>

{/* 3. Community Section */}
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
                  className="w-11 h-11 rounded-xl object-cover shrink-0"
                />
                <div className="space-y-1 min">
                  <h4 className="text-xs font-bold text-gray-900 leading-none">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-gray-400 font-medium">
                    {item.members}
                  </p>
                  <Badge variant="emerald" size="sm" label={'• ' + item.tag}>
                    • {item.tag}
                  </Badge>
                </div>
              </div>

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

      {/* Scanner Section */}
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
            <Badge variant="emerald" size="sm" label='• Ready to scan'>
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

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Finish setting up</h2>
          <span className="text-xs text-gray-400">3 quick steps</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between gap-3 shadow-xs">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-900">Complete your setup</h3>
            <p className="text-xs text-gray-500">
              Just a few steps to go.
            </p>
            <Badge variant="emerald" size="sm" label='Finish your setup'>
            </Badge>
          </div>

          <button
            type="button"
            onClick={() => {navigate('/onboardCommute'); window.scrollTo(0, 0);}}
            className="bg-[var(--color-forest,#15803d)] text-white px-4 py-3 rounded-2xl flex flex-col items-center justify-center gap-1 hover:opacity-90 transition-opacity shadow-sm shrink-0"
          >
            <span className="text-xs font-bold">Resume</span>
          </button>
        </div>
      </section>
    </div>
  );
}