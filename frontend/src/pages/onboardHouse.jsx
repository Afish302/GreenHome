import { useState } from 'react'
import ProgressBar from '../components/ProgressBar'
import OptionCard from '../components/OptionCard'
import { BusFront, CarFront, Fuel, Bike, Sprout, HousePlug, Zap, FileUp, ScanLine, Leaf, ArrowLeft, Recycle, Carrot, Salad, Utensils } from 'lucide-react'
import RangeSlider from '../components/RangeSlider'
import NumberStepper from '../components/NumberStepper'
import Button from '../components/button'
import IconButton from '../components/IconButton'

export default function OnboardHouse() {
  const [pattern, updatePattern] = useState(null)
  const [diet, updateDiet] = useState(null)
  const estimatedFootprint = 0
  const [home, updateHome] = useState(null)
  const [number, updateNumber] = useState(0)
  const [electricity, updateElectricity] = useState(100)

  return (
    <div>
    <div className="w-full max-w-[750px] mx-auto">
    <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-charcoal)] flex flex-col items-center justify-between p-4 sm:p-6 md:p-10 lg:p-12 font-sans antialiased">
      
      {/* Top of page */}
      <main className="w-full flex-1 flex flex-col items-stretch text-left gap-6 max-w-[1000px]">
        <div className="flex items-center gap-2">
          <IconButton navigate="/onboardFood"><ArrowLeft className="w-6 h-6" /></IconButton>
          <h1 className="text-2xl font-bold mr-auto">Carbon Baseline</h1>
          <Button variant="text" navigate="/dashboard">Skip for now</Button>
        </div>
        
        <ProgressBar current={3} total={3} labelText="Step 3 of 3: Household Energy" />

        {/* Household Details */}
        <section className="flex flex-col gap-y-4">
          <div className="flex items-center gap-2 mb-3">
            <HousePlug className="text-[var(--color-forest-dark)]" size={24} />
            <span className="font-bold">Household Details</span>
          </div>
          <p className="text-sm font-normal text-[#657065] -mt-4">Tell us about your living space</p>

          <div className="flex items-center gap-2 mb-3">
            <span>Number of occupants</span>
            <NumberStepper value={number} onClick={updateNumber} />
          </div>

          <p className="text-sm font-normal text-[#657065]">Home type</p>
          <div className="grid grid-cols-3 gap-3 [&>button]:relative [&_span]:!mx-auto [&_svg]:absolute [&_svg]:right-4 [&_svg]:top-1/2 [&_svg]:-translate-y-1/2">
            <OptionCard label="Apartment" className="!py-2 !rounded-3xl" selected={home == 'apartment'} onClick={function () { updateHome('apartment') }} />
            <OptionCard label="Single-Family House" className="!py-2 !rounded-3xl" selected={home == 'single-family'} onClick={function () { updateHome('single-family') }} />
            <OptionCard label="Shared Housing" className="!py-2 !rounded-3xl" selected={home == 'shared'} onClick={function () { updateHome('shared') }} />
          </div>
        </section>

        {/* Energy and Utility Inputs */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="text-[var(--color-forest-dark)]" size={24} />
            <span className="font-bold">Energy & Utility Inputs</span>
          </div>
          <p className="text-sm font-normal text-[#657065] mb-3">Average quarterly energy usage:</p>

          <div>
            <RangeSlider label="Electricity: " value={electricity} min={100} max={1500} type="kWh / 3 months" onClick={updateElectricity} />
          </div>

          <label className="flex items-center gap-2 mt-3 text-sm font-normal text-[#657065] cursor-pointer">
            <input type="checkbox" className="w-5 h-5" />
            My home uses green energy / solar power
          </label>

          <div className="flex items-center rounded-2xl bg-[#EAF4E9] overflow-hidden mt-3">
            <Button variant="secondary" className="!w-auto flex-1 !px-4 !py-3 !shadow-none !rounded-none flex items-center gap-3">
              <FileUp size={24} />
              Upload utility bill (optional)
            </Button>
            <div className="w-px h-8 bg-[#81C784]"></div>
            <Button variant="secondary" className="!w-auto !px-4 !py-3 !shadow-none !rounded-none flex items-center gap-3">
              <ScanLine size={24} />
              Scan
            </Button>
          </div>
        </section>
      </main>
    </div>
    </div>

    {/* Bottom of page */}
    <section className="w-full">
      <div className="w-full min-h-[14vh] bg-white shadow-md flex flex-col gap-3 px-8 py-4">
        <div className="w-full max-w-[904px] mx-auto flex flex-col gap-3">
        <div className="flex items-center justify-center gap-2 py-2 rounded-full bg-[#EAF4E9] text-sm text-[var(--color-charcoal)]">
          <Leaf className="text-[var(--color-forest)]" size={20} />
          <span>Estimated Footprint: <span className="font-semibold text-[var(--color-forest)]">{estimatedFootprint} t CO₂e/yr</span></span>
        </div>
        <Button navigate="/dashboard" onClick={function () { window.scrollTo(0, 0) }} className="!w-full !rounded-full">Complete Setup & Go to Dashboard (3/3)</Button>
        </div>
      </div>
    </section>
    </div>
  );
}