import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

// example: <RangeSlider label="Label" value={0} min={0} max={100} type="Type" onClick={setValue} />
export default function RangeSlider({ label = 'TEXT HERE!', value = 0, min = 0, max = 100, type = 'Value Type here!', onClick }) {
  return (

    <div className="flex flex-col gap-2 p-4 bg-white border border-slate-100 rounded-2xl">

      {/* label and current value */}
      <div className="flex text-sm">
        <span className="mr-auto text-[var(--color-charcoal)]">{label}</span>
        <span className="ml-auto font-bold text-[var(--color-forest)]">{value} {type}</span>
      </div>

      {/* slider */}
      <Slider
        min={min}
        max={max}
        value={value}
        onChange={onClick}
        styles={{
          track: { backgroundColor: 'var(--color-forest)', height: 6 },
          rail: { backgroundColor: '#DCE7DC', height: 6 },
          handle: { backgroundColor: 'white', borderColor: 'var(--color-forest)', borderWidth: 3, width: 20, height: 20, marginTop: -7, opacity: 1, boxShadow: 'none' },
        }}
      />

      {/* subtext */}
      <div className="flex text-xs text-[var(--color-charcoal-muted)]">
        <span className="mr-auto">{min} {type}</span>
        <span className="ml-auto">{max} {type}</span>
      </div>

    </div>
  );
}