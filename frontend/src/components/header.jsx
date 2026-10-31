import { Link } from 'react-router-dom';
import { Leaf, ArrowLeft } from 'lucide-react';

export default function HeaderBar({ title, subtitle, onBack, rightAction, activeTab, onTabChange }) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'community', label: 'Community' },
    { id: 'activities', label: 'Activities' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 py-3 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* Left Side: Brand Logo & Optional Page Subtitle */}
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-1.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)]"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-lg md:text-xl text-[var(--color-forest)] focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)] rounded-lg p-1 transition-all"
            aria-label="Green Home Homepage"
          >
            <Leaf className="w-6 h-6 md:w-7 md:h-7 fill-current stroke-none" aria-hidden="true" />
            <span>{title || 'Green Home'}</span>
          </Link>

          {subtitle && (
            <span className="hidden sm:inline-block text-xs text-gray-400 border-l border-gray-200 pl-3">
              {subtitle}
            </span>
          )}
        </div>

        {/* Center: Desktop Navigation Tabs (Hidden on Mobile) */}
        {onTabChange && (
          <nav className="hidden md:flex items-center gap-1 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)] ${isActive
                      ? 'bg-[var(--color-forest)] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        )}

        {/* Right Side: Log In Link or Custom Action Buttons */}
        <div className="flex items-center gap-2">
          {rightAction ? (
            rightAction
          ) : (
            <Link
              to="/login"
              className="text-sm md:text-base font-semibold text-[var(--color-forest)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--color-forest)] rounded-md px-3 py-1.5"
            >
              Log In
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}