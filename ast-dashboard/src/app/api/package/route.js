import { query } from '../../../../lib/db';

export async function GET() {
  try {
    const packageasts = await query('SELECT * FROM packageasts');
    return new Response(JSON.stringify(packageasts), { status: 200 });
  } catch (error) {
    console.error('Error fetching packageasts:', error);
    return new Response(JSON.stringify({ message: 'Database error', error }), { status: 500 });
  }
}
