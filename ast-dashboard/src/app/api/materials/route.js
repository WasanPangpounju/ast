import { query } from '../../../../lib/db';

export async function GET() {
  try {
    const materials = await query('SELECT * FROM materials');
    return new Response(JSON.stringify(materials), { status: 200 });
  } catch (error) {
    console.error('Error fetching materials:', error);
    return new Response(JSON.stringify({ message: 'Database error', error }), { status: 500 });
  }
}
