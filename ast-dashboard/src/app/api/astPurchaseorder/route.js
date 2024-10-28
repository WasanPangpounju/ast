import { query } from '../../../../lib/db';

export async function GET() {
  try {
    const astPurchaseorder = await query('SELECT * FROM astPurchaseorder');
    return new Response(JSON.stringify(astPurchaseorder), { status: 200 });
  } catch (error) {
    console.error('Error fetching astPurchaseorder:', error);
    return new Response(JSON.stringify({ message: 'Database error', error }), { status: 500 });
  }
}
