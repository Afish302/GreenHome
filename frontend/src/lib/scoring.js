import { supabase } from './supabaseClient';

/**
 * Adds the points for a scanned item to the signed-in user's score.
 * The database decides how many points each category is worth
 * (the numbers in recyclingRules.js are for display only and must match).
 *
 * `authId` is the Supabase login ID (user.id). `category` is a class name
 * from the model, e.g. 'glass'. Throws if the points could not be saved.
 */
export async function recordScan(authId, category) {
  // The score functions use the number in Users.id, not the login ID
  const { data: row, error: userError } = await supabase
    .from('Users')
    .select('id')
    .eq('user_id', authId)
    .maybeSingle();

  if (userError) throw userError;
  if (!row) throw new Error('No Users row found for this login');

  const { error } = await supabase.rpc('add_item_points', {
    input_user_id: row.id,
    p_item_name: category,
  });
  if (error) throw error;
}