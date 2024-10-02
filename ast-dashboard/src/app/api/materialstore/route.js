import { query } from '../../../../lib/db';

export async function GET() {
  try {
    const materialstore = await query('SELECT * FROM materialstore');
    return new Response(JSON.stringify(materialstore), { status: 200 });
  } catch (error) {
    console.error('Error fetching materialstore:', error);
    return new Response(JSON.stringify({ message: 'Database error', error }), { status: 500 });
  }
}
