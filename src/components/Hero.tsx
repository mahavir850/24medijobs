import { useState, useEffect } from 'react'

interface HeroProps {
  onNavigate: (page: string) => void
}

export default function Hero({ onNavigate }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const specialties = [
    'Doctor / Physician', 'Nurse', 'Pharmacist', 'Lab Technician',
    'Radiologist', 'Physiotherapist', 'Dentist', 'Medical Assistant',
  ]

  const stats = [
    { value: '50,000+', label: 'Active Jobs' },
    { value: '12,000+', label: 'Hospitals & Clinics' },
    { value: '2.5 Lakh+', label: 'Healthcare Professionals' },
    { value: '98%', label: 'Placement Rate' },
  ]

  return (
    <section className="hero-bg min-h-screen relative overflow-hidden flex items-center">
      {/* Animated background blobs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-[#00b4a0]/20 rounded-full animate-blob blur-3xl" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#22c36a]/10 rounded-full animate-blob blur-3xl" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full animate-blob blur-2xl" style={{ animationDelay: '5s' }} />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-32 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <div
              className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 transition-all duration-700 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#22c36a] animate-pulse" />
              <span className="text-white/90 text-sm font-medium">India's #1 Healthcare Job Platform</span>
            </div>

            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 transition-all duration-700 delay-100 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Your Medical Career{' '}
              <span className="relative">
                <span className="text-[#00b4a0]">Starts Here</span>
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#22c36a] rounded-full" />
              </span>
            </h1>

            <p
              className={`text-white/75 text-lg mb-8 max-w-xl leading-relaxed transition-all duration-700 delay-200 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Connect with top hospitals, clinics, and healthcare organizations across India.
              Find your dream role in healthcare — doctors, nurses, pharmacists, and more.
            </p>

            {/* Search Box */}
            <div
              className={`bg-white rounded-2xl p-3 shadow-2xl shadow-black/30 transition-all duration-700 delay-300 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 border border-gray-100 rounded-xl">
                  <svg className="w-5 h-5 text-[#00b4a0] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Job title, keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-sm text-gray-700 outline-none placeholder-gray-400"
                  />
                </div>
                <div className="flex-1 flex items-center gap-2 px-3 py-2 border border-gray-100 rounded-xl">
                  <svg className="w-5 h-5 text-[#00b4a0] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="City, state..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-sm text-gray-700 outline-none placeholder-gray-400"
                  />
                </div>
                <div className="flex-1 flex items-center gap-2 px-3 py-2 border border-gray-100 rounded-xl">
                  <svg className="w-5 h-5 text-[#00b4a0] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full text-sm text-gray-600 outline-none bg-transparent"
                  >
                    <option value="">Select specialty</option>
                    {specialties.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => onNavigate('jobs')}
                  className="bg-[#00b4a0] hover:bg-[#009888] text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap text-sm"
                >
                  Search Jobs
                </button>
              </div>

              {/* Quick tags */}
              <div className="flex flex-wrap gap-2 mt-3 px-1">
                <span className="text-xs text-gray-500">Popular:</span>
                {['MBBS Doctor', 'Staff Nurse', 'Pharmacist', 'Lab Tech', 'Radiologist'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => { setSearchQuery(tag); onNavigate('jobs') }}
                    className="text-xs text-[#0d2b6b] bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors duration-150 font-medium"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right side — floating stat cards */}
          <div
            className={`hidden lg:flex flex-col gap-4 transition-all duration-700 delay-400 ${
              visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            {/* Big center card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 animate-float">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-[#00b4a0] flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12.5l6 6 9-9" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-2xl">Dr. Priya Sharma</p>
                  <p className="text-white/70 text-sm">MBBS, MD — Cardiologist</p>
                </div>
              </div>
              <div className="bg-white/10 rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-xs">Placed at</p>
                  <p className="text-white font-semibold text-sm">Apollo Hospitals, Delhi</p>
                </div>
                <div className="bg-[#22c36a] text-white text-xs font-bold px-3 py-1.5 rounded-full">HIRED</div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  <p className="text-white font-bold text-2xl">{s.value}</p>
                  <p className="text-white/65 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Active users badge */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
              <div className="flex -space-x-2">
                {['bg-blue-400', 'bg-teal-400', 'bg-green-400', 'bg-indigo-400'].map((c, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-white/30 flex items-center justify-center text-white text-xs font-bold`}>
                    {['D', 'N', 'P', 'L'][i]}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">2,400+ applied today</p>
                <p className="text-white/60 text-xs">Doctors, Nurses, Pharmacists</p>
              </div>
              <div className="ml-auto w-2 h-2 rounded-full bg-[#22c36a] animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f0f5ff" />
        </svg>
      </div>
    </section>
  )
}
