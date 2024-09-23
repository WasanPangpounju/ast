// app/api/users/route.js
import { query } from '../../../../lib/db';

export async function GET(request) {
  try {
    const results = await query('SELECT * FROM materialstores');
    return new Response(JSON.stringify(results), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Database error', error }), { status: 500 });
  }
}
