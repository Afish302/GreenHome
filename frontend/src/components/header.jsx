import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';


export default function Home() {
    return (
            
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
    );
}