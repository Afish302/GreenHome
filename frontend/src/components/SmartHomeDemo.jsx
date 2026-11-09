// Smart home demo: link Philips Hue and Octopus Energy from Settings.
// Usage graphs and suggestions live elsewhere in the app; this section only handles linking.
// It talks to household.html (public/demo/) over BroadcastChannel, same origin only.
// If VITE_SUPABASE_URL is set, it also syncs over Supabase Realtime (cross-device).
// Links are saved to smartDevice, and one estimated daily reading per session to electricityUsage.
import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/useAuth'

const HOUSEHOLD_URL = '/demo/household.html'
const roomW = r => Math.round(r.bulbs * 9 * r.v / 100)
const TYPE = { hue: 'hue', oct: 'octopus' } // smartDevice.DeviceType values

// Keeps Supabase in step with the simulated home's state messages.
// db: { id: Users.id, saved: { hue, oct } } once loaded, else null.
function syncToDb(m, db, send, wrote) {
  if (!db || !m) return
  const { id, saved } = db
  // Simulated home was reloaded and forgot links we have stored: re-link it.
  if ((saved.hue && !m.linked.hue) || (saved.oct && !m.linked.oct)) send({ type: 'restore', hue: saved.hue, oct: saved.oct })

  const power = { hue: m.rooms.reduce((s, r) => s + roomW(r), 0), oct: Math.round((m.meterKw ?? 0) * 1000) }
  for (const k of ['hue', 'oct']) {
    if (!m.linked[k] || saved[k]) continue
    saved[k] = true // set before the request so later messages don't insert again
    supabase.from('smartDevice')
      .upsert({ userID: id, DeviceType: TYPE[k], averagePower: power[k] }, { onConflict: 'userID,DeviceType', ignoreDuplicates: true })
      .then(({ error }) => { if (error) console.error(`Saving ${TYPE[k]} link failed:`, error) })
  }

  if (m.meterKw != null && !wrote.current) {
    wrote.current = true
    // ponytail: current kW x 24 as the day's kWh, last write of the day wins. Sum real readings for accuracy.
    supabase.from('electricityUsage')
      .upsert({ userID: id, date: new Date().toLocaleDateString('en-CA'), ElectricityUsage: Math.round(m.meterKw * 24) }, { onConflict: 'userID,date' })
      .then(({ error }) => { if (error) console.error('Saving meter reading failed:', error) })
  }
}

// Same protocol as link.js, so household.html needs no changes.
function connectDemo(onMessage, onStatus) {
  const me = Math.random().toString(36).slice(2), seen = new Set()
  const receive = m => {
    if (!m || m.from === me || seen.has(m.id)) return
    seen.add(m.id)
    onMessage(m)
  }
  let closed = false
  const report = mode => { if (!closed) onStatus(mode) }
  const bc = new BroadcastChannel('greenhome-demo')
  bc.onmessage = e => receive(e.data)
  queueMicrotask(() => report('local'))

  let ch = null, remote = null
  if (import.meta.env.VITE_SUPABASE_URL) {
    ch = supabase.channel('greenhome-demo')
    ch.on('broadcast', { event: 'msg' }, m => receive(m.payload))
    ch.subscribe(status => {
      remote = status === 'SUBSCRIBED' ? ch : null
      report(remote ? 'supabase' : 'local')
    })
  }
  return {
    send(msg) {
      if (closed) return
      const m = { ...msg, id: me + Math.random().toString(36).slice(2), from: me }
      bc.postMessage(m)
      if (remote) remote.send({ type: 'broadcast', event: 'msg', payload: m })
    },
    close() { closed = true; bc.close(); if (ch) supabase.removeChannel(ch) },
  }
}

export default function SmartHomeDemo() {
  const [home, setHome] = useState(null)
  const [mode, setMode] = useState('local')
  const [noHome, setNoHome] = useState(false)
  const [octPending, setOctPending] = useState(false)
  const [saved, setSaved] = useState({ hue: false, oct: false })
  const link = useRef(null), homeRef = useRef(null), dbRef = useRef(null), wrote = useRef(false)
  const send = msg => link.current?.send(msg)
  const { user } = useAuth()
  const authId = user?.id

  // Load this user's Users.id and saved links, then catch up on any state already received.
  useEffect(() => {
    if (!authId) return
    let cancelled = false
    ;(async () => {
      const { data: row, error } = await supabase.from('Users').select('id').eq('user_id', authId).maybeSingle()
      if (error || !row) return console.error('Smart home: no Users row for this login', error)
      const { data: devices, error: devErr } = await supabase.from('smartDevice').select('DeviceType').eq('userID', row.id)
      if (devErr) return console.error('Smart home: loading devices failed', devErr)
      if (cancelled) return
      const types = new Set(devices.map(d => d.DeviceType))
      const s = { hue: types.has(TYPE.hue), oct: types.has(TYPE.oct) }
      dbRef.current = { id: row.id, saved: { ...s } }
      setSaved(s)
      syncToDb(homeRef.current, dbRef.current, send, wrote)
    })()
    return () => { cancelled = true; dbRef.current = null }
  }, [authId])

  useEffect(() => {
    const onMessage = m => {
      if (m.type !== 'state') return
      if (m.linked.oct) setOctPending(false)
      homeRef.current = m
      setHome(m)
      syncToDb(m, dbRef.current, send, wrote)
    }
    link.current = connectDemo(onMessage, md => { setMode(md); link.current?.send({ type: 'hello' }) })
    const hello = setInterval(() => { if (!homeRef.current) link.current.send({ type: 'hello' }) }, 1500)
    const lost = setTimeout(() => { if (!homeRef.current) setNoHome(true) }, 2500)
    return () => { clearInterval(hello); clearTimeout(lost); link.current.close(); link.current = null }
  }, [])

  const h = home || { linked: {}, rooms: [] }
  const hue = h.linked.hue || saved.hue ? 'on' : h.pairing ? 'wait' : 'off'
  const oct = h.linked.oct || saved.oct ? 'on' : octPending ? 'wait' : 'off'
  const w = h.rooms.reduce((s, r) => s + roomW(r), 0)

  return (
    <section className="gh-smart">
      <style>{CSS}</style>
      <div className="top">
        <span className="font-bold">Smart Home (demo)</span>
        <span className={`conn ${home ? 'ok' : ''}`} title={mode === 'supabase' ? 'Synced over Supabase Realtime' : 'Synced in this browser'}>
          {home ? 'Home connected' : 'Looking for your home'}
        </span>
      </div>

      <div className="stack">
        {noHome && !home && (
          <div className="card nohome">
            <p><b>No home found.</b></p>
            <p className="small">Open the <a href={HOUSEHOLD_URL} target="_blank" rel="noreferrer">simulated home</a> in another tab of this browser.</p>
          </div>
        )}

        <div className="card src" data-state={hue}>
          <div className="head">
            <span className="tile"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg></span>
            <div><h3>Philips Hue</h3><p className="st">{{ on: 'Linked', wait: 'Waiting for your bridge', off: 'Not linked' }[hue]}</p></div>
          </div>
          {hue === 'off' && (
            <div className="view">
              <p>See how much power your lights are using.</p>
              <button className="btn" disabled={!home} onClick={() => send({ type: 'pair' })}>Link Hue Bridge</button>
            </div>
          )}
          {hue === 'wait' && <div className="view"><p className="wait">Press the button on your Hue Bridge to finish linking.</p></div>}
          {hue === 'on' && home && <div className="view"><p className="reading"><b>{w} W</b>on lighting now</p></div>}
        </div>

        <div className="card src" data-state={oct}>
          <div className="head">
            <span className="tile"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" /></svg></span>
            <div><h3>Octopus Energy</h3><p className="st">{{ on: 'Linked', wait: 'Connecting', off: 'Not linked' }[oct]}</p></div>
          </div>
          {oct === 'off' && (
            <div className="view">
              <p>Share your smart meter readings and electricity prices with GreenHome.</p>
              <div className="fields">
                <label>Account number<input defaultValue="A-3F7C21D9" spellCheck="false" /></label>
                <label>API key<input defaultValue="sk_live_••••••3Kq" spellCheck="false" /></label>
              </div>
              <button className="btn" disabled={!home} onClick={() => { setOctPending(true); send({ type: 'link-octopus' }) }}>Link account</button>
            </div>
          )}
          {oct === 'wait' && <div className="view"><p className="wait">Connecting to Octopus…</p></div>}
          {oct === 'on' && h.meterKw != null && <div className="view"><p className="reading"><b>{h.meterKw.toFixed(2)} kW</b>whole home now</p></div>}
        </div>

        <p className="foot">
          Simulated data. No real devices or accounts are connected.{' '}
          <a href={HOUSEHOLD_URL} target="_blank" rel="noreferrer">Open the simulated home</a>
        </p>
      </div>
    </section>
  )
}

// Scoped under .gh-smart so these styles don't leak into the rest of the app.
const CSS = `
.gh-smart{
  --forest:#2E7D32; --forest-dark:#1b5e20; --mint:#81C784; --mint-light:#e8f5e9;
  --cream:#F8F9FA; --charcoal:#1A1A1A; --muted:#4a4a4a; --soft:#6B7280; --line:#E8ECEF;
  font-variant-numeric:tabular-nums;
}
.gh-smart button,.gh-smart input{font:inherit}
.gh-smart a{color:var(--forest);font-weight:600;text-decoration:underline}
.gh-smart :focus-visible{outline:2px solid var(--forest);outline-offset:2px}
.gh-smart .top{display:flex;justify-content:space-between;align-items:center;gap:12px}
.gh-smart .conn{display:flex;align-items:center;gap:6px;font-size:13px;color:var(--soft)}
.gh-smart .conn::before{content:"";width:8px;height:8px;border-radius:50%;background:#C3CAD0}
.gh-smart .conn.ok{color:var(--forest)}
.gh-smart .conn.ok::before{background:var(--forest)}
.gh-smart .stack{display:flex;flex-direction:column;gap:12px}
.gh-smart .card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:16px}
.gh-smart .src .head{display:flex;align-items:center;gap:12px}
.gh-smart .tile{display:grid;place-items:center;width:44px;height:44px;flex:none;border-radius:12px;background:var(--mint-light);color:var(--forest)}
.gh-smart .tile svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.gh-smart .src h3{margin:0;font-size:16px;font-weight:700}
.gh-smart .st{margin:0;font-size:13px;color:var(--soft)}
.gh-smart .src[data-state=on] .st{color:var(--forest);font-weight:600}
.gh-smart .view{margin-top:12px}
.gh-smart .view > p{margin:0 0 12px;color:var(--muted)}
.gh-smart .wait{display:flex;align-items:center;gap:10px;color:var(--charcoal)!important}
.gh-smart .wait::before{content:"";width:16px;height:16px;flex:none;border-radius:50%;border:2px solid var(--mint);border-top-color:var(--forest);animation:gh-spin .8s linear infinite}
@keyframes gh-spin{to{transform:rotate(360deg)}}
.gh-smart .btn{display:block;width:100%;padding:12px 16px;border:0;border-radius:12px;background:var(--forest);color:#fff;font-weight:700;cursor:pointer}
.gh-smart .btn:hover{background:var(--forest-dark)}
.gh-smart .btn:disabled{background:#A7B3AA;cursor:not-allowed}
.gh-smart .fields{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}
.gh-smart .fields label{min-width:0;display:flex;flex-direction:column;gap:4px;font-size:12px;color:var(--soft)}
.gh-smart .fields input{min-width:0;padding:9px 10px;border:1px solid var(--line);border-radius:10px;background:var(--cream);font-size:14px;color:var(--charcoal)}
.gh-smart .reading{margin:0!important;color:var(--soft)!important}
.gh-smart .reading b{font-size:28px;font-weight:800;letter-spacing:-.02em;color:var(--charcoal);margin-right:4px}
.gh-smart .small{margin:0;font-size:13px;color:var(--soft)}
.gh-smart .foot{margin:0;font-size:12px;color:var(--soft);text-align:center}
.gh-smart .nohome p{margin:0 0 4px}
@media (prefers-reduced-motion:reduce){.gh-smart *{animation:none!important}}
`
