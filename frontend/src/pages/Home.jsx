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
             {/* ------------------------------ */}
             {/* HERO SECTION                   */}
             {/* ------------------------------ */}
             <main className="w-full max-w-md md:max-w-xl flex-1 flex flex-col items-stretch text-left">

                {/* Main Title & Subtitle */}
                <section className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 leading-tight text-[var(--color-charcoal)]">
                        Track Your Impact, <br />
                        <span className="text-[var(--color-forest)]">Build a Greener <br className="hidden md:block"/>Future</span>
                    </h1>
                    <p className="text-[var(--color-charcoal-muted)] text-sm md:text-base leading-relaxed">
                        Join thousands reducing their carbon footprint through daily habits, community challenges, and actionable energy insights.
                    </p>
                </section>

                {/* Hero Card */}
                <div>
                    Image/SVG Space            
                </div>

                {/* Primary CTA Button */}
                <Link
                    to="/register"
                    className="w-75 py-4 bg-forest hover:bg-forest text-white text-center font-bold text-base rounded-2xl shadow-md transition-all active:scale-[0.98] mb-8">
                    Get Started - It's Free
                </Link>

             </main>
        </div>

       
    )
}