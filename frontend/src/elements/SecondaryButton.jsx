// src/pages/elements/SecondaryButton.jsx
export default function SecondaryButton({ children, onClick, variant = 'soft', fullWidth = true }) {
  const variantStyles = {
    soft: 'bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#1E6B35] font-semibold',
    outline: 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium',
    danger: 'bg-white border border-red-200 text-red-600 hover:bg-red-50 font-medium'
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`py-3 px-5 rounded-2xl text-sm transition-all flex items-center justify-center gap-2 ${variantStyles[variant]} ${
        fullWidth ? 'w-full' : ''
      }`}
    >
      {children}
    </button>
  );
}