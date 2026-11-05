/*import { useState } from 'react';*/
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Leaf, LayoutDashboard, Camera, Users, Settings, ListTodo } from 'lucide-react';

// Bottom navigation for mobile devices
import BottomNav from './BottomNav';

/**
 * AppLayout Component
 * 
 * Responsive Application Wrapper:
 * - Mobile (< 768px): Renders simple top brand bar + bottom navigation tab bar (BottomNav.jsx).
 * - Desktop (>= 768px): Renders full top header bar with horizontal navigation menu links.
 */
export default function AppLayout({ showNavbar = true }) {
  const location = useLocation();

  // Navigation items used for desktop header navigation
  const navItems = [
    { label: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Community', path: '/community', icon: Users },
    { label: 'Activities', path: '/activities', icon: ListTodo },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* =========================================================
          TOP HEADER
          - Mobile: Brand logo & name only.
          - Desktop (md:flex): Brand logo + horizontal navigation menu.
         ========================================================= */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg text-emerald-800">
            <Leaf className="w-6 h-6 text-emerald-600 fill-emerald-600" />
            <span>Green Home</span>
          </Link>

          {/* Desktop Top Navigation Menu (hidden on mobile via `hidden md:flex`) */}
          {showNavbar && (
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      {/* =========================================================
          MAIN CONTENT AREA
          - Mobile: Padding bottom accommodates the fixed BottomNav bar.
          - Desktop: Normal padding.
         ========================================================= */}
      <main className={`flex-1 max-w-5xl w-full mx-auto p-4 ${showNavbar ? 'pb-24 md:pb-8' : 'pb-8'}`}>
        <Outlet />
      </main>

      {/* =========================================================
          MOBILE BOTTOM NAVIGATION
          - Rendered conditionally on mobile viewports (< 768px).
          - Hidden on desktop views (`md:hidden` inside BottomNav or wrapper).
         ========================================================= */}
      {showNavbar && (
        <div className="md:hidden">
          <BottomNav />
        </div>
      )}
    </div>
  );
}