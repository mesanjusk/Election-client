import { useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LabelList, Legend
} from 'recharts'

function Stat({ label, value, sub }) {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow p-3 sm:p-4">
      <div className="text-slate-500 text-xs sm:text-sm">{label}</div>
      <div className="text-lg sm:text-2xl font-semibold leading-tight">{value}</div>
      {sub && <div className="text-[10px] sm:text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  )
}

function Donut({ percent = 0, label = 'Donors Reached' }) {
  const deg = Math.round((percent / 100) * 360)
  return (
    <div className="relative w-24 h-24 sm:w-32 sm:h-32">
      <div className="absolute inset-0 rounded-full bg-slate-200" />
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: `conic-gradient(#2563eb ${deg}deg, #f1f5f9 0deg)` }}
      />
      <div className="absolute inset-2 rounded-full bg-white grid place-items-center">
        <div className="text-center px-2">
          <div className="text-base sm:text-xl font-semibold">{percent}%</div>
          <div className="text-[9px] sm:text-[10px] text-slate-500 leading-tight">{label}</div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [voters, setVoters] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/api/voters', { params: { limit: 10000 } })
        setVoters(data.results)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const metrics = useMemo(() => {
    const total = voters.length
    const male = voters.filter(v => (v['Gender'] || '').includes('पुरुष')).length
    const female = voters.filter(v => (v['Gender'] || '').includes('महिला')).length
    const unknown = total - male - female
    const donorsReached = Math.min(100, Math.round(total ? (female / total) * 100 : 0)) // demo
    return { total, male, female, unknown, donorsReached }
  }, [voters])

  // 7-party demo data (values in hundreds)
  const demoPartyData = [
    { party: 'BJP', value: 320 },
    { party: 'INC', value: 260 },
    { party: 'AAP', value: 190 },
    { party: 'NCP', value: 140 },
    { party: 'SP', value: 110 },
    { party: 'BSP', value: 90 },
    { party: 'OTH', value: 70 },
  ]

  const handleMock = (type) => alert(`${type} mock test coming soon!`)

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="px-3 sm:px-4 py-3 bg-white shadow sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-base sm:text-lg font-semibold">Candidate Dashboard</h1>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-slate-500">
              Hello, {JSON.parse(localStorage.getItem('user') || '{}').name || 'User'}
            </span>
            <button
              className="text-[11px] sm:text-xs text-slate-600"
              onClick={() => { localStorage.clear(); location.href = '/login' }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-3 sm:p-4 space-y-4 sm:space-y-6">
        {/* Chart section */}
        <section className="bg-white rounded-xl sm:rounded-2xl shadow p-3 sm:p-4">
          <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
            Political Party Trends — India 2025
          </h2>

          {loading ? (
            <div className="h-56 sm:h-72 animate-pulse bg-slate-100 rounded-lg" />
          ) : (
            <div className="h-56 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={demoPartyData}
                  margin={{ top: 4, right: 6, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="party" />
                  <YAxis
                    domain={[0, 400]}
                    ticks={[0, 100, 200, 300, 400]}
                    tickFormatter={(v) => v}
                  />
                  <Tooltip formatter={(v) => [`${v}`, 'Voters (in hundreds)']} />
                  <Legend />
                  <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]}>
                    <LabelList dataKey="value" position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        {/* Mock Test cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <button
            onClick={() => handleMock('Booth Management')}
            className="bg-gradient-to-br from-brand-100 to-white border border-brand-200 rounded-xl sm:rounded-2xl shadow hover:shadow-md transition p-4 text-left"
          >
            <div className="text-2xl">🗳️</div>
            <div className="mt-2 font-semibold text-slate-800 text-sm sm:text-base">
              Booth Management Mock Test
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Queue, roll list & turnout scenarios
            </p>
          </button>

          <button
            onClick={() => handleMock('Volunteer Training')}
            className="bg-gradient-to-br from-emerald-100 to-white border border-emerald-200 rounded-xl sm:rounded-2xl shadow hover:shadow-md transition p-4 text-left"
          >
            <div className="text-2xl">🤝</div>
            <div className="mt-2 font-semibold text-slate-800 text-sm sm:text-base">
              Volunteer Training Quiz
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Voter outreach & etiquette
            </p>
          </button>

          <button
            onClick={() => handleMock('Constituency GK')}
            className="bg-gradient-to-br from-amber-100 to-white border border-amber-200 rounded-xl sm:rounded-2xl shadow hover:shadow-md transition p-4 text-left"
          >
            <div className="text-2xl">📍</div>
            <div className="mt-2 font-semibold text-slate-800 text-sm sm:text-base">
              Constituency GK Test
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Wards, booths, demographics
            </p>
          </button>
        </section>

        {/* Campaign Overview */}
        <section className="bg-white rounded-xl sm:rounded-2xl shadow p-3 sm:p-4">
          <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">My Campaign Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 items-start">
            <div className="col-span-2 sm:col-span-1 flex justify-center mb-1 sm:mb-0">
              <Donut percent={metrics.donorsReached} />
            </div>

            <div className="space-y-3">
              <Stat label="Registered Voters" value={metrics.total.toLocaleString()} />
              <Stat label="Male" value={metrics.male.toLocaleString()} />
              <Stat label="Female" value={metrics.female.toLocaleString()} />
            </div>

            <div className="space-y-3">
              <Stat label="Unknown" value={metrics.unknown.toLocaleString()} />
              <Stat label="Events" value="12 Upcoming" />
              <Stat label="Funds Raised" value="₹1,500,000" sub="from upcoming donors" />
            </div>
          </div>
        </section>
      </main>

      <nav
        className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 6px)' }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-5 text-center text-[11px] sm:text-xs py-3 text-slate-600">
          <button className="flex flex-col items-center gap-1">Dashboard</button>
          <button className="flex flex-col items-center gap-1">Benefits</button>
          <button className="flex flex-col items-center gap-1">Messages</button>
          <button className="flex flex-col items-center gap-1">Tasks</button>
          <button className="flex flex-col items-center gap-1">Calendars</button>
        </div>
      </nav>
    </div>
  )
}
