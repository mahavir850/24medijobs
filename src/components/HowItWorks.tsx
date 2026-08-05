import { useEffect, useRef } from 'react'

const steps = [
  {
    num: '01',
    icon: '👤',
    title: 'Create Your Profile',
    desc: 'Sign up in under 2 minutes. Upload your medical degree, certifications, and work experience to build a compelling healthcare profile.',
    color: 'from-blue-500 to-blue-700',
    bg: 'bg-blue-50',
  },
  {
    num: '02',
    icon: '🔍',
    title: 'Search & Filter Jobs',
    desc: 'Browse 50,000+ verified medical job listings. Filter by specialty, location, salary, hospital type, or job type to find your perfect match.',
    color: 'from-teal-500 to-teal-700',
    bg: 'bg-teal-50',
  },
  {
    num: '03',
    icon: '📋',
    title: 'Apply in One Click',
    desc: 'Apply instantly with your 24medijobs profile. No repetitive form filling — your credentials are pre-verified and ready to go.',
    color: 'from-green-500 to-green-700',
    bg: 'bg-green-50',
  },
  {
    num: '04',
    icon: '🎉',
    title: 'Get Hired',
    desc: 'Receive interview calls, attend hospital screenings, and land your dream healthcare role. Our team supports you throughout the process.',
    color: 'from-purple-500 to-purple-700',
    bg: 'bg-purple-50',
  },
]

const forEmployers = [
  {
    icon: '📢',
    title: 'Post Job Requirements',
    desc: 'Publish detailed job descriptions with required qualifications, salary range, and benefits to attract the right candidates.',
  },
  {
    icon: '🤝',
    title: 'Access Verified Talent',
    desc: 'Browse pre-screened profiles of doctors, nurses, pharmacists, and allied health professionals with verified credentials.',
  },
  {
    icon: '📞',
    title: 'Shortlist & Interview',
    desc: 'Use our integrated scheduling tools to shortlist candidates, schedule interviews, and manage your hiring pipeline.',
  },
]

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.section-reveal').forEach((el) => el.classList.add('visible'))
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
        {/* For Job Seekers */}
        <div className="text-center mb-14 section-reveal">
          <span className="inline-block text-sm font-semibold text-[#00b4a0] bg-[#00b4a0]/10 px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0d1b3e] mb-4">
            Land Your Dream Medical Job{' '}
            <span className="gradient-text">in 4 Simple Steps</span>
          </h2>
          <p className="text-[#5a6a8a] max-w-2xl mx-auto">
            From profile creation to getting hired — 24medijobs simplifies every step of your healthcare job search.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`${step.bg} rounded-2xl p-6 relative section-reveal card-hover`}
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              {/* Step connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 -right-3 w-6 z-10">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#00b4a0]">
                    <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </div>
              )}

              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} text-white text-xl mb-4 shadow-lg`}>
                {step.icon}
              </div>
              <div className="text-5xl font-black text-black/5 absolute top-4 right-5 select-none">
                {step.num}
              </div>
              <h3 className="font-bold text-[#0d1b3e] text-base mb-2">{step.title}</h3>
              <p className="text-[#5a6a8a] text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-[#d0ddf0] mb-20" />

        {/* For Employers */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="section-reveal">
            <span className="inline-block text-sm font-semibold text-[#00b4a0] bg-[#00b4a0]/10 px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
              For Employers
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0d1b3e] mb-4">
              Hire Top Healthcare{' '}
              <span className="gradient-text">Talent Faster</span>
            </h2>
            <p className="text-[#5a6a8a] mb-8 leading-relaxed">
              Join 12,000+ hospitals, clinics, and healthcare organizations that trust 24medijobs
              to find qualified, verified medical professionals across India.
            </p>
            <div className="flex flex-col gap-5">
              {forEmployers.map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="text-2xl w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0d1b3e] mb-1">{item.title}</h4>
                    <p className="text-[#5a6a8a] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-8 bg-[#0d2b6b] text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-[#00b4a0] transition-all duration-300 shadow-lg inline-flex items-center gap-2">
              Post a Job Free
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>

          {/* Right graphic */}
          <div className="section-reveal" style={{ transitionDelay: '0.2s' }}>
            <div className="bg-gradient-to-br from-[#0d2b6b] to-[#006b7a] rounded-3xl p-8 text-white">
              <h3 className="font-bold text-xl mb-6">Hiring Dashboard</h3>
              {/* Fake dashboard mockup */}
              <div className="space-y-3">
                {[
                  { name: 'Dr. Rajan Mehta', role: 'Cardiologist', status: 'Interview Scheduled', dot: 'bg-yellow-400' },
                  { name: 'Nurse Priya S.', role: 'ICU Nurse (GNM)', status: 'Shortlisted', dot: 'bg-blue-400' },
                  { name: 'Mr. Arun Kumar', role: 'Clinical Pharmacist', status: 'Offer Extended', dot: 'bg-green-400' },
                  { name: 'Dr. Seema Rao', role: 'Pediatrician', status: 'Under Review', dot: 'bg-orange-400' },
                ].map((c) => (
                  <div key={c.name} className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                        {c.name.split(' ')[1]?.[0] || c.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{c.name}</p>
                        <p className="text-white/60 text-xs">{c.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${c.dot}`} />
                      <span className="text-xs text-white/80">{c.status}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { n: '48', l: 'Applicants' },
                  { n: '12', l: 'Shortlisted' },
                  { n: '3', l: 'Hired' },
                ].map((s) => (
                  <div key={s.l} className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="font-bold text-xl">{s.n}</p>
                    <p className="text-white/60 text-xs">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
