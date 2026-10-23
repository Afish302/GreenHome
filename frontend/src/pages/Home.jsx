import { Link } from 'react-router-dom';
import { Leaf, RefreshCw, Users, Gauge, ArrowRight } from 'lucide-react';

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
    description: 'Watch your carbon footprint drop with live feedback.',
  },
];

const STEPS = [
  { step: '1', label: 'Register' },
  { step: '2', label: 'Set Baseline' },
  { step: '3', label: 'Start Saving' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-charcoal)] flex flex-col items-center justify-between p-4 sm:p-6 md:p-10 lg:p-12 font-sans antialiased selection:bg-[var(--color-mint-light)] selection:text-[var(--color-forest)]">
      
      <header className="w-full max-w-md md:max-w-4xl lg:max-w-6xl flex items-center justify-between py-3 mb-6 lg:mb-12">
        <Link 
          to="/" 
          className="flex items-center gap-2 font-bold text-lg md:text-xl text-[var(--color-forest)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-forest)] rounded-lg p-1 transition-all"
          aria-label="Green Home Homepage"
        >
          <Leaf className="w-6 h-6 md:w-7 md:h-7 fill-current stroke-none" aria-hidden="true" />
          <span>Green Home</span>
        </Link>
        <Link 
          to="/login" 
          className="text-sm md:text-base font-semibold text-[var(--color-forest)] hover:underline focus:outline-hidden focus:ring-2 focus:ring-[var(--color-forest)] rounded-md px-3 py-1.5"
        >
          Log In
        </Link>
      </header>

      <main className="w-full max-w-md md:max-w-4xl lg:max-w-6xl flex-1 flex flex-col items-stretch text-left">
        
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-10 lg:mb-16">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-tight text-[var(--color-charcoal)]">
              Track Your Impact, <br />
              <span className="text-[var(--color-forest)]">Build a Greener Future</span>
            </h1>
            <p className="text-[var(--color-charcoal-muted)] text-sm sm:text-base lg:text-lg leading-relaxed mb-6 max-w-xl">
              Join thousands reducing their carbon footprint through daily habits, community challenges, and actionable energy insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link 
                to="/register" 
                className="w-full sm:w-auto px-8 py-4 bg-[var(--color-forest)] hover:bg-[var(--color-forest-dark)] text-white text-center font-bold text-base rounded-2xl shadow-md transition-all active:scale-[0.98]"
              >
                Get Started - It's Free
              </Link>
            </div>
          </div>

          <div 
            className="w-full aspect-[300/188] bg-[#EAF7ED] border border-[#D3EED8] rounded-3xl mb-6 flex items-center justify-center relative overflow-hidden shadow-xs"
            aria-hidden="true"
          >
            <svg 
              className="w-full h-full object-contain" 
              viewBox="0 0 540 338" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 240 Q 150 200 300 230 T 540 220 L 540 338 L 0 338 Z" fill="#E2F4E6" />
              <path d="M0 200 Q 120 220 240 190 T 540 210 L 540 338 L 0 338 Z" fill="#DCEFE1" opacity="0.4" />
              <circle cx="102" cy="72" r="23" fill="#E6D3A7" />
              <path d="M174 66 C174 61.5 177.5 58 182 58 C183.5 58 184.8 58.4 186 59.1 C188 54.9 192.3 52 197.2 52 C203 52 208 55.8 209.5 61 C210.5 60.3 211.7 60 213 60 C216.8 60 220 63.1 220 67 C220 71 216.8 74 213 74 L182 74 C177.5 74 174 70.5 174 66 Z" fill="#FFFFFF" />
              <path d="M374 86 C374 81.5 377.5 78 382 78 C383.5 78 384.8 78.4 386 79.1 C388 74.9 392.3 72 397.2 72 C403 72 408 75.8 409.5 81 C410.5 80.3 411.7 80 413 80 C416.8 80 420 83.1 420 87 C420 91 416.8 94 413 94 L382 94 C377.5 94 374 90.5 374 86 Z" fill="#FFFFFF" />
              <rect x="171" y="161" width="156" height="113" fill="#FFFFFF" />
              <path d="M152 178 L249 104 L345 178" stroke="#1F562E" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M241 274 V216 A 17 17 0 0 1 275 216 V274 Z" fill="#1F562E" />
              <circle cx="267" cy="245" r="2.5" fill="#E6D3A7" />
              <rect x="193" y="196" width="20" height="31" rx="4" fill="#FFFFFF" stroke="#81C784" strokeWidth="3" />
              <line x1="203" y1="196" x2="203" y2="227" stroke="#81C784" strokeWidth="2" />
              <line x1="193" y1="211" x2="213" y2="211" stroke="#81C784" strokeWidth="2" />
              <rect x="291" y="196" width="20" height="31" rx="4" fill="#FFFFFF" stroke="#81C784" strokeWidth="3" />
              <line x1="301" y1="196" x2="301" y2="227" stroke="#81C784" strokeWidth="2" />
              <line x1="291" y1="211" x2="311" y2="211" stroke="#81C784" strokeWidth="2" />
              <circle cx="249" cy="170" r="11" fill="#C4E7CE" stroke="#81C784" strokeWidth="2" />
              <g opacity="0.95">
                <path d="M253 125 L317 170 L287 170 L253 133 Z" fill="#42716E" />
                <path d="M253 125 L317 170 L287 170 L253 133 Z" stroke="#C4E7CE" strokeWidth="1.5" />
                <line x1="270" y1="131" x2="299" y2="170" stroke="#C4E7CE" strokeWidth="1" />
                <line x1="285" y1="131" x2="305" y2="159" stroke="#C4E7CE" strokeWidth="1" />
                <line x1="253" y1="147" x2="303" y2="147" stroke="#C4E7CE" strokeWidth="1" />
              </g>
              <path d="M241 274 L232 338 H294 L275 274 Z" fill="#FAF6E9" />
              <rect x="109" y="217" width="9" height="57" fill="#809384" rx="4" />
              <ellipse cx="113" cy="183" rx="34" ry="46" fill="#81C784" />
              <path d="M113 145 V221" stroke="#1F562E" strokeWidth="2" strokeLinecap="round" />
              <path d="M113 205 L98 190" stroke="#1F562E" strokeWidth="2" strokeLinecap="round" />
              <path d="M113 185 L128 170" stroke="#1F562E" strokeWidth="2" strokeLinecap="round" />
              <g transform="translate(121, 222)">
                <rect x="9" y="32" width="5" height="19" fill="#1F562E" transform="rotate(7 9 32)" />
                <rect x="61" y="32" width="5" height="19" fill="#1F562E" transform="rotate(-7 61 32)" />
                <polygon points="0,38 12,0 76,0 64,38" fill="#1F562E" />
                <polygon points="2,36 13,2 74,2 62,36" fill="#42716E" />
                <line x1="26" y1="2" x2="20" y2="36" stroke="#1F562E" strokeWidth="1.5" />
                <line x1="50" y1="2" x2="44" y2="36" stroke="#1F562E" strokeWidth="1.5" />
                <line x1="7" y1="18" x2="69" y2="18" stroke="#1F562E" strokeWidth="1.5" />
              </g>
              <ellipse cx="329" cy="265" rx="18" ry="10" fill="#81C784" />
              <rect x="365" y="228" width="7" height="46" fill="#809384" rx="3.5" />
              <ellipse cx="368" cy="195" rx="24" ry="36" fill="#2E7D32" />
              <circle cx="420" cy="263" r="15" fill="#81C784" />
              <path d="M412 263 L412 90" stroke="#809384" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="412" cy="90" r="4.5" fill="#2E7D32" />
              <path d="M412 90 Q400 60 375 52 Q395 72 412 90 Z" fill="none" stroke="#2E7D32" strokeWidth="1.5" />
              <path d="M412 90 Q445 90 449 110 Q425 100 412 90 Z" fill="none" stroke="#2E7D32" strokeWidth="1.5" />
              <path d="M412 90 Q405 120 375 140 Q395 110 412 90 Z" fill="none" stroke="#2E7D32" strokeWidth="1.5" />
              <ellipse cx="230" cy="279" rx="160" ry="8" fill="#D3EED8" opacity="0.7" />
            </svg>
          </div>
        </section>

        <section aria-labelledby="features-heading" className="mb-12 lg:mb-16">
          <h2 id="features-heading" className="text-xl sm:text-2xl font-bold mb-1 text-[var(--color-charcoal)]">
            Small Habits. Real Impact
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-charcoal-muted)] mb-4">
            Everything you need to grow greener, every day.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.id}
                  className="p-5 bg-white border border-slate-100 rounded-2xl shadow-2xs hover:shadow-md transition-all flex md:flex-col items-start gap-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-[var(--color-mint-light)] flex items-center justify-center shrink-0 text-[var(--color-forest)]">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>

                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-[var(--color-charcoal)] mb-0.5">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--color-charcoal-muted)] leading-snug">
                      {feature.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>        
        </section>                

        <section aria-labelledby="how-it-works-heading" className="mb-12 lg:mb-16">
          <h2 id="how-it-works-heading" className="text-xl sm:text-2xl font-bold mb-4 text-[var(--color-charcoal)]">
            How It Works
          </h2>
          <ol className="bg-[var(--color-mint-light)]/60 border border-emerald-100 py-3.5 px-4 sm:px-6 rounded-2xl flex flex-row items-center justify-between gap-2 text-xs sm:text-sm font-semibold text-[var(--color-forest)]">
            {STEPS.map((item, index) => (
              <li key={item.step} className="flex items-center gap-2"> 
                <span>{item.step}. {item.label}</span>
                {index < STEPS.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--color-forest)]/60" aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
        </section>

        <section className="bg-white border border-slate-100 p-6 rounded-2xl shadow-2xs mb-8 flex flex-col items-center text-center">
          <Link
            to="/register"
            className="w-full max-w-sm py-3.5 bg-[var(--color-forest)] hover:bg-[var(--color-forest-dark)] text-white font-bold text-sm rounded-xl transition-all shadow-xs mb-3"
          >
            Create Free Account
          </Link>

          <p className="text-xs text-slate-500">
            Already growing greener? {' '}
            <Link
              to="/login"
              className="text-[var(--color-forest)] font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </section>
      </main>

      <footer className="w-full max-w-md md:max-w-4xl lg:max-w-6xl py-4 border-t border-slate-200/60 text-center">
        <p className="text-slate-400 text-[10px] sm:text-xs tracking-widest uppercase font-semibold">
          &copy; {new Date().getFullYear()} Green Home | Sustainable Household Intelligence
        </p>
      </footer>
    </div> 
  );
}