// src/app/dashboard/page.js

'use client'; // This is required for Client-side behavior

// import Sidebar from './components/Sidebar';
// import DashboardContent from './components/DashboardContent';
import Sidebar from '../../components/Sidebar'; // Corrected path
import DashboardContent from './components/DashboardContent';

export default function DashboardPage() {
    return (
        <div className="dashboard-container">
            <Sidebar />
            <DashboardContent />
        </div>
    );
}
