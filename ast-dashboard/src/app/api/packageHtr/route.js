import { query } from '../../../../lib/db';

export async function GET() {
  try {
    const htrpackages = await query('SELECT * FROM htrpackages');
    return new Response(JSON.stringify(htrpackages), { status: 200 });
  } catch (error) {
    console.error('Error fetching htrpackages:', error);
    return new Response(JSON.stringify({ message: 'Database error', error }), { status: 500 });
  }
}
