import { useState, useEffect, useRef } from 'react'

const stats = [
  { value: 50000, suffix: '+', label: 'Active Job Listings', icon: '💼', color: 'text-blue-600' },
  { value: 12000, suffix: '+', label: 'Partner Hospitals', icon: '🏥', color: 'text-teal-600' },
  { value: 250000, suffix: '+', label: 'Registered Professionals', icon: '👨‍⚕️', color: 'text-green-600' },
  { value: 98, suffix: '%', label: 'Placement Success Rate', icon: '🎯', color: 'text-purple-600' },
  { value: 500, suffix: '+', label: 'Cities & Towns Covered', icon: '📍', color: 'text-orange-600' },
  { value: 24, suffix: '/7', label: 'Support Available', icon: '🕐', color: 'text-rose-600' },
]

function useCountUp(target: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return count
}

function StatCard({ stat, animate }: { stat: typeof stats[0]; animate: boolean }) {
  const count = useCountUp(stat.value, 2000, animate)
  return (
    <div className="text-center p-6 group">
      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
        {stat.icon}
      </div>
      <div className={`text-3xl sm:text-4xl font-bold ${stat.color} mb-2`}>
        {count.toLocaleString('en-IN')}{stat.suffix}
      </div>
      <p className="text-[#5a6a8a] text-sm font-medium">{stat.label}</p>
    </div>
  )
}

export default function Stats() {
  const [animate, setAnimate] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimate(true)
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.2 }
    )
    const el = sectionRef.current
    if (el) observer.observe(el)
    return () => { if (el) observer.unobserve(el) }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-20 relative overflow-hidden section-reveal"
      style={{ background: 'linear-gradient(135deg, #0d2b6b 0%, #006b7a 100%)' }}
    >
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 animate-spin-slow" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#22c36a]/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Trusted by India's Healthcare Community
          </h2>
          <p className="text-white/70 max-w-xl mx-auto">
            Numbers that speak for themselves — 24medijobs connects thousands of healthcare
            professionals with the right opportunities every day.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-white/10 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} animate={animate} />
          ))}
        </div>

        {/* Trusted by logos */}
        <div className="mt-16 text-center">
          <p className="text-white/50 text-sm font-medium uppercase tracking-wider mb-6">
            Trusted by India's top healthcare institutions
          </p>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {['Apollo Hospitals', 'Fortis Healthcare', 'Max Healthcare', 'Medanta', 'Narayana Health', 'Manipal Hospitals'].map((name) => (
              <div key={name} className="bg-white/10 border border-white/20 rounded-xl px-5 py-3">
                <span className="text-white/80 font-semibold text-sm">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
