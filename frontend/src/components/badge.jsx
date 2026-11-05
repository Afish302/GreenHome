// example: <Badge label="label" className="optional extra styling" />
export default function Badge({ label = 'TEXT HERE!', className = '' }) {

  const preset = "inline-flex items-center px-3 py-1 rounded-full bg-[#EAF4E9] text-[var(--color-forest)] text-xs font-medium";

  return <span className={preset + ' ' + className}>{label}</span>;
}