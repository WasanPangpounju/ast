// src/app/dashboard/components/DashboardContent.js

'use client'; // Add this at the top to mark it as a Client Component

import { useRouter } from 'next/router'; // OR import { usePathname } from 'next/navigation' in Next.js App Router
import { useEffect, useState } from 'react';

export default function DashboardContent() {
    const [content, setContent] = useState('Welcome to the Dashboard');
    
    // In Next.js App Router, use the `usePathname` hook instead of `useRouter`
    const pathname = useRouter().pathname; // OR usePathname();

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
