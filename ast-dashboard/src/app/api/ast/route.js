// src/app/api/users/route.js
import { query } from '../../../../lib/db';

export async function GET() {
  try {
    const users = await query('SELECT * FROM users');
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response(JSON.stringify({ message: 'Database error', error }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return new Response(JSON.stringify({ message: 'Missing name or email' }), { status: 400 });
    }

    const result = await query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
    return new Response(JSON.stringify({ message: 'User added', id: result.insertId }), { status: 201 });
  } catch (error) {
    console.error('Error inserting user:', error);
    return new Response(JSON.stringify({ message: 'Database error', error }), { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, name, email } = body;

    if (!id || !name || !email) {
      return new Response(JSON.stringify({ message: 'Missing id, name, or email' }), { status: 400 });
    }

    const result = await query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
    return new Response(JSON.stringify({ message: 'User updated' }), { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return new Response(JSON.stringify({ message: 'Database error', error }), { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ message: 'Missing id' }), { status: 400 });
    }

    await query('DELETE FROM users WHERE id = ?', [id]);
    return new Response(JSON.stringify({ message: 'User deleted' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return new Response(JSON.stringify({ message: 'Database error', error }), { status: 500 });
  }
}
