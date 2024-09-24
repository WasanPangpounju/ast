// src/app/dashboard/page.js

import Sidebar from './components/Sidebar';
import DashboardContent from './components/DashboardContent';

export default function Dashboard() {
    return (
        <div className="dashboard-container">
            <Sidebar />
            <DashboardContent />
        </div>
    );
}
