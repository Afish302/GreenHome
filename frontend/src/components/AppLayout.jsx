import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import HeaderBar from './HeaderBar';
import Navbar from './Navbar';

/**
 * AppLayout Component
 * 
 * Flexible structural wrapper for application routes.
 * - Always displays the top HeaderBar.
 * - Conditionally renders the bottom Navbar depending on the `showNavbar` prop.
 */
export default function AppLayout({ showNavbar = true }) {
    // Central state to sync the selected tab between HeaderBar and Navbar
    const [activeTab, setActiveTab] = useState('home');

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* 1. Top Header: Persistent top bar across all layout views */}
            <HeaderBar
                title="GreenHome"
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* 2. Main Content Area: Renders matched child routes dynamically via <Outlet />.
          - Appled bottom padding (pb-24) only when bottom Navbar is visible */}
            <main className={`flex-1 max-w-5xl w-full mx-auto p-4 ${showNavbar ? 'pb-24 md:pb-8' : 'pb-8'}`}>
                <Outlet />
            </main>

            {/* 3. Mobile Navbar: Rendered only for main app screens when showNavbar is true */}
            {showNavbar && <Navbar activeTab={activeTab} onChange={setActiveTab} />}
        </div>
    );
}