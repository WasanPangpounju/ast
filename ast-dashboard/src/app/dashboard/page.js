// src/app/dashboard/page.js

'use client'; // This is required for Client-side behavior

import { useState, useEffect } from 'react';

export default function DashboardPage() {
    const [data, setData] = useState(null);

    useEffect(() => {
        // Fetch data or handle client-side logic
        fetch('/api/some-endpoint')
            .then((res) => res.json())
            .then((data) => setData(data));
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            {data ? <p>Data: {data}</p> : <p>Loading...</p>}
        </div>
    );
}
