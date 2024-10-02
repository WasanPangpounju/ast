import { query } from '../../../../lib/db';

export async function GET() {
  try {
    const materialstores = await query('SELECT * FROM materialstores');
    return new Response(JSON.stringify(materialstores), { status: 200 });
  } catch (error) {
    console.error('Error fetching materialstores:', error);
    return new Response(JSON.stringify({ message: 'Database error', error }), { status: 500 });
  }
}
