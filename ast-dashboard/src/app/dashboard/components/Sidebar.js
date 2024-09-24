// src/app/dashboard/components/Sidebar.js

import Link from 'next/link';

export default function Sidebar() {
    return (
        <div className="sidebar">
            <h2>Dashboard</h2>
            <ul>
                <li><Link href="/dashboard/home">Home</Link></li>
                <li><Link href="/dashboard/users">Users</Link></li>
                <li><Link href="/dashboard/settings">Settings</Link></li>
            </ul>
        </div>
    );
}
