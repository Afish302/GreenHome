export default function PrimaryButton({ children, onClick, fullWidth = true, disabled = false, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`bg-[#1E6B35] hover:bg-[#165227] active:scale-[0.99] text-white font-semibold py-3.5 px-6 rounded-2xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
    >
      {children}
    </button>
  );
}