import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';


export default function Home() {
    return (
            
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
    );
}