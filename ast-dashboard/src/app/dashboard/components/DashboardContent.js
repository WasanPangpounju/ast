// src/app/dashboard/components/DashboardContent.js

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function DashboardContent() {
    const [content, setContent] = useState('Welcome to the Dashboard');
    const router = useRouter();

    // Update content based on current route
    useEffect(() => {
        if (router.pathname.includes('/dashboard/users')) {
            setContent('User Management Section');
        } else if (router.pathname.includes('/dashboard/settings')) {
            setContent('Settings Section');
        } else {
            setContent('Welcome to the Dashboard');
        }
    }, [router.pathname]);

    return (
        <div className="dashboard-content">
            <h1>{content}</h1>
        </div>
    );
}
