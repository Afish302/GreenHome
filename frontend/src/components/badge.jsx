// example: <Badge label="label" />
export default function Badge({ label = 'TEXT HERE!' }) {

  const preset = "inline-flex items-center px-3 py-1 rounded-full bg-[#EAF4E9] text-[var(--color-forest)] text-xs font-medium";

  return <span className={preset}>{label}</span>;
}