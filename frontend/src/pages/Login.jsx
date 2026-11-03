import { useState } from 'react';
import PrimaryButton from '../elements/PrimaryButton';

export default function Login({ onLogin, onNavigateToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    // Call your login handler (pass form data or trigger navigation)
    if (onLogin) {
      onLogin(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="flex justify-center items-center gap-2">
          <span className="text-3xl">🌱</span>
          <h1 className="text-2xl font-black text-[#1E6B35]">GreenHome</h1>
        </div>
        <h2 className="mt-4 text-center text-xl font-bold text-gray-900">
          Welcome back!
        </h2>
        <p className="mt-1 text-center text-xs text-gray-500">
          Sign in to track your impact and grow greener together.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-6 shadow-sm border border-gray-100 rounded-3xl space-y-5">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-2xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="alex@example.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#1E6B35] focus:ring-1 focus:ring-[#1E6B35] transition-all bg-gray-50/50"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#1E6B35] focus:ring-1 focus:ring-[#1E6B35] transition-all bg-gray-50/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-[#1E6B35] focus:ring-[#1E6B35]"
                />
                <span className="text-gray-600">Remember me</span>
              </label>

              <a href="#forgot" className="font-semibold text-[#1E6B35] hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <PrimaryButton type="submit">
                Log In
              </PrimaryButton>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
          </div>

          {/* Register Link */}
          <p className="text-center text-xs text-gray-500 pt-2">
            Don’t have a GreenHome account yet?{' '}
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="font-bold text-[#1E6B35] hover:underline cursor-pointer"
            >
              Create Free Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}