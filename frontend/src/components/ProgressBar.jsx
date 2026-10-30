// pass in steps done and total steps. The bar fills to match.
// example: <ProgressBar current={1} total={3} labelText="Step 1 of 3" />
export default function ProgressBar({ current = 0, total = 1, labelText = 'TEXT HERE! TEXT HERE! TEXT HERE!' }) {
  
    // turns steps into a % for the bar fill
  const percent = (current / total) * 100;
  const barFill = percent + '%';

  // set to the width of whatever its inside
  return (
    <div className="w-full flex flex-col gap-2">
      <span className="text-xs font-semibold text-left text-[var(--color-forest)]">

        {/* set labelText to change the text above the bar */}
        {labelText}
      </span>

      <div className="w-full h-2 bg-[#DCE7DC] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--color-forest)] rounded-full transition-all duration-300"
          style={{ width: barFill }}
        />
      </div>
    </div>
  );
}