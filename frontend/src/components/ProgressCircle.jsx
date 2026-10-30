import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// pass in steps done and total steps. The circle fills to match.
// example: <ProgressCircle current={50} total={100} />
export default function ProgressCircle({ current = 0, total = 1 }) {
  return (
    <div className="relative w-40">
      <CircularProgressbar
        value={current}
        maxValue={total}
        strokeWidth={8}
        styles={buildStyles({
          pathColor: 'var(--color-forest)',
          trailColor: '#DCE7DC',
          strokeLinecap: 'butt',
        })}
      />

      {/* numbers layered in the centre of the circle */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold text-[var(--color-forest)]">{current}</span>
        <span className="text-sm text-[var(--color-forest)]">/{total}</span>
      </div>
    </div>
  );
}