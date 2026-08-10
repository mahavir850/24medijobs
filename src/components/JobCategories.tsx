import { useEffect, useRef } from 'react'

interface JobCategoriesProps {
  onNavigate: (page: string) => void
}

const categories = [
  {
    icon: '🩺',
    title: 'Doctors & Physicians',
    count: '8,420 Jobs',
    color: 'from-blue-500 to-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    sub: ['MBBS', 'MD', 'General Practitioner', 'Specialist'],
  },
  {
    icon: '💉',
    title: 'Nursing Staff',
    count: '14,300 Jobs',
    color: 'from-teal-500 to-teal-700',
    bg: 'bg-teal-50',
    border: 'border-teal-100',
    sub: ['Staff Nurse', 'ICU Nurse', 'ANM', 'GNM'],
  },
  {
    icon: '💊',
    title: 'Pharmacy',
    count: '5,680 Jobs',
    color: 'from-green-500 to-green-700',
    bg: 'bg-green-50',
    border: 'border-green-100',
    sub: ['Clinical Pharmacist', 'Retail Pharmacy', 'Hospital Pharmacy'],
  },
  {
    icon: '🔬',
    title: 'Lab & Diagnostics',
    count: '4,190 Jobs',
    color: 'from-purple-500 to-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    sub: ['Lab Technician', 'Pathologist', 'Blood Bank Tech'],
  },
  {
    icon: '🦷',
    title: 'Dental',
    count: '2,840 Jobs',
    color: 'from-cyan-500 to-cyan-700',
    bg: 'bg-cyan-50',
    border: 'border-cyan-100',
    sub: ['Dentist', 'Dental Assistant', 'Orthodontist'],
  },
  {
    icon: '🫀',
    title: 'Radiology & Imaging',
    count: '3,210 Jobs',
    color: 'from-red-500 to-red-700',
    bg: 'bg-red-50',
    border: 'border-red-100',
    sub: ['Radiologist', 'Sonographer', 'MRI Tech', 'CT Tech'],
  },
  {
    icon: '🏃',
    title: 'Physiotherapy',
    count: '2,560 Jobs',
    color: 'from-orange-500 to-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    sub: ['Physiotherapist', 'Sports Medicine', 'Occupational Therapy'],
  },
  {
    icon: '🧠',
    title: 'Mental Health',
    count: '1,890 Jobs',
    color: 'from-indigo-500 to-indigo-700',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    sub: ['Psychiatrist', 'Psychologist', 'Counsellor', 'Therapist'],
  },
  {
    icon: '👶',
    title: 'Pediatrics',
    count: '2,130 Jobs',
    color: 'from-pink-500 to-pink-700',
    bg: 'bg-pink-50',
    border: 'border-pink-100',
    sub: ['Pediatrician', 'NICU Nurse', 'Child Specialist'],
  },
  {
    icon: '🚑',
    title: 'Emergency & ICU',
    count: '3,740 Jobs',
    color: 'from-rose-500 to-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    sub: ['Emergency Medicine', 'Intensivist', 'Paramedic', 'ER Nurse'],
  },
  {
    icon: '⚕️',
    title: 'Medical Admin',
    count: '4,900 Jobs',
    color: 'from-slate-500 to-slate-700',
    bg: 'bg-slate-50',
    border: 'border-slate-100',
    sub: ['Hospital Manager', 'Medical Coding', 'Health Administrator'],
  },
  {
    icon: '🧬',
    title: 'Research & Clinical',
    count: '1,440 Jobs',
    color: 'from-emerald-500 to-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    sub: ['Clinical Research', 'Medical Writer', 'Biostatistician'],
  },
]

export default function JobCategories({ onNavigate }: JobCategoriesProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )
    const el = sectionRef.current
    if (el) observer.observe(el)
    return () => { if (el) observer.unobserve(el) }
  }, [])

  return (
    <section className="py-20 bg-[#f0f5ff]" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14 section-reveal">
          <span className="inline-block text-sm font-semibold text-[#00b4a0] bg-[#00b4a0]/10 px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            Browse by Specialty
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0d1b3e] mb-4">
            Explore Medical{' '}
            <span className="gradient-text">Job Categories</span>
          </h2>
          <p className="text-[#5a6a8a] max-w-2xl mx-auto text-base">
            From clinical roles to administrative positions — find opportunities across every
            healthcare discipline in India's most comprehensive medical job board.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <button
              key={cat.title}
              onClick={() => onNavigate('jobs')}
              className={`${cat.bg} ${cat.border} border rounded-2xl p-5 text-left card-hover group relative overflow-hidden section-reveal`}
              style={{ transitionDelay: `${i * 0.05}s` }}
            >
              {/* Gradient accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${cat.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />

              <div className="text-3xl mb-3">{cat.icon}</div>
              <h3 className="font-bold text-[#0d1b3e] text-sm sm:text-base mb-1 group-hover:text-[#0d2b6b]">
                {cat.title}
              </h3>
              <div className="flex flex-wrap gap-1 mt-3">
                {cat.sub.slice(0, 2).map((s) => (
                  <span key={s} className="text-[10px] text-[#5a6a8a] bg-white/70 px-2 py-0.5 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
              <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg className="w-5 h-5 text-[#00b4a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* View all */}
        <div className="text-center mt-10">
          <button
            onClick={() => onNavigate('categories')}
            className="inline-flex items-center gap-2 border-2 border-[#0d2b6b] text-[#0d2b6b] font-semibold px-8 py-3 rounded-xl hover:bg-[#0d2b6b] hover:text-white transition-all duration-200"
          >
            View All Categories
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
