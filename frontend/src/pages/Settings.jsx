import { useState } from 'react'
import ProgressBar from '../components/ProgressBar'
import OptionCard from '../components/OptionCard'
import { BusFront, Sprout, HousePlug, ChevronRight, Link, Ruler, Users, FileDown, Download, LogOut} from 'lucide-react'
import RangeSlider from '../components/RangeSlider'
import NumberStepper from '../components/NumberStepper'
import Button from '../components/button'
import IconButton from '../components/IconButton'

export default function Settings() {
  const [units, updateUnits] = useState('metric')

  return (
    <main className="w-full flex flex-col gap-6 max-w-[750px] mx-auto">
        <Button variant="text" navigate="/dashboard" className="ml-auto">Skip for now</Button>

      {/* Lifestyle Baseline & Footprint */}
      <section >
        <span className="font-bold">Lifestyle Baseline & Footprint</span>

         {/* Carbon Baseline Setup*/}
        <div className="bg-[#E8F5E9]/60 p-5 rounded-3xl border border-emerald-100 flex items-center gap-5">
          <div className="space-y-1 w-full">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-gray-900 leading-tight">
                Carbon Baseline Setup
              </h3>
              <IconButton navigate="/onboardCommute" onClick={function () { window.scrollTo(0, 0) }}>
                <ChevronRight color="#657065" size={20} />
              </IconButton>
            </div>
            <ProgressBar current={0} total={3} labelText="0% Completed" />
          </div>
        </div>

         {/* Onboarding Buttons */}
        <div className="flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <Button variant="text" navigate="/onboardCommute" onClick={function () { window.scrollTo(0, 0) }} className="!w-full !px-4 !py-3 !text-left flex items-center gap-3 border-b border-slate-100">
            <BusFront className="text-[var(--color-forest)]" size={20} />
            <div className="flex flex-col mr-auto">
              <span className="font-semibold text-[var(--color-charcoal)]">Commutes</span>
            </div>
            <ChevronRight color="#657065" size={20} />
          </Button>

          <Button variant="text" navigate="/onboardFood" onClick={function () { window.scrollTo(0, 0) }} className="!w-full !px-4 !py-3 !text-left flex items-center gap-3 border-b border-slate-100">
            <Sprout className="text-[var(--color-forest)]" size={20} />
            <div className="flex flex-col mr-auto">
              <span className="font-semibold text-[var(--color-charcoal)]">Food Habits</span>
            </div>
            <ChevronRight color="#657065" size={20} />
          </Button>

          <Button variant="text" navigate="/onboardHouse" onClick={function () { window.scrollTo(0, 0) }} className="!w-full !px-4 !py-3 !text-left flex items-center gap-3">
            <HousePlug className="text-[var(--color-forest)]" size={20} />
            <div className="flex flex-col mr-auto">
              <span className="font-semibold text-[var(--color-charcoal)]">Household & Energy</span>
            </div>
            <ChevronRight color="#657065" size={20} />
          </Button>
        </div>
      </section>

       {/* App Preferences and Integrations */}
      <section>
        <span className="font-bold">App Preferences & Integrations</span>
        <div className="flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <Button variant="text" className="!w-full !px-4 !py-3 !text-left flex items-center gap-3 border-b border-slate-100">
            <Link className="text-[var(--color-forest)]" size={20} />
            <div className="flex flex-col mr-auto">
              <span className="font-semibold text-[var(--color-charcoal)]">Connected Devices</span>
            </div>
            <ChevronRight color="#657065" size={20} />
          </Button>

          <div className="w-full px-4 py-3 flex items-center gap-3 border-b border-slate-100">
            <Ruler className="text-[var(--color-forest)]" size={20} />
            <span className="font-semibold text-[var(--color-charcoal)]">Units</span>
            <div className="grid grid-cols-2 gap-2 flex-1 ml-auto">
              <OptionCard label="Metric (kg CO2, kWh)" className="!py-2" selected={units == 'metric'} onClick={function () { updateUnits('metric') }} />
              <OptionCard label="Imperial" className="!py-2" selected={units == 'imperial'} onClick={function () { updateUnits('imperial') }} />
            </div>
          </div>

          <label className="w-full px-4 py-3 flex items-center gap-3 border-b border-slate-100 cursor-pointer">
            <Sprout className="text-[var(--color-forest)]" size={20} />
            <div className="flex flex-col mr-auto">
              <span className="font-semibold text-[var(--color-charcoal)]">Daily Activity Reminders</span>
            </div>
            <input type="checkbox" className="w-5 h-5" />
          </label>

          <label className="w-full px-4 py-3 flex items-center gap-3 cursor-pointer">
            <HousePlug className="text-[var(--color-forest)]" size={20} />
            <div className="flex flex-col mr-auto">
              <span className="font-semibold text-[var(--color-charcoal)]">Leaderboard Alerts</span>
            </div>
            <input type="checkbox" className="w-5 h-5" />
          </label>
        </div>
      </section>


       {/* Privacy and Account */}
      <section>
        <span className="font-bold">Privacy & Account</span>
        <div className="flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <label className="w-full px-4 py-3 flex items-center gap-3 border-b border-slate-100 cursor-pointer">
            <Users className="text-[var(--color-forest)]" size={20} />
            <div className="flex flex-col mr-auto">
              <span className="font-semibold text-[var(--color-charcoal)]">Public Profile</span>
            </div>
            <input type="checkbox" className="w-5 h-5" />
          </label>


          <Button variant="text" className="!w-full !px-4 !py-3 !text-left flex items-center gap-3">
            <FileDown className="text-[var(--color-forest)]" size={20} />
            <div className="flex flex-col mr-auto">
              <span className="font-semibold text-[var(--color-charcoal)]">Export Data</span>
            </div>
            <Download color="#657065" size={20} />
          </Button>
        </div>
      </section>
      <Button variant="red" className="flex items-center justify-center gap-2" navigate="/">
        <LogOut size={20} />
        Log out
      </Button>

    </main>
  );
}