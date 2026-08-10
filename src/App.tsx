import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import JobCategories from './components/JobCategories'
import FeaturedJobs from './components/FeaturedJobs'
import Stats from './components/Stats'
import HowItWorks from './components/HowItWorks'
import Testimonials from './components/Testimonials'
import EmployerCTA from './components/EmployerCTA'
import Footer from './components/Footer'
import JobsPage from './pages/JobsPage'
import AboutPage from './pages/AboutPage'
import ProfilePage from './pages/ProfilePage'
import LogoBadge from './components/LogoBadge'
import { supabase } from './supabaseClient'
import AdminPanel from './components/AdminPanel'

interface HomePageProps {
  onNavigate: (page: string) => void
  jobs: any[]
  setJobs: React.Dispatch<React.SetStateAction<any[]>>
  employerProfile: any
  setEmployerProfile: (profile: any) => void
}

function HomePage({ onNavigate, jobs, setJobs, employerProfile, setEmployerProfile }: HomePageProps) {
  return (
    <>
      <Hero onNavigate={onNavigate} />
      <JobCategories onNavigate={onNavigate} />
      <FeaturedJobs onNavigate={onNavigate} jobs={jobs} />
      <Stats />
      <HowItWorks />
      <Testimonials />
      {!employerProfile && (
        <EmployerCTA 
          onNavigate={onNavigate} 
          jobs={jobs} 
          setJobs={setJobs} 
          employerProfile={employerProfile} 
          setEmployerProfile={setEmployerProfile} 
        />
      )}
    </>
  )
}

function CategoriesPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const allCats = [
    { icon: '🩺', title: 'Doctors & Physicians', count: '8,420', sub: ['MBBS', 'MD', 'MS', 'General Practitioner', 'Specialist', 'Consultant'] },
    { icon: '💉', title: 'Nursing Staff', count: '14,300', sub: ['Staff Nurse', 'ICU Nurse', 'ANM', 'GNM', 'Head Nurse', 'Nursing Supervisor'] },
    { icon: '💊', title: 'Pharmacy', count: '5,680', sub: ['Clinical Pharmacist', 'Retail Pharmacy', 'Hospital Pharmacy', 'Drug Inspector'] },
    { icon: '🔬', title: 'Lab & Diagnostics', count: '4,190', sub: ['Lab Technician', 'Pathologist', 'Blood Bank Tech', 'Microbiologist'] },
    { icon: '🦷', title: 'Dental', count: '2,840', sub: ['Dentist', 'Dental Assistant', 'Orthodontist', 'Endodontist'] },
    { icon: '🫀', title: 'Radiology & Imaging', count: '3,210', sub: ['Radiologist', 'Sonographer', 'MRI Tech', 'CT Tech', 'Nuclear Medicine'] },
    { icon: '🏃', title: 'Physiotherapy', count: '2,560', sub: ['Physiotherapist', 'Sports Medicine', 'Occupational Therapy', 'BPT', 'MPT'] },
    { icon: '🧠', title: 'Mental Health', count: '1,890', sub: ['Psychiatrist', 'Psychologist', 'Counsellor', 'Therapist', 'Social Worker'] },
    { icon: '👶', title: 'Pediatrics', count: '2,130', sub: ['Pediatrician', 'NICU Nurse', 'Child Specialist', 'Neonatologist'] },
    { icon: '🚑', title: 'Emergency & ICU', count: '3,740', sub: ['Emergency Medicine', 'Intensivist', 'Paramedic', 'ER Nurse', 'Critical Care'] },
    { icon: '⚕️', title: 'Medical Administration', count: '4,900', sub: ['Hospital Manager', 'Medical Coding', 'Health Administrator', 'CEO', 'COO'] },
    { icon: '🧬', title: 'Research & Clinical Trials', count: '1,440', sub: ['Clinical Research', 'Medical Writer', 'Biostatistician', 'CRA', 'CRC'] },
    { icon: '👁️', title: 'Ophthalmology', count: '1,280', sub: ['Ophthalmologist', 'Optometrist', 'Eye Technician', 'Refractionist'] },
    { icon: '🦴', title: 'Orthopedics', count: '2,100', sub: ['Orthopedic Surgeon', 'Joint Replacement', 'Spine Specialist', 'Trauma Surgeon'] },
    { icon: '❤️', title: 'Cardiology', count: '1,950', sub: ['Cardiologist', 'Cardiac Nurse', 'Echocardiographer', 'Catheterization Lab Tech'] },
    { icon: '🍃', title: 'Ayurveda & Naturopathy', count: '980', sub: ['BAMS', 'BHMS', 'Naturopath', 'Panchakarma Therapist'] },
  ]

  return (
    <div className="min-h-screen bg-[#f0f5ff] pt-20">
      <div className="hero-bg py-14 px-4 sm:px-6 text-center">
        <LogoBadge size="xl" inverted className="mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-white mb-3">All Medical Specialties</h1>
        <p className="text-white/70">Browse 50,000+ jobs across 16+ healthcare disciplines</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {allCats.map((cat) => (
            <button
              key={cat.title}
              onClick={() => onNavigate('jobs')}
              className="bg-white border border-gray-100 rounded-2xl p-6 text-left card-hover group"
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className="font-bold text-[#0d1b3e] mb-1 group-hover:text-[#00b4a0] transition-colors">{cat.title}</h3>
              <div className="flex flex-wrap gap-1 mt-3">
                {cat.sub.slice(0, 3).map((s) => (
                  <span key={s} className="text-[11px] text-[#5a6a8a] bg-[#f0f5ff] px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

interface EmployersPageProps {
  onNavigate: (page: string) => void
  jobs: any[]
  setJobs: React.Dispatch<React.SetStateAction<any[]>>
  employerProfile: any
  setEmployerProfile: (profile: any) => void
}

function EmployersPage({ onNavigate, jobs, setJobs, employerProfile, setEmployerProfile }: EmployersPageProps) {
  return (
    <div className="min-h-screen bg-[#f0f5ff] pt-20">
      <div className="hero-bg py-14 px-4 sm:px-6 text-center">
        <LogoBadge size="xl" inverted className="mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-white mb-3">Hire Healthcare Talent</h1>
        <p className="text-white/70">Post jobs, access verified medical professionals, and hire faster</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <EmployerCTA 
          onNavigate={onNavigate} 
          jobs={jobs} 
          setJobs={setJobs} 
          employerProfile={employerProfile} 
          setEmployerProfile={setEmployerProfile} 
        />
      </div>
    </div>
  )
}

function OtpDigitInput({ otp, setOtp }: { otp: string[]; setOtp: (v: string[]) => void }) {
  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[i] = val
    setOtp(next)
    if (val && i < 5) {
      const nextInput = document.getElementById(`otp-${i + 1}`) as HTMLInputElement
      nextInput?.focus()
    }
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      const prev = document.getElementById(`otp-${i - 1}`) as HTMLInputElement
      prev?.focus()
    }
  }

  return (
    <div className="flex gap-2 justify-center my-5">
      {otp.map((digit, i) => (
        <input
          key={i}
          id={`otp-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all ${
            digit ? 'border-[#00b4a0] bg-[#00b4a0]/5 text-[#0d1b3e]' : 'border-gray-200 text-gray-400'
          } focus:border-[#00b4a0]`}
        />
      ))}
    </div>
  )
}

function JobSeekerLoginPage({ onSuccess }: { onSuccess: (phone: string) => void }) {
  const [otpState, setOtpState] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  const handleSendOtp = () => {
    if (phone.replace(/\D/g, '').length < 10) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setOtpState('otp')
      setResendTimer(30)
    }, 1400)
  }

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length < 6) return
    setLoading(true)
    
    try {
      // Check if user has profile in Supabase
      const { data: seekerProfile, error } = await supabase
        .from('seeker_profiles')
        .select('*')
        .eq('id', phone)
        .maybeSingle()
        
      if (!error && seekerProfile) {
        localStorage.setItem('seeker_basic_info', JSON.stringify({
          name: seekerProfile.name,
          email: seekerProfile.email,
          dob: seekerProfile.dob,
          gender: seekerProfile.gender,
          city: seekerProfile.city,
          state: seekerProfile.state,
          pincode: seekerProfile.pincode
        }))
        
        localStorage.setItem('seeker_professional_info', JSON.stringify({
          specialty: seekerProfile.specialty,
          qualification: seekerProfile.qualification,
          experience: seekerProfile.experience,
          currentRole: seekerProfile.current_role,
          currentHospital: seekerProfile.current_hospital,
          skills: seekerProfile.skills,
          bio: seekerProfile.bio,
          registrationNumber: seekerProfile.registration_number,
          council: seekerProfile.council
        }))
        
        if (seekerProfile.avatar) localStorage.setItem('seeker_avatar', seekerProfile.avatar)
        if (seekerProfile.resume_name) {
          localStorage.setItem('seeker_resume_name', seekerProfile.resume_name)
          localStorage.setItem('seeker_resume_uploaded', 'true')
        }
        localStorage.setItem('seeker_profile_completed', 'true')
      }
      
      localStorage.setItem('seeker_phone', phone)
    } catch (err) {
      console.error('Error fetching seeker profile:', err)
    } finally {
      setLoading(false)
      onSuccess(phone)
    }
  }

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer((p) => p - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [resendTimer])

  return (
    <div className="min-h-screen bg-[#f0f5ff] pt-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <LogoBadge size="lg" className="mb-5" />
          <h1 className="text-2xl font-bold text-[#0d1b3e]">
            {otpState === 'phone' ? 'Find Your Dream Medical Job' : 'Verify Your Number'}
          </h1>
          <p className="text-[#5a6a8a] text-sm mt-1 text-center">
            {otpState === 'phone'
              ? 'Sign in or create your free 24medijobs account'
              : `OTP sent to +91 ${phone}. Enter it below.`}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          {otpState === 'phone' ? (
            <>
              <label className="block text-sm font-semibold text-[#0d1b3e] mb-2">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 mb-6">
                <div className="flex items-center gap-1 px-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-600 font-semibold shrink-0">
                  🇮🇳 +91
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="98765 43210"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#00b4a0] transition-colors tracking-widest font-semibold"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                />
              </div>

              {/* Specialty quick select */}
              <div className="mb-6">
                <p className="text-xs text-[#5a6a8a] mb-2 font-medium">I am a:</p>
                <div className="flex flex-wrap gap-2">
                  {['Doctor', 'Nurse', 'Pharmacist', 'Lab Technician', 'Other'].map((role) => (
                    <button
                      key={role}
                      className="text-xs font-medium px-3 py-1.5 rounded-full border border-[#00b4a0]/30 text-[#0d2b6b] bg-[#f0f5ff] hover:bg-[#00b4a0] hover:text-white hover:border-[#00b4a0] transition-all"
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={loading || phone.length < 10}
                className="w-full bg-[#0d2b6b] hover:bg-[#00b4a0] text-white font-bold py-3.5 rounded-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending OTP...
                  </>
                ) : (
                  'Get OTP →'
                )}
              </button>

              <p className="text-center text-xs text-[#5a6a8a] mt-4">
                By continuing, you agree to our{' '}
                <button className="text-[#00b4a0] hover:underline">Terms</button> and{' '}
                <button className="text-[#00b4a0] hover:underline">Privacy Policy</button>
              </p>
            </>
          ) : (
            <>
              {/* OTP state */}
              <div className="text-center mb-2">
                <div className="w-14 h-14 bg-[#00b4a0]/10 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
                  📱
                </div>
                <p className="text-sm text-[#5a6a8a]">
                  Enter the 6-digit OTP sent to <span className="font-bold text-[#0d1b3e]">+91 {phone}</span>
                </p>
              </div>

              <OtpDigitInput otp={otp} setOtp={setOtp} />

              <div className="text-center mb-6">
                {resendTimer > 0 ? (
                  <p className="text-sm text-[#5a6a8a]">Resend OTP in <span className="font-bold text-[#0d2b6b]">{resendTimer}s</span></p>
                ) : (
                  <button
                    onClick={() => { setResendTimer(30); handleSendOtp() }}
                    className="text-sm font-semibold text-[#00b4a0] hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                onClick={handleVerify}
                disabled={loading || otp.join('').length < 6}
                className="w-full bg-[#22c36a] hover:bg-[#1aad5c] text-white font-bold py-3.5 rounded-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Verifying...
                  </>
                ) : (
                  '✓ Verify & Sign In'
                )}
              </button>

              <button
                onClick={() => { setOtpState('phone'); setOtp(['', '', '', '', '', '']) }}
                className="w-full mt-3 text-sm text-[#5a6a8a] hover:text-[#0d1b3e] transition-colors"
              >
                ← Change mobile number
              </button>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 mt-6">
          {[['2.5L+', 'Professionals'], ['50K+', 'Active Jobs'], ['98%', 'Placed']].map(([n, l]) => (
            <div key={l} className="text-center">
              <p className="font-bold text-[#0d2b6b] text-base">{n}</p>
              <p className="text-[#5a6a8a] text-xs">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const initialJobs = [
  { id: 1, title: 'Senior Cardiologist', hospital: 'Apollo Hospitals', location: 'New Delhi', type: 'Full-time', salary: '₹3.5L–₹6L/mo', exp: '8+ yrs', specialty: 'Doctors', logo: '🏥', posted: '2 days ago' },
  { id: 2, title: 'Staff Nurse — ICU', hospital: 'Fortis Healthcare', location: 'Mumbai', type: 'Full-time', salary: '₹35K–₹55K/mo', exp: '3+ yrs', specialty: 'Nurses', logo: '🏩', posted: '1 day ago' },
  { id: 3, title: 'Clinical Pharmacist', hospital: 'Medanta', location: 'Gurugram', type: 'Full-time', salary: '₹50K–₹80K/mo', exp: '2+ yrs', specialty: 'Pharmacy', logo: '🏨', posted: '3 days ago' },
  { id: 4, title: 'Radiologist (DNB)', hospital: 'Max Healthcare', location: 'Bangalore', type: 'Full-time', salary: '₹2L–₹4L/mo', exp: '5+ yrs', specialty: 'Radiology', logo: '🏦', posted: '1 week ago' },
  { id: 5, title: 'Physiotherapist', hospital: "Rainbow Children's Hospital", location: 'Hyderabad', type: 'Part-time', salary: '₹25K–₹40K/mo', exp: '2+ yrs', specialty: 'Allied', logo: '🏫', posted: '4 days ago' },
  { id: 6, title: 'Medical Lab Technician', hospital: 'Narayana Health', location: 'Chennai', type: 'Full-time', salary: '₹20K–₹35K/mo', exp: '1+ yr', specialty: 'Lab', logo: '🔬', posted: '5 days ago' },
  { id: 7, title: 'Psychiatrist', hospital: 'NIMHANS', location: 'Bangalore', type: 'Full-time', salary: '₹1.5L–₹3L/mo', exp: '5+ yrs', specialty: 'Doctors', logo: '🏥', posted: '6 days ago' },
  { id: 8, title: 'Pediatric Nurse', hospital: 'Rainbow Hospitals', location: 'Pune', type: 'Full-time', salary: '₹28K–₹45K/mo', exp: '2+ yrs', specialty: 'Nurses', logo: '🏩', posted: '3 days ago' },
  { id: 9, title: 'Emergency Medicine Doctor', hospital: 'Manipal Hospitals', location: 'Kolkata', type: 'Full-time', salary: '₹2L–₹3.5L/mo', exp: '4+ yrs', specialty: 'Doctors', logo: '🏥', posted: '2 days ago' },
  { id: 10, title: 'Dental Surgeon', hospital: 'Clove Dental', location: 'Delhi NCR', type: 'Full-time', salary: '₹60K–₹1.2L/mo', exp: '3+ yrs', specialty: 'Dental', logo: '🦷', posted: '1 week ago' },
  { id: 11, title: 'Dietitian & Nutritionist', hospital: 'SRV Hospital', location: 'Mumbai', type: 'Part-time', salary: '₹20K–₹35K/mo', exp: '1+ yr', specialty: 'Allied', logo: '🥗', posted: '5 days ago' },
  { id: 12, title: 'MRI Technologist', hospital: 'Kokilaben Hospital', location: 'Mumbai', type: 'Full-time', salary: '₹35K–₹55K/mo', exp: '3+ yrs', specialty: 'Radiology', logo: '🏦', posted: '4 days ago' },
]

export default function App() {
  const [page, setPage] = useState('home')
  const [seekerPhone, setSeekerPhone] = useState('')
  const [jobs, setJobs] = useState(initialJobs)
  const [employerProfile, setEmployerProfile] = useState<any>(null)

  // Load jobs from Supabase on mount
  useEffect(() => {
    async function loadJobs() {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('id', { ascending: false })
        if (!error && data && data.length > 0) {
          setJobs(data)
        }
      } catch (err) {
        console.error('Error fetching jobs:', err)
      }
    }
    loadJobs()
  }, [])

  const navigate = (p: string) => setPage(p)

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  // Intersection observer for section reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1 }
    )
    const elements = document.querySelectorAll('.section-reveal')
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [page])

  const noFooterPages = ['login', 'register', 'profile']

  const renderPage = () => {
    switch (page) {
      case 'home': 
        return (
          <HomePage 
            onNavigate={navigate} 
            jobs={jobs} 
            setJobs={setJobs} 
            employerProfile={employerProfile} 
            setEmployerProfile={setEmployerProfile} 
          />
        )
      case 'jobs': 
        return (
          <JobsPage 
            jobs={jobs} 
            seekerPhone={seekerPhone} 
            setSeekerPhone={setSeekerPhone} 
          />
        )
      case 'categories': return <CategoriesPage onNavigate={navigate} />
      case 'employers': 
        return (
          <EmployersPage 
            onNavigate={navigate} 
            jobs={jobs} 
            setJobs={setJobs} 
            employerProfile={employerProfile} 
            setEmployerProfile={setEmployerProfile} 
          />
        )
      case 'about': return <AboutPage />
      case 'login':
      case 'register':
        return (
          <JobSeekerLoginPage
            onSuccess={(phone) => {
              setSeekerPhone(phone)
              setPage('profile')
            }}
          />
        )
      case 'profile': return <ProfilePage phone={seekerPhone} onNavigate={navigate} />
      default: return <HomePage onNavigate={navigate} jobs={jobs} setJobs={setJobs} employerProfile={employerProfile} setEmployerProfile={setEmployerProfile} />
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar 
        activePage={page} 
        onNavigate={navigate} 
        seekerPhone={seekerPhone} 
        setSeekerPhone={setSeekerPhone} 
        employerProfile={employerProfile} 
        setEmployerProfile={setEmployerProfile} 
      />
      <main>{renderPage()}</main>
      {!noFooterPages.includes(page) && <Footer onNavigate={navigate} />}
      <AdminPanel onNavigate={navigate} />
    </div>
  )
}
