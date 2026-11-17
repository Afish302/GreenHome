import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/useAuth'
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
  const [myID, updateMyID] = useState(null)
  const electricityUsage = 0
  const estimatedFootprint = 0

  const { user } = useAuth()

  // loads the users saved answers
  useEffect(function () {
    // stops if nobody is logged in
    if (user == null) {
      return
    }

    // gets the logged in user ID from the Users table
    supabase
      .from('Users')
      .select('id')
      .eq('email', user.email)
      .single()
      .then(function (result) {
        // stops if the user was not found
        if (result.data == null) {
          return
        }

        const input_user_id = result.data.id
        updateMyID(input_user_id)

        // gets the users saved answers
        supabase
          .from('onboarding')
          .select('daily_commute, avg_daily_travel, occupants')
          .eq('id', input_user_id)
          .single()
          .then(function (result) {
            // stops if the user has no saved answers yet
            if (result.data == null) {
              return
            }

            updateCommute(result.data.daily_commute)
            updateDistance(result.data.avg_daily_travel)
            updateNumber(result.data.occupants)
          })
      })
  }, [user])

  // saves the users answers
  function saveAnswers() {
    supabase
      .from('onboarding')
      .upsert({
        id: myID,
        daily_commute: commute,
        avg_daily_travel: distance,
        occupants: number
      })
      .then(function (result) {
        console.log(result)
      })
  }

  return (
    <div>
    <div className="w-full max-w-[750px] mx-auto">
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
        <Button navigate="/onboardFood" onClick={function () { saveAnswers(); window.scrollTo(0, 0) }} className="!w-full !rounded-full">Save & Calculate Footprint</Button>
        </div>
      </div>
    </section>
    </div>
  );
}
