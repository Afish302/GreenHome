import Header from '../components/header'
import Footer from '../components/footer'
import { Leaf } from 'lucide-react';

export default function RecyclingScanner() {
  return (
    <div className="flex min-h-full w-full flex-col bg-surface font-sans">
      {/* Header */}
      <Header/>
      {/* Body */}
      <main className="flex min-h-[616px] flex-col gap-5 p-5">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-[28px] font-semibold leading-[34px] text-ink">Recycle it right.</h2>
          <p className="text-sm text-muted">
            Add a photo to identify the material and learn how to recycle your item.
          </p>
        </div>

        {/* Upload card */}
        <div className="flex h-[228px] flex-col items-center justify-center gap-2.5 rounded-[18px] bg-white p-5 outline outline-[1.3px] -outline-offset-[1.3px] outline-line-strong">
          <div className="flex size-[52px] items-center justify-center rounded-full bg-primary-soft">
            <span className="size-[19px] outline outline-[1.7px] outline-primary" /> {/* icon */}
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-base font-semibold leading-5 text-ink">Upload an item photo</p>
            <p className="text-[13px] leading-[18px] text-muted">One item. One step toward less waste.</p>
          </div>
          <label className="flex h-10 cursor-pointer items-center justify-center gap-[7px] rounded-full bg-primary px-6 text-[13px] font-semibold text-white">
            <span className="size-[9px] outline outline-[1.7px] outline-white" /> {/* icon */}
            Choose Photo
            <input type="file" accept="image/jpeg,image/png,image/heic" className="hidden" />
          </label>
          <p className="text-[11px] leading-4 text-muted">JPG, PNG or HEIC · Up to 10 MB</p>
        </div>

        {/* Divider + camera */}
        <div className="flex flex-col gap-3">
          <div className="flex h-[18px] items-center gap-3">
            <span className="h-px flex-1 bg-line" />
            <span className="text-xs text-muted">or</span>
            <span className="h-px flex-1 bg-line" />
          </div>
          <button className="flex h-12 items-center justify-center gap-[9px] rounded-full text-white bg-[var(--color-forest)] hover:bg-[var(--color-forest-dark)] text-sm font-semibold text-primary outline outline-1 -outline-offset-1 outline-line">
            <span className="h-[15.5px] w-5 border-[1.6px] border-primary" /> <Leaf/>
            Take a Photo
          </button>
        </div>

        {/* Tips */}
        <div className="flex flex-col gap-2 rounded-[18px] bg-white p-4">
          <p className="text-sm font-semibold text-ink">For a better scan</p>
          {[
            "Use good lighting and avoid glare.",
            "Keep one item in focus and fully visible.",
            "Show any labels or recycling symbols.",
          ].map((tip) => (
            <div key={tip} className="flex items-center gap-2.5">
              <span className="size-3 shrink-0 outline outline-[1.7px] outline-primary" /> {/* icon */}
              <p className="flex-1 text-xs leading-[18px] text-muted">{tip}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer action */}
      <Footer/>
    </div>
  );
}
