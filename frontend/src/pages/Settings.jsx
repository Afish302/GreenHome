import { useState } from 'react'
import OptionCard from '../components/OptionCard'
import { BusFront, Sprout, HousePlug, ChevronRight, Ruler, LogOut } from 'lucide-react'
import Button from '../components/button'
import SmartHomeDemo from '../components/SmartHomeDemo'

export default function Settings() {
  const [units, updateUnits] = useState('metric')

  return (
    <main className="w-full flex flex-col gap-6 max-w-[750px] mx-auto">
      {/* Lifestyle Baseline & Footprint */}
      <section className="space-y-3">
        <span className="font-bold">Lifestyle Baseline & Footprint</span>

        {/* Onboarding Buttons */}
        <div className="flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <Button
            variant="text"
            navigate="/onboardCommute"
            onClick={() => window.scrollTo(0, 0)}
            className="!w-full !px-4 !py-3 !text-left flex items-center gap-3 border-b border-slate-100"
          >
            <BusFront className="text-[var(--color-forest)]" size={20} />
            <div className="flex flex-col mr-auto">
              <span className="font-semibold text-[var(--color-charcoal)]">Commutes</span>
            </div>
            <ChevronRight color="#657065" size={20} />
          </Button>

          <Button
            variant="text"
            navigate="/onboardFood"
            onClick={() => window.scrollTo(0, 0)}
            className="!w-full !px-4 !py-3 !text-left flex items-center gap-3 border-b border-slate-100"
          >
            <Sprout className="text-[var(--color-forest)]" size={20} />
            <div className="flex flex-col mr-auto">
              <span className="font-semibold text-[var(--color-charcoal)]">Food Habits</span>
            </div>
            <ChevronRight color="#657065" size={20} />
          </Button>

          <Button
            variant="text"
            navigate="/onboardHouse"
            onClick={() => window.scrollTo(0, 0)}
            className="!w-full !px-4 !py-3 !text-left flex items-center gap-3"
          >
            <HousePlug className="text-[var(--color-forest)]" size={20} />
            <div className="flex flex-col mr-auto">
              <span className="font-semibold text-[var(--color-charcoal)]">Household & Energy</span>
            </div>
            <ChevronRight color="#657065" size={20} />
          </Button>
        </div>
      </section>

      {/* App Preferences */}
      <section className="space-y-3">
        <span className="font-bold">App Preferences</span>
        <div className="flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="w-full px-4 py-3 flex items-center gap-3">
            <Ruler className="text-[var(--color-forest)]" size={20} />
            <span className="font-semibold text-[var(--color-charcoal)]">Units</span>
            <div className="grid grid-cols-2 gap-2 flex-1 ml-auto">
              <OptionCard
                label="Metric (kg CO2, kWh)"
                className="!py-2"
                selected={units === 'metric'}
                onClick={() => updateUnits('metric')}
              />
              <OptionCard
                label="Imperial"
                className="!py-2"
                selected={units === 'imperial'}
                onClick={() => updateUnits('imperial')}
              />
            </div>
          </div>
        </div>
      </section>

      <SmartHomeDemo />

      <Button variant="red" className="flex items-center justify-center gap-2" navigate="/">
        <LogOut size={20} />
        Log out
      </Button>
    </main>
  )
}