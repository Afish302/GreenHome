import { useState } from 'react'
import ProgressBar from '../components/ProgressBar'
import OptionCard from '../components/OptionCard'
import { BusFront, CarFront, Fuel, Bike, Sprout, HousePlug, Zap, FileUp, ScanLine, Leaf, ArrowLeft, Recycle, Carrot, Salad, Utensils } from 'lucide-react'
import RangeSlider from '../components/RangeSlider'
import NumberStepper from '../components/NumberStepper'
import Button from '../components/button'
import IconButton from '../components/IconButton'

export default function OnboardFood() {
  const [pattern, updatePattern] = useState(null)
  const [diet, updateDiet] = useState(null)
  const estimatedFootprint = 0
  const [waste, updateWaste] = useState(null)

  return (
    <div>
    <div className="w-full max-w-[1000px] mx-auto">
    <div className="min-h-screen bg-[var(--color-cream)] text-[var(--color-charcoal)] flex flex-col items-center justify-between p-4 sm:p-6 md:p-10 lg:p-12 font-sans antialiased">
      
      {/* Top of page */}
      <main className="w-full flex-1 flex flex-col items-stretch text-left gap-6 max-w-[1000px]">
        <div className="flex items-center gap-2">
          <IconButton label="Back" navigate="/onboardCommute"><ArrowLeft className="w-6 h-6" /></IconButton>
          <h1 className="text-2xl font-bold mr-auto">Carbon Baseline</h1>
          <Button variant="text" navigate="/onboardHouse">Skip for now</Button>
        </div>
        
        <ProgressBar current={2} total={3} labelText="Step 2 of 3: Food & Diet" />

        {/* Dietary Pattern */}
        <section className="flex flex-col gap-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Sprout className="text-[var(--color-forest-dark)]" size={24} />
            <span className="font-bold">Dietary Pattern</span>
          </div>
          <p className="text-sm font-normal text-[#657065] -mt-4">What describes your primary diet?</p>

          <div className="grid grid-cols-1 gap-3">
            <OptionCard icon={<Leaf size={20} />} label="Plant-Based / Vegan" selected={diet == "plant-based"} onClick={function () { updateDiet("plant-based") }} />
            <OptionCard icon={<Carrot size={20} />} label="Vegetarian" selected={diet == "vegetarian"} onClick={function () { updateDiet("vegetarian") }} />
            <OptionCard icon={<Salad size={20} />} label="Flexitarian" selected={diet == "flexitarian"} onClick={function () { updateDiet("flexitarian") }} />
            <OptionCard icon={<Utensils size={20} />} label="Meat-Heavy / Standard" selected={diet == "meat-heavy"} onClick={function () { updateDiet("meat-heavy") }} />
          </div>
        </section>

        {/* Food Waste and Shopping Habits */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Recycle className="text-[var(--color-forest-dark)]" size={24} />
            <span className="font-bold">Food Waste & Shopping Habits</span>
          </div>
          <p className="text-sm font-normal text-[#657065] mb-3">How often do you compost or minimise food waste?</p>
          <div className="grid grid-cols-3 gap-3 [&>button]:relative [&_span]:!mx-auto [&_svg]:absolute [&_svg]:right-4 [&_svg]:top-1/2 [&_svg]:-translate-y-1/2">
            <OptionCard label="Always" className="!py-2 !rounded-3xl" selected={waste == 'always'} onClick={function () { updateWaste('always') }} />
            <OptionCard label="Occasionally" className="!py-2 !rounded-3xl" selected={waste == 'occasionally'} onClick={function () { updateWaste('occasionally') }} />
            <OptionCard label="Rarely" className="!py-2 !rounded-3xl" selected={waste == 'rarely'} onClick={function () { updateWaste('rarely') }} />
          </div>
          <label className="flex items-center gap-2 mt-3 text-sm font-normal text-[#657065] cursor-pointer">
            <input type="checkbox" className="w-5 h-5" />
            I prioritise locally sourced or organic groceries
          </label>
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
        <Button navigate="/onboardHouse" className="!w-full !rounded-full">Continue to Household (2/3)</Button>
        </div>
      </div>
    </section>
    </div>
  );
}