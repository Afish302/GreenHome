import { Link } from 'react-router-dom';
import { Leaf, RefreshCw, Users, Gauge, ArrowRight, Star } from 'lucide-react';

/**
 * FEATURES Section
 * Defined outside of the Home component to avoid re-creation on each render.
 */
const FEATURES = [
    {
        id: 'activities',
        icon: RefreshCw,
        title: 'Log Daily Activities',
        description: 'Track food habits, commute styles/savings, and energy usage to understand users carbon footprint.',
    },

    {
        id: 'community',
        icon: Users,
        title: 'Community & Leaderboards',
        description: 'Compete with friends and participate in local green events.',
    },

    {
        id: 'score',
        icon: Gauge,
        title: 'Real-Time Score',
        description: 'Watch your carbon footprint drop with live feedback',
    },
];

/**
 * STEPS, for the "How It Works" section.
 */
const STEPS = [
    {step: '1', label: 'Register' },
    {step: '2', label: 'Set Baseline' },
    {step: '3', label: 'Start Saving' },
];

/**
 * Home Component
 * This is the main landing page of the application.
 */

export default function Home() {
    return (
        <div className="min-h-screen bg-cream text-charcoal flex flex-col items-center justify-between p-4 md:p-8 font-sans antialiased selection:bg-[var(--color-mint-light) selection:text-forest">
            {/* TOP HEADER NAVIGATION */}
            <header className="w-full max-w-md md:max-w-xl flex items-center justify-between py-3 mb-4">
                <Link 
                    to="/"
                    className="flex items-center gap-2 font-bold text-lg text-forest focus:outline-hidden focus:ring-forest rounded-lg p-1 transition-all"
                    aria-label="Green Home Homepage"
                    >
                    <Leaf className="w-6 h-6 fill-current stroke-none" aria-hidden="true" />
                    <span>Green Home</span>
                </Link>
                <Link 
                    to="/login" 
                    className="text-sm font-semibold text-forest hover:underline focus:outline-hidden focus:ring-2 focus:ring-color-forest rounded-md px-2 py-1"
                    aria-label="Log In"
                    >
                    Log In
                </Link> 
            </header>
        </div>
    )
}