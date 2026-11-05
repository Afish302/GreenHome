require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// this function calls a supabase function and returns the result.
// if the result is a function that returns nothing, returns null.
async function callDBFunction(functionName: string, params: object) {
  const { data, error } = await supabase.rpc(functionName, params);
  // console.table(data)
  return data;
}

async function getFromTable(tableName: string, columns: string[] = ['*']) {
  const { data, error } = await supabase.from(tableName).select(columns.join(','));
  if (error) throw error;
  return data;
  }

async function main() {
  let output = await getFromTable('Users', ['id', 'UserName', 'Score']);
  console.table(output);
}
main();