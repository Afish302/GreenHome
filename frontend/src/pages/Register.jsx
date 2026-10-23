import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, ArrowLeft, Eye, EyeOff, Sprout } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    agreedToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registering user:', formData);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] flex flex-col items-center p-4 sm:p-6 md:p-8 font-sans antialiased selection:bg-[#E8F5E9] selection:text-[#2E7D32]">
      
      <div className="w-full max-w-sm sm:max-w-md flex flex-col justify-start">
        
        {/* Pinned Top Header */}
        <header className="w-full flex items-center justify-between pt-2 pb-8">
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="p-2 -ml-2 rounded-full hover:bg-slate-200/50 text-[#1A1A1A] transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
          </button>

          <Link 
            to="/" 
            className="flex items-center gap-2 font-bold text-lg text-[#2E7D32]"
            aria-label="Green Home Homepage"
          >
            <Leaf className="w-5 h-5 fill-current stroke-none" aria-hidden="true" />
            <span>Green Home</span>
          </Link>

          <div className="w-8" aria-hidden="true" />
        </header>

        {/* Content & Form Block */}
        <main className="w-full text-left">
          
          {/* Title Section */}
          <section className="mb-7">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 text-[#1A1A1A]">
              Create your account
            </h1>
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-normal">
              Small habits. Real impact. Start tracking your carbon footprint and build a greener future.
            </p>
          </section>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="fullName" className="text-sm font-bold text-[#1A1A1A]">
                Full name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your full name"
                required
                className="w-full px-4 py-3.5 bg-white border border-slate-200/90 rounded-2xl text-base focus:outline-hidden focus:ring-2 focus:ring-[#2E7D32] transition-all placeholder:text-slate-400 text-[#1A1A1A] shadow-2xs"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-bold text-[#1A1A1A]">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3.5 bg-white border border-slate-200/90 rounded-2xl text-base focus:outline-hidden focus:ring-2 focus:ring-[#2E7D32] transition-all placeholder:text-slate-400 text-[#1A1A1A] shadow-2xs"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-bold text-[#1A1A1A]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  minLength={8}
                  className="w-full px-4 py-3.5 bg-white border border-slate-200/90 rounded-2xl text-base focus:outline-hidden focus:ring-2 focus:ring-[#2E7D32] transition-all placeholder:text-slate-400 text-[#1A1A1A] pr-12 shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <span className="text-xs text-slate-400 font-normal mt-0.5">
                Use at least 8 characters, including a number.
              </span>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2.5 mt-1">
              <input
                type="checkbox"
                id="agreedToTerms"
                name="agreedToTerms"
                checked={formData.agreedToTerms}
                onChange={handleChange}
                required
                className="mt-0.5 w-4 h-4 rounded-md text-[#2E7D32] focus:ring-[#2E7D32] border-slate-300 accent-[#2E7D32] cursor-pointer"
              />
              <label htmlFor="agreedToTerms" className="text-xs sm:text-sm text-slate-500 leading-snug cursor-pointer">
                I agree to the{' '}
                <a href="#terms" className="text-[#2E7D32] font-semibold underline underline-offset-2">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#privacy" className="text-[#2E7D32] font-semibold underline underline-offset-2">
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            {/* Primary CTA Button (Pill Shape) */}
            <button
              type="submit"
              className="w-full py-4 mt-3 bg-[#2E7D32] hover:bg-[#1b5e20] text-white font-bold text-base rounded-full transition-all shadow-md shadow-emerald-900/10 active:scale-[0.98] cursor-pointer"
            >
              Create Free Account
            </button>
          </form>

          {/* Subtext info */}
          <div className="flex items-center justify-center gap-2 mt-6 text-xs sm:text-sm text-slate-500 font-medium">
            <Sprout className="w-4.5 h-4.5 text-[#2E7D32]" />
            <span>Next, we'll find your carbon baseline.</span>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-xs sm:text-sm text-slate-500 mt-6 font-medium pb-8">
            Already growing greener?{' '}
            <Link to="/login" className="text-[#2E7D32] font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </main>
      </div>
    </div>
  );
}