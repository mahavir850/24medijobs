import { useState, useEffect, useRef } from 'react'

interface FeaturedJobsProps {
  onNavigate: (page: string) => void
  jobs?: any[]
}

const defaultJobs = [
  {
    id: 1,
    title: 'Senior Cardiologist',
    hospital: 'Apollo Hospitals',
    location: 'New Delhi, NCR',
    type: 'Full-time',
    salary: '₹3.5L – ₹6L/month',
    posted: '2 days ago',
    tags: ['MD Cardiology', '5+ yrs exp', 'Fellowship preferred'],
    logo: '🏥',
    color: 'bg-blue-100',
    featured: true,
  },
  {
    id: 2,
    title: 'Staff Nurse — ICU',
    hospital: 'Fortis Healthcare',
    location: 'Mumbai, Maharashtra',
    type: 'Full-time',
    salary: '₹35,000 – ₹55,000/month',
    posted: '1 day ago',
    tags: ['GNM/B.Sc Nursing', 'ICU Experience', 'BCLS Certified'],
    logo: '🏩',
    color: 'bg-teal-100',
    featured: true,
  },
  {
    id: 3,
    title: 'Clinical Pharmacist',
    hospital: 'Medanta — The Medicity',
    location: 'Gurugram, Haryana',
    type: 'Full-time',
    salary: '₹50,000 – ₹80,000/month',
    posted: '3 days ago',
    tags: ['B.Pharm/M.Pharm', 'Hospital Pharmacy', 'Clinical Experience'],
    logo: '🏨',
    color: 'bg-green-100',
    featured: false,
  },
  {
    id: 4,
    title: 'Radiologist (DNB)',
    hospital: 'Max Healthcare',
    location: 'Bangalore, Karnataka',
    type: 'Full-time',
    salary: '₹2L – ₹4L/month',
    posted: '1 week ago',
    tags: ['MD Radiology', 'CT/MRI Expertise', 'FRCR preferred'],
    logo: '🏦',
    color: 'bg-purple-100',
    featured: false,
  },
  {
    id: 5,
    title: 'Physiotherapist',
    hospital: 'Rainbow Children\'s Hospital',
    location: 'Hyderabad, Telangana',
    type: 'Part-time',
    salary: '₹25,000 – ₹40,000/month',
    posted: '4 days ago',
    tags: ['BPT/MPT', 'Pediatric PT', '2+ yrs exp'],
    logo: '🏫',
    color: 'bg-orange-100',
    featured: false,
  },
  {
    id: 6,
    title: 'Medical Lab Technician',
    hospital: 'Narayana Health',
    location: 'Chennai, Tamil Nadu',
    type: 'Full-time',
    salary: '₹20,000 – ₹35,000/month',
    posted: '5 days ago',
    tags: ['DMLT/BMLT', 'Hematology', 'Biochemistry'],
    logo: '🔬',
    color: 'bg-red-100',
    featured: false,
  },
]

const filters = ['ALL']

export default function FeaturedJobs({ onNavigate, jobs = defaultJobs }: FeaturedJobsProps) {
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [saved, setSaved] = useState<number[]>([])
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
      { threshold: 0.05 }
    )
    const elements = sectionRef.current?.querySelectorAll('.section-reveal')
    elements?.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const toggleSave = (id: number) => {
    setSaved((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  return (
    <section className="py-20 bg-white" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 section-reveal">
          <div>
            <span className="inline-block text-sm font-semibold text-[#00b4a0] bg-[#00b4a0]/10 px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
              Latest Openings
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0d1b3e]">
              Featured <span className="gradient-text">Medical Jobs</span>
            </h2>
          </div>
          <button
            onClick={() => onNavigate('jobs')}
            className="text-sm font-semibold text-[#00b4a0] hover:text-[#009888] flex items-center gap-1 shrink-0"
          >
            View all jobs
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 section-reveal">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-sm font-medium px-5 py-2.5 rounded-xl shrink-0 transition-all duration-200 ${
                activeFilter === f
                  ? 'bg-[#0d2b6b] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Jobs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job, i) => (
            <div
              key={job.id}
              className="border border-gray-100 rounded-2xl p-5 card-hover bg-white relative group section-reveal"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              {job.featured && (
                <div className="absolute top-4 right-4 bg-[#22c36a] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Featured
                </div>
              )}

              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 ${job.color || 'bg-blue-50'} rounded-xl flex items-center justify-center text-2xl shrink-0 overflow-hidden`}>
                  {job.logo && job.logo.length > 4 ? (
                    <img src={job.logo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    job.logo || '🏥'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#0d1b3e] text-base group-hover:text-[#0d2b6b] truncate">
                    {job.title}
                  </h3>
                  <p className="text-[#5a6a8a] text-sm">{job.hospital}</p>
                </div>
                <button
                  onClick={() => toggleSave(job.id)}
                  className="shrink-0 p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg
                    className={`w-5 h-5 transition-colors ${saved.includes(job.id) ? 'text-[#00b4a0] fill-[#00b4a0]' : 'text-gray-400'}`}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    fill="none"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-wrap gap-3 text-xs text-[#5a6a8a] mb-4">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-[#00b4a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-[#00b4a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {job.type}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {(job.tags || [job.specialty || 'General', job.exp || 'Fresher', job.type || 'Full-time']).map((tag: string) => (
                  <span key={tag} className="text-[11px] bg-[#f0f5ff] text-[#0d2b6b] px-2.5 py-1 rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <p className="font-bold text-[#0d1b3e] text-sm">{job.salary}</p>
                  <p className="text-[#5a6a8a] text-xs">{job.posted}</p>
                </div>
                <button
                  onClick={() => onNavigate('jobs')}
                  className="bg-[#0d2b6b] hover:bg-[#00b4a0] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        <div className="text-center mt-10 section-reveal">
          <button
            onClick={() => onNavigate('jobs')}
            className="inline-flex items-center gap-2 bg-[#0d2b6b] text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-[#00b4a0] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Browse All 50,000+ Jobs
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
