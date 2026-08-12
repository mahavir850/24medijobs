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
  initialStep?: 'pricing' | 'login'
}

function EmployersPage({ onNavigate, jobs, setJobs, employerProfile, setEmployerProfile, initialStep }: EmployersPageProps) {
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
          initialStep={initialStep}
        />
      </div>
    </div>
  )
}


function JobSeekerLoginPage({ onSuccess }: { onSuccess: (phone: string) => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register fields
  const [fullName, setFullName] = useState('');
  const [emailId, setEmailId] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [workStatus, setWorkStatus] = useState<'experienced' | 'fresher'>('experienced');
  const [allowPromotions, setAllowPromotions] = useState(true);
  
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      alert('Please fill out all credentials.');
      return;
    }
    setLoading(true);

    try {
      // Find matching seeker profile by email
      const { data, error } = await supabase
        .from('seeker_profiles')
        .select('*')
        .eq('email', loginEmail.trim())
        .maybeSingle();

      const phoneVal = data?.phone || mobileNumber || '9876543210';
      if (!error && data) {
        localStorage.setItem('seeker_phone', phoneVal);
        localStorage.setItem('seeker_basic_info', JSON.stringify({
          name: data.name,
          email: data.email,
          city: data.city || 'Patna',
          gender: data.gender || 'Male'
        }));
        localStorage.setItem('seeker_profile_completed', 'true');
      } else {
        // Fallback for demo
        localStorage.setItem('seeker_phone', phoneVal);
        localStorage.setItem('seeker_basic_info', JSON.stringify({
          name: loginEmail.split('@')[0],
          email: loginEmail,
          city: 'Patna',
          gender: 'Male'
        }));
      }
      onSuccess(phoneVal);
    } catch (err) {
      console.error(err);
      onSuccess('9876543210');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !emailId.trim() || !registerPassword.trim() || !mobileNumber.trim()) {
      alert('Please complete all registration fields.');
      return;
    }
    setLoading(true);

    try {
      // Create initial candidate entry in localstorage & Supabase
      const phoneVal = mobileNumber.replace(/\D/g, '');
      const seekerData = {
        id: phoneVal,
        phone: phoneVal,
        name: fullName,
        email: emailId,
        city: 'Patna',
        gender: 'Male'
      };

      await supabase.from('seeker_profiles').upsert(seekerData);

      localStorage.setItem('seeker_phone', phoneVal);
      localStorage.setItem('seeker_basic_info', JSON.stringify(seekerData));
      localStorage.setItem('seeker_profile_completed', 'false'); // Force profile wizard launch
      localStorage.setItem('seeker_is_new_register', 'true');

      onSuccess(phoneVal);
    } catch (err) {
      console.error('Registration error:', err);
      onSuccess(mobileNumber);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('seeker_phone', '9876543210');
      localStorage.setItem('seeker_basic_info', JSON.stringify({
        name: 'Google Candidate',
        email: 'candidate@gmail.com',
        city: 'Patna',
        gender: 'Male'
      }));
      onSuccess('9876543210');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f0f5ff] pt-28 pb-16 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden grid md:grid-cols-5 items-stretch">
        
        {/* Left Side Info Panel */}
        <div className="bg-[#0d2b6b] text-white p-8 md:col-span-2 flex flex-col justify-center space-y-8">
          <div>
            <LogoBadge size="lg" inverted className="mb-6" />
            <h2 className="text-2xl font-black tracking-wide">Naukri Candidate Portal</h2>
            <p className="text-white/70 text-xs mt-1.5 font-bold uppercase tracking-wider">India's No.1 Medical Job Platform</p>
          </div>

          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <span className="text-[#22c36a] text-lg mt-0.5">✓</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#22c36a]">Build your profile</p>
                <p className="text-[11px] text-white/75 mt-0.5">Let verified hospital recruiters discover your application instantly.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#22c36a] text-lg mt-0.5">✓</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#22c36a]">Custom Job Alerts</p>
                <p className="text-[11px] text-white/75 mt-0.5">Get matching clinical and medical postings sent directly to your inbox.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-[#22c36a] text-lg mt-0.5">✓</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#22c36a]">Grow Your Career</p>
                <p className="text-[11px] text-white/75 mt-0.5">Find high-paying emergency, ICU, dental, and pharmaceutical openings.</p>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest pt-5 border-t border-white/10">
            Trusted by 9 Cr+ candidates | 5 Lakh+ employers
          </p>
        </div>

        {/* Right Side Auth Forms */}
        <div className="p-8 md:col-span-3 flex flex-col justify-center">
          
          {mode === 'login' ? (
            // candidate login
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-xl font-black text-[#0d1b3e]">Login</h3>
                <p className="text-xs text-gray-400 mt-1">Access your candidate account dashboard</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Email ID / Username</label>
                  <input
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter email or username"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Password</label>
                    <a
                      href="https://www.naukri.com/nlogin/forgotpassword"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-black text-[#00b4a0] uppercase tracking-wider hover:underline"
                    >
                      Forgot Password?
                    </a>
                  </div>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0d2b6b] hover:bg-[#0d2b6b]/95 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <div className="flex items-center my-5">
                <div className="h-[1px] bg-gray-200 flex-1" />
                <span className="text-[10px] font-black text-gray-400 px-4 uppercase tracking-widest">or</span>
                <div className="h-[1px] bg-gray-200 flex-1" />
              </div>

              <button
                onClick={handleGoogleSignIn}
                className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span className="text-base">🌐</span> Sign in with Google
              </button>

              <p className="text-center text-xs text-gray-500 font-semibold pt-4">
                New to Naukri?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="text-[#00b4a0] hover:underline font-black cursor-pointer"
                >
                  Register here
                </button>
              </p>
            </div>
          ) : (
            // candidate register
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-xl font-black text-[#0d1b3e]">Create your Naukri profile</h3>
                <p className="text-xs text-gray-400 mt-1">Search & apply to jobs from India's No.1 Job Site</p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Full name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email ID</label>
                  <p className="text-[9px] text-gray-400 font-bold mb-1.5">We'll send relevant jobs and updates to this email</p>
                  <input
                    type="email"
                    required
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Password</label>
                  <p className="text-[9px] text-gray-400 font-bold mb-1.5">This helps your account stay protected</p>
                  <input
                    type="password"
                    required
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Mobile number</label>
                  <p className="text-[9px] text-gray-400 font-bold mb-1.5">Recruiters will contact you on this number</p>
                  <div className="flex gap-2">
                    <span className="px-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-xs text-gray-500 font-bold flex items-center shrink-0">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter mobile number"
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Work status</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setWorkStatus('experienced')}
                      className={`p-4 border rounded-2xl text-left cursor-pointer transition-all ${
                        workStatus === 'experienced'
                          ? 'border-[#0d2b6b] bg-[#0d2b6b]/5 text-[#0d2b6b]'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <p className="text-xs font-bold">I'm experienced</p>
                      <p className="text-[9px] text-gray-400 font-bold mt-1">I have work experience (excluding internships)</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setWorkStatus('fresher')}
                      className={`p-4 border rounded-2xl text-left cursor-pointer transition-all ${
                        workStatus === 'fresher'
                          ? 'border-[#0d2b6b] bg-[#0d2b6b]/5 text-[#0d2b6b]'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <p className="text-xs font-bold">I'm a fresher</p>
                      <p className="text-[9px] text-gray-400 font-bold mt-1">I am a student/ Haven't worked after graduation</p>
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-2 px-1">
                  <input
                    type="checkbox"
                    id="promo"
                    checked={allowPromotions}
                    onChange={(e) => setAllowPromotions(e.target.checked)}
                    className="mt-0.5 rounded accent-[#0d2b6b]"
                  />
                  <label htmlFor="promo" className="text-[10px] text-gray-500 font-semibold cursor-pointer">
                    Send me important updates & promotions via SMS, email, and WhatsApp
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#00b4a0] hover:bg-[#009888] text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md"
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </form>

              <p className="text-center text-xs text-gray-500 font-semibold pt-4">
                Already Registered?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-[#0d2b6b] hover:underline font-black cursor-pointer"
                >
                  Login here
                </button>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
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
            initialStep="pricing"
          />
        )
      case 'employers-login': 
        return (
          <EmployersPage 
            onNavigate={navigate} 
            jobs={jobs} 
            setJobs={setJobs} 
            employerProfile={employerProfile} 
            setEmployerProfile={setEmployerProfile} 
            initialStep="login"
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
