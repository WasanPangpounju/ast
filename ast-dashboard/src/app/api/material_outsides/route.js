import { query } from '../../../../lib/db';

export async function GET() {
  try {
    const material_outsides = await query('SELECT * FROM material_outsides');
    return new Response(JSON.stringify(material_outsides), { status: 200 });
  } catch (error) {
    console.error('Error fetching material_outsides:', error);
    return new Response(JSON.stringify({ message: 'Database error', error }), { status: 500 });
  }
}
