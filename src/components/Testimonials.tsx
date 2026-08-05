import { useState, useEffect, useRef } from 'react'

const testimonials = [
  {
    name: 'Dr. Arjun Sharma',
    role: 'Senior Cardiologist',
    hospital: 'Apollo Hospitals, Delhi',
    text: "24medijobs transformed my career search. Within 3 weeks of registering, I had 8 interview calls from top hospitals. The platform understands healthcare professionals like no other job portal.",
    rating: 5,
    avatar: '👨‍⚕️',
    bg: 'bg-blue-100',
  },
  {
    name: 'Nurse Priya Nair',
    role: 'ICU Head Nurse',
    hospital: 'Fortis Healthcare, Mumbai',
    text: "As a GNM nurse with 7 years of experience, I struggled to find quality ICU positions. 24medijobs had listings I couldn't find anywhere else. Got placed at Fortis within 2 months!",
    rating: 5,
    avatar: '👩‍⚕️',
    bg: 'bg-teal-100',
  },
  {
    name: 'Mr. Suresh Patel',
    role: 'Clinical Pharmacist',
    hospital: 'Medanta, Gurugram',
    text: "The verification system at 24medijobs gives employers confidence in your credentials. My profile got 40+ views in the first week. Best platform for pharmacy professionals in India.",
    rating: 5,
    avatar: '👨‍🔬',
    bg: 'bg-green-100',
  },
  {
    name: 'Dr. Meera Krishnan',
    role: 'Radiologist',
    hospital: 'Max Healthcare, Bangalore',
    text: "I was relocating from Chennai to Bangalore and needed a radiology position. 24medijobs made it incredibly easy — location-filtered search, direct employer contact, and fast response times.",
    rating: 5,
    avatar: '👩‍🔬',
    bg: 'bg-purple-100',
  },
  {
    name: 'Mr. Rohit Gupta',
    role: 'Lab Technician Lead',
    hospital: 'Narayana Health, Chennai',
    text: "I recommend 24medijobs to every healthcare professional I know. The salary benchmarking tool alone is worth it — helped me negotiate a 35% hike at my new hospital.",
    rating: 5,
    avatar: '🧑‍🔬',
    bg: 'bg-orange-100',
  },
]

const employerReviews = [
  {
    name: 'HR Director',
    org: 'Apollo Hospitals Group',
    text: "We've hired over 200 medical professionals through 24medijobs. The quality of candidates is exceptional — verified credentials, detailed profiles, and fast response rates.",
    avatar: '🏥',
  },
  {
    name: 'Medical Superintendent',
    org: 'Fortis Healthcare',
    text: "24medijobs understands healthcare hiring. Their specialty filters help us find exactly the right candidates — whether it's a cardiac surgeon or an ICU nurse.",
    avatar: '🏩',
  },
]

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1 }
    )
    const el = sectionRef.current
    if (el) observer.observe(el)
    return () => { if (el) observer.unobserve(el) }
  }, [])

  return (
    <section className="py-20 bg-white overflow-hidden" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14 section-reveal">
          <span className="inline-block text-sm font-semibold text-[#00b4a0] bg-[#00b4a0]/10 px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0d1b3e] mb-4">
            What Healthcare Professionals{' '}
            <span className="gradient-text">Say About Us</span>
          </h2>
        </div>

        {/* Featured testimonial */}
        <div className="max-w-3xl mx-auto mb-10 section-reveal">
          <div
            className={`${testimonials[activeIndex].bg} rounded-3xl p-8 sm:p-10 relative overflow-hidden transition-all duration-500`}
          >
            <div className="absolute top-6 right-8 text-6xl opacity-10 font-serif">"</div>
            <div className="flex items-center gap-1 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <p className="text-[#0d1b3e] text-lg leading-relaxed mb-6 italic">
              "{testimonials[activeIndex].text}"
            </p>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-3xl shadow-sm">
                {testimonials[activeIndex].avatar}
              </div>
              <div>
                <p className="font-bold text-[#0d1b3e]">{testimonials[activeIndex].name}</p>
                <p className="text-[#5a6a8a] text-sm">{testimonials[activeIndex].role}</p>
                <p className="text-[#00b4a0] text-xs font-medium">{testimonials[activeIndex].hospital}</p>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex ? 'w-8 bg-[#00b4a0]' : 'w-2 bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* All testimonials grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {testimonials.slice(0, 3).map((t, i) => (
            <div
              key={t.name}
              className="border border-gray-100 rounded-2xl p-5 card-hover section-reveal"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <svg key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="text-[#5a6a8a] text-sm leading-relaxed mb-4">"{t.text.slice(0, 120)}..."</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${t.bg} rounded-full flex items-center justify-center text-xl`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-[#0d1b3e] text-sm">{t.name}</p>
                  <p className="text-[#5a6a8a] text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Employer reviews */}
        <div className="bg-[#f0f5ff] rounded-3xl p-8 section-reveal">
          <h3 className="text-xl font-bold text-[#0d1b3e] mb-6 text-center">Trusted by Leading Hospitals</h3>
          <div className="grid sm:grid-cols-2 gap-5">
            {employerReviews.map((r) => (
              <div key={r.org} className="bg-white rounded-2xl p-5 flex gap-4">
                <div className="text-3xl w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  {r.avatar}
                </div>
                <div>
                  <p className="text-[#5a6a8a] text-sm leading-relaxed mb-3">"{r.text}"</p>
                  <p className="font-bold text-[#0d1b3e] text-sm">{r.name}</p>
                  <p className="text-[#00b4a0] text-xs">{r.org}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
