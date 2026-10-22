import { Link } from 'react-router-dom';
import { RefreshCw, Users, Gauge, ArrowRight} from 'lucide-react';
import Header from '../components/header'
import Footer from '../components/footer'

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
            <Header/>
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
                    className="w-full py-4 bg-forest hover:bg-forest text-white text-center font-bold text-base rounded-2xl shadow-md transition-all active:scale-[0.98] mb-8">
                    Get Started - It's Free
                </Link>

                {/*-------------------------- */}
                {/* FEATURES SECTION          */}
                {/*-------------------------- */}
                <section aria labelledby="features-heading" className="mb-8">
                    <h2 id="features-heading" className="text-xl font-bold mb-1 text-charcoal">
                        Small Habits. Real Impact
                    </h2>
                    <p className="text-xs text-[car(--color-charcoal-muted)] mb-4">
                        Everything you need to grow greener, every day.
                    </p>

                    <div className="flex flex-col gap-3">
                        {FEATURES.map((feature) => {
                            const Icon=feature.icon;
                            return (
                                <article
                                    key={feature.id}
                                    className="p-4 bg-white border-slate-100 rounded-2xl shadow-2xs hover:shadow-xs transition-shadow flex item-center gap-4">
                                    <div className="w-11 h-11 rounded-xl bg-mint flex items-center justify-center shrink-0 text-forest">
                                        <Icon className="w-5 h-5" aria-hidden="true" />
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-sm text-charcoal mb-0.5">
                                            {feature.title}
                                        </h3>
                                        <p className="text-xs text-charcoal-muted leading-snug">
                                            {feature.description}
                                        </p>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>

                {/*-------------------------- */}
                {/* HOW IT WORKS SECTION          */}
                {/*-------------------------- */}
                <section aria-labelledby="how-it-works-heading" className="mb-8">
                    <h2 id="how-it-works-heading" className="text-xl font-bold mb-4 text-charcoal">
                        How It Works
                    </h2>
                    <ol className="bg-[var(--color-mint-light)]/60 border border-emerald-100 py-3 px-4 rounded-2xl flex items-center justify-between text-xs font=semibold text-[var(--color-forest)]">
                    {STEPS.map((item, index) => (
                        <li key={item.step} className="flex items-center gap-2"> 
                        <span>{item.step}. {item.label}</span>
                        {index <STEPS.lenght - 1 &&(
                            <ArrowRight className="w-3.5 h-3.5 text-{var(--color-forest)]/60 aria-hidden=true" />
                        )}
                        </li>
                    ))}
                    </ol>
                </section>

                {/*-------------------------- */}
                {/* BOTTOM CTA CARD          */}
                {/*-------------------------- */}
                <section className="bg-white border border-slate-100 p-4 rounded-2xl shadow-2xs mb-8 flex flex-col items-center text-center">
                    <Link
                        to="/register"
                        className="w-full py-3.5 bg-[var(--color-forest)] hover:bg-[var(--color-forest-dark)} text-white font-bold text-sm rounded-xl transition-all shadow-xs mb-3">
                            Create Free Account
                    </Link>

                    <p className="text-xs text-slate-500">
                        Already growing greener? {' '}
                        <Link
                            to="/login"
                            className="text-[var(--color-forest)] font-semibold hover:underline">
                                Sign In
                        </Link>
                    </p>
                </section>
             </main>

            {/*-------------------------- */}
            {/* FOOTER                    */}
            {/*-------------------------- */}
            <Footer/>
        </div> 
    );
}