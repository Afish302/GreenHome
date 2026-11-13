import { supabase } from './supabaseClient';

/**
 * Returns how many items the signed-in user has scanned in each category,
 * e.g. [{ category: 'glass', amount: 3 }, ...]. Categories never scanned are not included.
 *
 * `authId` is the Supabase login ID (user.id). Throws if the data could not be loaded.
 */
export async function getRecyclingTotals(authId) {
  // The waste table uses the number in Users.id, not the login ID
  const { data: row, error: userError } = await supabase
    .from('Users')
    .select('id')
    .eq('user_id', authId)
    .maybeSingle();

  if (userError) throw userError;
  if (!row) throw new Error('No Users row found for this login');

  const { data, error } = await supabase
    .from('user_waste')
    .select('trash_category, amount')
    .eq('user_id', row.id);
  if (error) throw error;

  return data.map((r) => ({ category: r.trash_category, amount: Number(r.amount) }));
}