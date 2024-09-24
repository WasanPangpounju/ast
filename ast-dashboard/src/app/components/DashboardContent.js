// src/app/dashboard/components/DashboardContent.js

'use client'; // This is required for Client-side behavior

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardContent() {
    const [content, setContent] = useState('Welcome to the Dashboard');
    const pathname = usePathname();

    useEffect(() => {
        if (pathname.includes('/dashboard/users')) {
            setContent('User Management Section');
        } else if (pathname.includes('/dashboard/settings')) {
            setContent('Settings Section');
        } else {
            setContent('Welcome to the Dashboard');
        }
    }, [pathname]);

    return (
        <div className="dashboard-content">
            <h1>{content}</h1>
        </div>
    );
}
