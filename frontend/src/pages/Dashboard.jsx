import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { useDashboardData } from '../hooks/useDashboardData';

// Components
import ProgressCircle from '../components/ProgressCircle';
import MetricCard from '../components/MetricCard';
import Badge from '../components/badge';
import Button from '../components/button';

export default function Dashboard() {
  const navigate = useNavigate();
  // get user data from dashboard
  const { data: userProfile, loading, error, joinCommunity } = useDashboardData();
  const [joiningId, setJoiningId] = useState(null); // which group is being joined right now

  async function handleJoin(groupId) {
    setJoiningId(groupId);
    const { error: joinError } = await joinCommunity(groupId);
    setJoiningId(null);
    if (joinError) {
      console.error('Join failed:', joinError);
      alert('Could not join this community. Please try again.');
    }
  }
  // todo: fetch dynamically

  const getStatusText= (score) => {
    if(score >= 200) return 'Growing greener.';
    if(score >= 500)  return 'Making progress';
    return 'Getting started!';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }
  // return error message if user das not found or could not be loaded in useDashboard.js
  if(error || !userProfile){
    return(
      <p className="p-4 text-sm text-red-600">
        Could not load your dashboard. Please refresh the page.
      </p>
    )
  };

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
              current={Math.min(userProfile.score, 1000)}
              total={1000}
              className='w-24'
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
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{userProfile.score} points earned so far</span>
            </p>
          </div>
        </div>

        {/* Secondary Metrics Section */}
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            label="Carbon Saved"
            value={String(userProfile.carbonSaved)}
            type="kg"
            subtext={`Rating ${userProfile.activityCount} logged activites`}
          />
          <MetricCard
            icon={<Zap className="w-4 h-4 text-emerald-600" />}
            label="Energy Efficiency"
            value={userProfile.energyRating}
            type=""
            subtext={`Rating ${userProfile.energyRating} - ${userProfile.energySubtext}`}
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
                    {userProfile.communities.length === 0 && (
            <p className="text-xs text-gray-500">No communities yet.</p>
          )}
          {userProfile.communities.map((item) => (
            <div
              key={item.id}
              className="bg-white p-3 rounded-2xl border border-gray-100 flex items-center justify-between gap-3 shadow-xs hover:border-gray-200 transition-all"
            >
              <div className="flex items-center gap-3">
                {/* No image column in the groups table yet, so show the first letter */}
                <div className="w-11 h-11 rounded-xl bg-[#E8F5E9] text-[var(--color-forest,#15803d)] font-bold flex items-center justify-center shrink-0">
                  {item.name.charAt(0)}
                </div>
                <div className="space-y-1 min">
                  <h4 className="text-xs font-bold text-gray-900 leading-none">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-gray-400 font-medium">
                    {item.memberCount} members
                  </p>
                  {item.joined && (
                    <Badge variant="emerald" size="sm" label="• Joined" />
                  )}
                </div>
              </div>

              {item.joined ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 rounded-full px-4 text-xs font-bold"
                  navigate="/community"
                >
                  View
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  className="shrink-0 rounded-full px-4 text-xs font-bold"
                  onClick={() => handleJoin(item.id)}
                >
                  {joiningId === item.id ? 'Joining…' : 'Join'}
                </Button>
              )}
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