import { useState } from 'react'
import LogoBadge from '@/components/LogoBadge'
import { supabase } from '../supabaseClient'

const allJobs = [
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

const specialtyFilters = ['All', 'Doctors', 'Nurses', 'Pharmacy', 'Radiology', 'Allied', 'Lab', 'Dental']
const locationFilters = ['All India', 'Delhi NCR', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata']

interface JobsPageProps {
  jobs?: any[]
  seekerPhone?: string
  setSeekerPhone?: (phone: string) => void
}

export default function JobsPage({ 
  jobs = allJobs, 
  seekerPhone = '', 
  setSeekerPhone 
}: JobsPageProps) {
  const [search, setSearch] = useState('')
  const [specialty, setSpecialty] = useState('All')
  const [locationFilter, setLocationFilter] = useState('All India')
  const [saved, setSaved] = useState<number[]>([])
  const [selectedJob, setSelectedJob] = useState<any | null>(null)

  // Candidate Apply states
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [modalPhone, setModalPhone] = useState('')
  const [modalOtp, setModalOtp] = useState(['', '', '', '', '', ''])
  const [otpSent, setOtpSent] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [activeJobForApply, setActiveJobForApply] = useState<any | null>(null)
  const [appliedList, setAppliedList] = useState<number[]>(() => {
    const savedApplied = localStorage.getItem('seeker_applied_jobs')
    return savedApplied ? JSON.parse(savedApplied) : []
  })

  const filtered = jobs.filter((job) => {
    const matchSearch = !search || job.title.toLowerCase().includes(search.toLowerCase()) || job.hospital.toLowerCase().includes(search.toLowerCase())
    const matchSpecialty = specialty === 'All' || job.specialty === specialty
    const matchLocation = locationFilter === 'All India' || job.location.includes(locationFilter.replace(' NCR', ''))
    return matchSearch && matchSpecialty && matchLocation
  })

  const toggleSave = (id: number) => {
    setSaved((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  const handleApplyClick = async (job: any) => {
    if (appliedList.includes(job.id)) return

    if (seekerPhone) {
      try {
        await supabase
          .from('applications')
          .insert({
            job_id: job.id,
            seeker_phone: seekerPhone
          })
      } catch (err) {
        console.error('Error sending application to Supabase:', err)
      }
      const newList = [...appliedList, job.id]
      setAppliedList(newList)
      localStorage.setItem('seeker_applied_jobs', JSON.stringify(newList))
      alert(`🎉 Application submitted successfully for ${job.title} at ${job.hospital}!`)
    } else {
      setActiveJobForApply(job)
      setShowLoginModal(true)
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f5ff] pt-20">
      {/* Search header */}
      <div className="hero-bg py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <LogoBadge size="xl" inverted className="mx-auto mb-5" />
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Medical Job Listings</h1>
            <p className="text-white/70 text-sm">50,000+ verified healthcare opportunities across India</p>
          </div>
          <div className="bg-white rounded-2xl p-3 shadow-xl flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs, hospitals, specialties..."
              className="flex-1 px-4 py-2.5 text-sm text-gray-700 outline-none"
            />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-4 py-2.5 text-sm text-gray-600 outline-none border-l border-gray-100 bg-white"
            >
              {locationFilters.map((l) => <option key={l}>{l}</option>)}
            </select>
            <button className="bg-[#00b4a0] hover:bg-[#009888] text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Specialty filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {specialtyFilters.map((f) => (
            <button
              key={f}
              onClick={() => setSpecialty(f)}
              className={`text-sm font-medium px-5 py-2.5 rounded-xl shrink-0 transition-all duration-200 ${
                specialty === f ? 'bg-[#0d2b6b] text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 shadow-sm'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Job list */}
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-[#5a6a8a] text-sm font-semibold">{filtered.length} jobs found</p>
              {seekerPhone && (
                <span className="text-xs text-[#00b4a0] font-bold bg-[#00b4a0]/10 px-3 py-1 rounded-full">
                  Logged in as +91 {seekerPhone}
                </span>
              )}
            </div>
            {filtered.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`bg-white rounded-2xl p-5 cursor-pointer border-2 transition-all duration-200 card-hover ${
                  selectedJob?.id === job.id ? 'border-[#00b4a0] shadow-lg' : 'border-transparent'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl shrink-0 overflow-hidden shadow-inner border border-gray-50">
                    {job.logo && job.logo.length > 4 ? (
                      <img src={job.logo} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      job.logo || '🏥'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-[#0d1b3e] mb-0.5 group-hover:text-[#00b4a0] transition-colors">{job.title}</h3>
                        <p className="text-[#5a6a8a] text-sm font-medium">{job.hospital}</p>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); toggleSave(job.id) }} className="shrink-0">
                        <svg className={`w-5 h-5 ${saved.includes(job.id) ? 'text-[#00b4a0] fill-[#00b4a0]' : 'text-gray-300'}`} viewBox="0 0 24 24" stroke="currentColor" fill="none">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-3 text-xs text-[#5a6a8a] font-medium">
                      <span>📍 {job.location}</span>
                      <span>⏱ {job.type}</span>
                      <span>💰 {job.salary}</span>
                      <span>🎓 {job.exp}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <span className="text-xs text-[#5a6a8a] font-medium">Posted {job.posted}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleApplyClick(job) }}
                    className={`text-xs font-bold px-4 py-2 rounded-xl transition-all border ${
                      appliedList.includes(job.id) 
                        ? 'bg-green-50 text-[#22c36a] border-[#22c36a]/30 cursor-default font-semibold' 
                        : 'bg-[#0d2b6b] hover:bg-[#00b4a0] text-white border-transparent shadow-sm'
                    }`}
                  >
                    {appliedList.includes(job.id) ? 'Applied ✓' : 'Apply Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Job detail panel */}
          <div className="lg:w-96 shrink-0">
            {selectedJob ? (
              <div className="bg-white rounded-2xl p-6 sticky top-24 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl shrink-0 overflow-hidden border border-gray-50">
                    {selectedJob.logo && selectedJob.logo.length > 4 ? (
                      <img src={selectedJob.logo} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      selectedJob.logo || '🏥'
                    )}
                  </div>
                  <div>
                    <h2 className="font-bold text-[#0d1b3e] text-lg leading-tight">{selectedJob.title}</h2>
                    <p className="text-[#5a6a8a] text-sm font-semibold">{selectedJob.hospital}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {[
                    { label: 'Location', value: selectedJob.location },
                    { label: 'Job Type', value: selectedJob.type },
                    { label: 'Salary', value: selectedJob.salary },
                    { label: 'Experience', value: selectedJob.exp },
                    { label: 'Specialty', value: selectedJob.specialty },
                    { label: 'Posted', value: selectedJob.posted },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-[#5a6a8a] text-sm font-medium">{item.label}</span>
                      <span className="font-semibold text-[#0d1b3e] text-sm">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-[#f0f5ff] rounded-xl p-4 mb-6">
                  <h4 className="font-bold text-[#0d1b3e] text-sm mb-2">About the Role</h4>
                  <p className="text-[#5a6a8a] text-xs leading-relaxed">
                    We are looking for an experienced {selectedJob.title} to join our team at {selectedJob.hospital}.
                    The ideal candidate will have {selectedJob.exp} of experience in {selectedJob.specialty} and will work in
                    a collaborative, patient-centered environment. Competitive compensation and benefits package offered.
                  </p>
                </div>

                <button 
                  onClick={() => handleApplyClick(selectedJob)}
                  className={`w-full font-bold py-3.5 rounded-xl transition-all duration-200 mb-3 ${
                    appliedList.includes(selectedJob.id)
                      ? 'bg-[#22c36a] text-white cursor-default opacity-90'
                      : 'bg-[#0d2b6b] hover:bg-[#00b4a0] text-white shadow-md'
                  }`}
                >
                  {appliedList.includes(selectedJob.id) ? '✓ Applied Successfully' : 'Apply Now'}
                </button>
                <button className="w-full border-2 border-gray-200 text-gray-500 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 text-sm">
                  Save Job
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 sticky top-24 shadow-sm">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="font-bold text-[#0d1b3e] mb-2 text-lg">Select a job to view details</h3>
                <p className="text-[#5a6a8a] text-sm leading-relaxed">Click on any job listing to see full details and apply</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inline Seeker Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-[#0d1b3e]/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative border border-gray-100">
            <button 
              onClick={() => {
                setShowLoginModal(false)
                setOtpSent(false)
                setModalPhone('')
                setModalOtp(['', '', '', '', '', ''])
              }} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold p-1 transition-colors"
            >
              ×
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-[#00b4a0]/10 rounded-full flex items-center justify-center text-xl mx-auto mb-3">👤</div>
              <h3 className="text-xl font-bold text-[#0d1b3e]">Candidate Login</h3>
              <p className="text-xs text-gray-500 mt-1">Please login to apply for <span className="font-semibold text-[#00b4a0]">{activeJobForApply?.title}</span></p>
            </div>
            
            {!otpSent ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Mobile Number</label>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1 px-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-xs text-gray-600 font-bold shrink-0 font-mono">🇮🇳 +91</div>
                    <input 
                      type="tel"
                      value={modalPhone}
                      onChange={(e) => setModalPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="98765 43210"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#00b4a0] text-sm font-semibold tracking-widest outline-none"
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (modalPhone.length < 10) return
                    setModalLoading(true)
                    setTimeout(() => {
                      setModalLoading(false)
                      setOtpSent(true)
                    }, 1200)
                  }}
                  disabled={modalLoading || modalPhone.length < 10}
                  className="w-full bg-[#0d2b6b] hover:bg-[#00b4a0] text-white font-bold py-3.5 rounded-xl transition-all duration-300 disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {modalLoading ? 'Sending OTP...' : 'Get OTP →'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-[#5a6a8a] text-center font-medium">Enter 6-digit OTP sent to <span className="font-bold text-[#0d1b3e]">+91 {modalPhone}</span></p>
                <div className="flex gap-1.5 justify-center my-3">
                  {modalOtp.map((digit, i) => (
                    <input
                      key={i}
                      id={`modal-otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '')
                        if (!/^\d?$/.test(val)) return
                        const next = [...modalOtp]
                        next[i] = val
                        setModalOtp(next)
                        if (val && i < 5) {
                          const nextInput = document.getElementById(`modal-otp-${i + 1}`) as HTMLInputElement
                          nextInput?.focus()
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !modalOtp[i] && i > 0) {
                          const prev = document.getElementById(`modal-otp-${i - 1}`) as HTMLInputElement
                          prev?.focus()
                        }
                      }}
                      className={`w-10 h-12 text-center text-lg font-bold border-2 rounded-xl outline-none transition-all ${
                        digit ? 'border-[#00b4a0] bg-[#00b4a0]/5 text-[#0d1b3e]' : 'border-gray-200 text-gray-400'
                      } focus:border-[#00b4a0]`}
                    />
                  ))}
                </div>
                <button
                  onClick={async () => {
                    const code = modalOtp.join('')
                    if (code.length < 6) return
                    setModalLoading(true)
                    
                    try {
                      const { data: seekerProfile } = await supabase
                        .from('seeker_profiles')
                        .select('*')
                        .eq('id', modalPhone)
                        .maybeSingle()

                      if (seekerProfile) {
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
                      
                      localStorage.setItem('seeker_phone', modalPhone)
                      if (setSeekerPhone) setSeekerPhone(modalPhone)
                      
                      if (activeJobForApply) {
                        await supabase
                          .from('applications')
                          .insert({
                            job_id: activeJobForApply.id,
                            seeker_phone: modalPhone
                          })
                        const newList = [...appliedList, activeJobForApply.id]
                        setAppliedList(newList)
                        localStorage.setItem('seeker_applied_jobs', JSON.stringify(newList))
                        alert(`🎉 Logged in and Applied successfully for ${activeJobForApply.title}!`)
                      }
                    } catch (err) {
                      console.error('Error logging in seeker:', err)
                    } finally {
                      setModalLoading(false)
                      setShowLoginModal(false)
                      setOtpSent(false)
                      setModalPhone('')
                      setModalOtp(['', '', '', '', '', ''])
                    }
                  }}
                  disabled={modalLoading || modalOtp.join('').length < 6}
                  className="w-full bg-[#22c36a] hover:bg-[#1aad5c] text-white font-bold py-3.5 rounded-xl transition-all duration-300 disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {modalLoading ? 'Verifying...' : '✓ Verify & Apply'}
                </button>
                <button 
                  onClick={() => { setOtpSent(false); setModalOtp(['', '', '', '', '', '']); }}
                  className="w-full text-center text-xs text-[#5a6a8a] hover:text-[#0d1b3e] transition-colors"
                >
                  ← Change phone number
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
