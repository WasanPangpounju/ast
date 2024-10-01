// src/app/dashboard/users/page.js

'use client'; // For client-side behavior

import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar'; // Import Sidebar from the shared components folder

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch users from the API on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/ast');
                if (!response.ok) {
                    throw new Error(`Failed to fetch users: ${response.status}`);
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="dashboard-container">
            <Sidebar /> 
            {/* Sidebar is included here */}
            <div className="dashboard-content">
                <h1>Users Management</h1>
                {loading && <div>Loading users...</div>}
                {error && <div>Error fetching users: {error}</div>}
                {users.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : !loading && <p>No users found</p>}
            </div>
        </div>
    );
}
