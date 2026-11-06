import { useState } from 'react'
import ProgressBar from '../components/ProgressBar'
import OptionCard from '../components/OptionCard'
import { BusFront, CarFront, Fuel, Bike, Sprout, HousePlug, Zap, FileUp, ScanLine, Leaf, ArrowLeft } from 'lucide-react'
import RangeSlider from '../components/RangeSlider'
import NumberStepper from '../components/NumberStepper'
import Button from '../components/button'
import IconButton from '../components/IconButton'

export default function CommuteAnswers() {
  const [commute, updateCommute] = useState(null)
  const [distance, updateDistance] = useState(0)
  const [diet, updateDiet] = useState(null)
  const [number, updateNumber] = useState(0)
  const electricityUsage = 0
  const estimatedFootprint = 0

  return (
    <div>
    <div className="w-full max-w-[1000px] mx-auto">
    <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-charcoal)] flex flex-col items-center justify-between p-4 sm:p-6 md:p-10 lg:p-12 font-sans antialiased">
      
      {/* Top of page */}
      <main className="w-full flex-1 flex flex-col items-stretch text-left gap-6 max-w-[1000px]">
        <div className="flex items-center gap-2">
          <IconButton navigate="/dashboard"><ArrowLeft className="w-6 h-6" /></IconButton>
          <h1 className="text-2xl font-bold mr-auto">Lifestyle Baseline</h1>
          <Button variant="text" navigate="/onboardFood">Skip for now</Button>
        </div>
        
        <ProgressBar current={1} total={3} labelText="Step 1 of 3: Daily Habits" />

        {/* Daily Commute */}
        <section className="flex flex-col gap-y-4">
          <div className="flex items-center gap-2 mb-3">
            <BusFront className="text-[var(--color-forest-dark)]" size={24} />
            <span className="font-bold">Daily Commute</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <OptionCard icon={<BusFront size={20} />} label="Public Transport" selected={commute == "public"} onClick={function () { updateCommute("public") }} />
            <OptionCard icon={<CarFront size={20} />} label="Electric Vehicle" selected={commute == "electric"} onClick={function () { updateCommute("electric") }} />
            <OptionCard icon={<Fuel size={20} />} label="Petrol Car" selected={commute == "petrol"} onClick={function () { updateCommute("petrol") }} />
            <OptionCard icon={<Bike size={20} />} label="Bicycle/Walking" selected={commute == "bike"} onClick={function () { updateCommute("bike") }} />
          </div>

          <div>
            <RangeSlider label="Average daily travel: " value={distance} min={0} max={50} type="km" onClick={updateDistance} />
          </div>
        </section>

        {/* Dietary Pattern */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Sprout className="text-[var(--color-forest-dark)]" size={24} />
            <span className="font-bold">Dietary Pattern</span>
          </div>
          <div className="grid grid-cols-2 gap-3 [&>button]:relative [&_span]:!mx-auto [&_svg]:absolute [&_svg]:right-4 [&_svg]:top-1/2 [&_svg]:-translate-y-1/2">
            <OptionCard label="Plant-Based / Vegan" className="!py-2 !rounded-3xl" selected={diet == 'vegan'} onClick={function () { updateDiet('vegan') }} />
            <OptionCard label="Vegetarian" className="!py-2 !rounded-3xl" selected={diet == 'vegetarian'} onClick={function () { updateDiet('vegetarian') }} />
            <OptionCard label="Flexitarian" className="!py-2 !rounded-3xl" selected={diet == 'flexitarian'} onClick={function () { updateDiet('flexitarian') }} />
            <OptionCard label="Meat-Heavy" className="!py-2 !rounded-3xl" selected={diet == 'meat'} onClick={function () { updateDiet('meat') }} />
          </div>
        </section>

        {/* Household and Energy */}
        <section className="flex flex-col gap-y-3">
          <div className="flex items-center gap-2 mb-3">
            <HousePlug className="text-[var(--color-forest-dark)]" size={24} />
            <span className="font-bold">Household & Energy</span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span>Number of occupants</span>
            <NumberStepper value={number} onClick={updateNumber} />
          </div>

          <div className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-2xl">
            <Zap className="text-[var(--color-forest)]" size={24} />
            <span className="text-2xl font-bold text-[var(--color-charcoal)]">{electricityUsage}</span>
            <span className="ml-auto text-[var(--color-charcoal-muted)]">kWh</span>
          </div>

          <div className="flex items-center rounded-2xl bg-[#EAF4E9] overflow-hidden">
            <Button variant="secondary" className="!w-auto flex-1 !px-4 !py-3 !shadow-none !rounded-none flex items-center gap-3">
              <FileUp size={24} />
              Upload utility bill
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
        <Button navigate="/onboardFood" onClick={function () { window.scrollTo(0, 0) }} className="!w-full !rounded-full">Save & Calculate Footprint</Button>
        </div>
      </div>
    </section>
    </div>
  );
}
