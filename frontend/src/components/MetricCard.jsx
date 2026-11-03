// pass in a label and value. The card displays them as a headline metric.
// example: <MetricCard icon={<Cloud />} label="Carbon Saved" value="100" type="kg" subtext="up 5% since last month" className="optional extra styling" />
export default function MetricCard({ icon, label = 'Label here!', value = '0', type = 'Value Type here!', subtext = 'Subtext here!', className = '' }) {

  // card box
  return (
    <div className={"bg-white rounded-3xl p-5 shadow-sm " + className}>

      {/* icon and label */}
       <div className="flex items-center justify-start gap-2 text-[var(--color-charcoal-muted)] text-sm">
        {icon}
        <span>{label}</span>
      </div>

      {/* value and value type */}
      <div className="mt-2 flex items-baseline justify-start gap-1">
        <span className="text-4xl font-bold text-[var(--color-charcoal)]">{value}</span>
        <span className="text-lg text-[var(--color-charcoal-muted)]">{type}</span>
      </div>

      {/* subtext */}
      <p className="mt-2 text-xs text-left text-[var(--color-forest)]">{subtext}</p>
    </div>
  );
}