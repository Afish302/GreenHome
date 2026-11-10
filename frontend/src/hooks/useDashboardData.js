import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/useAuth';
 
// Turns a monthly electricity usage (kWh) into an energy rating.
// Thresholds are the same ones the dashboard used before.
function getEnergyRating(kwh) {
  if (kwh == null) return { rating: '–', subtext: 'No usage data yet' };
  if (kwh > 500) return { rating: 'B', subtext: 'Average home usage' };
  if (kwh > 300) return { rating: 'A', subtext: 'Top 25% of green homes' };
  return { rating: 'A+', subtext: 'Top 10% of green homes' };
}
 
// Loads everything the Dashboard needs for the logged-in user.
// Returns { data, loading, error }.
export function useDashboardData() {
  const { user } = useAuth();
  const userId = user?.id;
 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    if (!userId) return;
 
    // If the component unmounts before the request finishes,
    // we must not call setState any more.
    let cancelled = false;
 
    async function load() {
      try {
        // 1. The user's own row in our Users table (linked by user_id = auth id)
        const { data: row, error: userError } = await supabase
          .from('Users')
          .select('id, UserName, Score')
          .eq('user_id', userId)
          .maybeSingle();
 
        if (userError) throw userError;
        if (!row) throw new Error('No Users row found for this login');
 
        // 2. The user's latest electricity reading.
        //    electricityUsage.userID points to Users.id (a number), not the auth uuid.
        const { data: usage, error: usageError } = await supabase
          .from('electricityUsage')
          .select('ElectricityUsage, date')
          .eq('userID', row.id)
          .order('date', { ascending: false })
          .limit(1)
          .maybeSingle();
 
        if (usageError) throw usageError;
        
        // 3. get user activities to calculate CO2 & Energy savings
        const { data: activities, error: activitiesError } = await supabase
          .from('activities')
          .select('co2_saved_kg, impact_value, impact_unit')
          .eq('user_id', row.id);

        if (activitiesError) throw activitiesError;

        let carbonSavedKg = 0;
        let energySavedKwh = 0;
        for (const act of activities) {
          carbonSavedKg += Number(act.co2_saved_kg) || 0;
          // Only energy activities store kWh in impact_value (water ones store litres)
          if (act.impact_unit === 'kwh') {
            energySavedKwh += Number(act.impact_value) || 0;
          }
        }

        const score = row.Score ?? 0;
        const energy = getEnergyRating(usage?.ElectricityUsage);
 
        if (!cancelled) {
          setData({
            userName: row.UserName || 'there',
            score,
            carbonSaved: Number(carbonSavedKg.toFixed(1)),
            energySaved: Number(energySavedKwh.toFixed(1)),
            activityCount: activities.length,
            energyRating: energy.rating,
            energySubtext: energy.subtext,
          });
        }
      } catch (err) {
        console.error('Dashboard fetch failed:', err);
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
 
    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);
 
  return { data, loading, error };
}
 