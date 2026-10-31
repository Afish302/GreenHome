import React, { useState } from 'react';

export default function Navbar({ activeTab = 'home', onChange }) {
    const [currentTab, setCurrentTab] = useState(activeTab);

    const navItems = [
        { id: 'home', label: 'Home', icon: '🏠' },
        { id: 'community', label: 'Community', icon: '👥' },
        { id: 'activities', label: 'Activities', icon: '📋' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
    ];

    const handleSelect = (id) => {
        setCurrentTab(id);
        if (onChange) onChange(id);
    };

    return (
        /* `md:hidden` completely hides this bottom bar on desktop screens (768px+) */
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-2 px-6 flex justify-around items-center z-50">
            {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item.id)}
                        className="flex flex-col items-center gap-1 group focus:outline-none"
                    >
                        <div
                            className={`px-4 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${isActive
                                    ? 'bg-[#E8F5E9] text-[#1E6B35]'
                                    : 'text-gray-400 group-hover:text-gray-600'
                                }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                        </div>
                        <span
                            className={`text-[10px] transition-colors duration-200 ${isActive
                                    ? 'font-bold text-[#1E6B35]'
                                    : 'font-medium text-gray-400 group-hover:text-gray-600'
                                }`}
                        >
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
}