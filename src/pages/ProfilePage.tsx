import { useState, useEffect, useRef } from 'react'
import LogoBadge from '@/components/LogoBadge'
import { supabase } from '../supabaseClient'

interface ProfilePageProps {
  phone?: string
  onNavigate: (page: string) => void
}

export default function ProfilePage({ phone = '', onNavigate }: ProfilePageProps) {
  // Wizard steps: 'employment' | 'education' | 'preferences'
  const [step, setStep] = useState<'employment' | 'education' | 'preferences'>('employment')
  const [profileSaved, setProfileSaved] = useState<boolean>(() => {
    return localStorage.getItem('seeker_profile_completed') === 'true'
  })
  
  // Edit states for sections
  const [isEditingHeadline, setIsEditingHeadline] = useState(false)
  const [isEditingEmployment, setIsEditingEmployment] = useState(false)
  const [isEditingEducation, setIsEditingEducation] = useState(false)
  const [isEditingPreferences, setIsEditingPreferences] = useState(false)
  const [isEditingContact, setIsEditingContact] = useState(false)

  // Profile data states
  const [basic, setBasic] = useState({
    name: 'Google Candidate',
    email: 'candidate@gmail.com',
    phone: phone || '9876543210',
    gender: 'Male'
  })

  const [employment, setEmployment] = useState({
    isEmployed: 'Yes',
    experienceYears: '2-5 years',
    companyName: 'DigiPhlox',
    jobTitle: 'Flutter Developer',
    city: 'Patna',
    duration: '2021 to Present',
    salary: '₹ 5,64,000 per year',
    noticePeriod: '15 Days or less'
  })

  const [education, setEducation] = useState({
    qualification: 'Graduation/Diploma',
    course: 'B.Tech / B.E.',
    courseType: 'Full Time',
    specialization: 'Computer Science and Engineering (CSE)',
    university: 'Chandigarh University, Mohali',
    startYear: '2018',
    passYear: '2023'
  })

  const [preferences, setPreferences] = useState({
    headline: 'Flutter Developer with B.Tech / B.E. in Computer Science and Engineering (CSE) currently living in Patna',
    preferredLocations: ['Patna', 'Remote'],
    preferredSalary: '₹ 6,00,000 per year',
    gender: 'Male'
  })

  // Resume upload state
  const [resumeFileName, setResumeFileName] = useState<string>('My_Resume.pdf')
  const [resumeSize, setResumeSize] = useState<string>('145 KB')
  const [resumeUploaded, setResumeUploaded] = useState(true)
  const resumeInputRef = useRef<HTMLInputElement>(null)

  // Load saved details from LocalStorage or Supabase
  useEffect(() => {
    const phoneVal = phone || localStorage.getItem('seeker_phone') || '9876543210'
    
    // Check if new registration flag exists
    const isNewReg = localStorage.getItem('seeker_is_new_register') === 'true'
    if (isNewReg) {
      setProfileSaved(false)
      setStep('employment')
      localStorage.removeItem('seeker_is_new_register')
    }

    const loadData = async () => {
      // Local storage check
      const localBasic = localStorage.getItem('seeker_basic')
      const localEmp = localStorage.getItem('seeker_employment')
      const localEdu = localStorage.getItem('seeker_education')
      const localPref = localStorage.getItem('seeker_preferences')

      if (localBasic) setBasic(JSON.parse(localBasic))
      if (localEmp) setEmployment(JSON.parse(localEmp))
      if (localEdu) setEducation(JSON.parse(localEdu))
      if (localPref) setPreferences(JSON.parse(localPref))

      try {
        const { data, error } = await supabase
          .from('seeker_profiles')
          .select('*')
          .eq('id', phoneVal)
          .maybeSingle()

        if (!error && data) {
          if (data.name) setBasic(prev => ({ ...prev, name: data.name, email: data.email || prev.email, phone: data.phone || prev.phone }))
          if (data.current_hospital) {
            setEmployment(prev => ({
              ...prev,
              companyName: data.current_hospital,
              jobTitle: data.current_role || prev.jobTitle,
              experienceYears: data.experience || prev.experienceYears,
              city: data.city || prev.city
            }))
          }
          if (data.qualification) {
            setEducation(prev => ({
              ...prev,
              qualification: data.qualification,
              course: data.council || prev.course, // reusing council for course
              specialization: data.specialty || prev.specialization
            }))
          }
          if (data.bio) {
            setPreferences(prev => ({
              ...prev,
              headline: data.bio,
              preferredLocations: data.skills ? data.skills.split(', ') : prev.preferredLocations
            }))
          }
          setProfileSaved(true)
        }
      } catch (err) {
        console.error('Error loading Supabase seeker data:', err)
      }
    }

    loadData()
  }, [phone])

  const handleSaveToDb = async (updatedBasic = basic, updatedEmp = employment, updatedEdu = education, updatedPref = preferences) => {
    const phoneVal = phone || localStorage.getItem('seeker_phone') || '9876543210'
    
    // Save to local storage
    localStorage.setItem('seeker_basic', JSON.stringify(updatedBasic))
    localStorage.setItem('seeker_employment', JSON.stringify(updatedEmp))
    localStorage.setItem('seeker_education', JSON.stringify(updatedEdu))
    localStorage.setItem('seeker_preferences', JSON.stringify(updatedPref))
    localStorage.setItem('seeker_profile_completed', 'true')

    try {
      const seekerData = {
        id: phoneVal,
        phone: phoneVal,
        name: updatedBasic.name,
        email: updatedBasic.email,
        dob: '1998-05-12',
        gender: updatedPref.gender,
        city: updatedEmp.city,
        state: 'Bihar',
        pincode: '800001',
        avatar: '',
        specialty: updatedEdu.specialization,
        qualification: updatedEdu.qualification,
        experience: updatedEmp.experienceYears,
        current_role: updatedEmp.jobTitle,
        current_hospital: updatedEmp.companyName,
        registration_number: updatedEmp.noticePeriod,
        council: updatedEdu.course,
        skills: updatedPref.preferredLocations.join(', '),
        bio: updatedPref.headline,
        resume_name: resumeFileName,
        resume_url: ''
      }

      await supabase.from('seeker_profiles').upsert(seekerData)
    } catch (err) {
      console.error('Error saving candidate profile:', err)
    }
  }

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setResumeFileName(file.name)
      setResumeSize((file.size / 1024).toFixed(0) + ' KB')
      setResumeUploaded(true)
    }
  }

  // ── WIZARD SUBMIT ──
  const handleWizardSubmit = () => {
    handleSaveToDb()
    setProfileSaved(true)
  }

  // Location suggestions
  const locationSuggestions = ['Bengaluru', 'Mumbai', 'Pune', 'Chennai', 'Hyderabad', 'Gurugram', 'Noida', 'Ahmedabad', 'Kolkata', 'Delhi / NCR', 'Remote']

  // ── VIEW: WIZARD FLOW ──
  if (!profileSaved) {
    return (
      <div className="min-h-screen bg-[#f0f5ff] pt-24 pb-12 flex items-center justify-center px-4">
        <div className="w-full max-w-3xl bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
          
          {/* Header Indicators */}
          <div className="bg-[#0d2b6b] text-white p-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-black">Configure Candidate Profile</h2>
              <p className="text-[10px] text-white/70 font-bold uppercase tracking-wider mt-0.5">Let Medical Recruiters Find You</p>
            </div>
            <span className="bg-[#00b4a0] text-white text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              {step === 'employment' && 'Step 1 of 3: Employment'}
              {step === 'education' && 'Step 2 of 3: Education'}
              {step === 'preferences' && 'Step 3 of 3: Preferences'}
            </span>
          </div>

          <div className="p-8">
            {/* Step 1: Employment */}
            {step === 'employment' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-black text-[#0d1b3e]">Employment Details</h3>
                  <p className="text-xs text-gray-400">These details help recruiters identify your professional experience</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Are you currently employed?</label>
                    <div className="flex gap-3">
                      {['Yes', 'No'].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setEmployment({ ...employment, isEmployed: status })}
                          className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            employment.isEmployed === status
                              ? 'bg-[#0d2b6b] text-white'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Total work experience</label>
                    <input
                      type="text"
                      value={employment.experienceYears}
                      onChange={(e) => setEmployment({ ...employment, experienceYears: e.target.value })}
                      placeholder="e.g. 3 years, 6 months"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
                    />
                  </div>

                  {employment.isEmployed === 'Yes' && (
                    <>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Company name</label>
                        <input
                          type="text"
                          value={employment.companyName}
                          onChange={(e) => setEmployment({ ...employment, companyName: e.target.value })}
                          placeholder="e.g. DigiPhlox"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Current job title</label>
                        <input
                          type="text"
                          value={employment.jobTitle}
                          onChange={(e) => setEmployment({ ...employment, jobTitle: e.target.value })}
                          placeholder="e.g. Flutter Developer"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current City</label>
                    <p className="text-[9px] text-gray-400 font-bold mb-1.5">This helps recruiters know your location preferences</p>
                    <input
                      type="text"
                      value={employment.city}
                      onChange={(e) => setEmployment({ ...employment, city: e.target.value })}
                      placeholder="e.g. Patna"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Duration</label>
                    <input
                      type="text"
                      value={employment.duration}
                      onChange={(e) => setEmployment({ ...employment, duration: e.target.value })}
                      placeholder="e.g. 2021 to Present"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Annual salary</label>
                    <input
                      type="text"
                      value={employment.salary}
                      onChange={(e) => setEmployment({ ...employment, salary: e.target.value })}
                      placeholder="e.g. ₹ 5,64,000 per year"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Notice period</label>
                    <select
                      value={employment.noticePeriod}
                      onChange={(e) => setEmployment({ ...employment, noticePeriod: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors bg-white text-gray-700"
                    >
                      <option>15 Days or less</option>
                      <option>30 Days</option>
                      <option>45 Days</option>
                      <option>2 Months</option>
                      <option>3 Months</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setStep('education')}
                    className="bg-[#0d2b6b] hover:bg-[#00b4a0] text-white font-bold px-8 py-3 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Save and continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Education */}
            {step === 'education' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-black text-[#0d1b3e]">Education Details</h3>
                  <p className="text-xs text-gray-400">These details help recruiters identify your background</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Highest qualification</label>
                    <input
                      type="text"
                      value={education.qualification}
                      onChange={(e) => setEducation({ ...education, qualification: e.target.value })}
                      placeholder="e.g. Graduation/Diploma"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Course</label>
                    <input
                      type="text"
                      value={education.course}
                      onChange={(e) => setEducation({ ...education, course: e.target.value })}
                      placeholder="e.g. B.Tech / B.E."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Course type</label>
                    <select
                      value={education.courseType}
                      onChange={(e) => setEducation({ ...education, courseType: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors bg-white text-gray-700"
                    >
                      <option>Full Time</option>
                      <option>Part Time</option>
                      <option>Correspondence</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Specialization</label>
                    <input
                      type="text"
                      value={education.specialization}
                      onChange={(e) => setEducation({ ...education, specialization: e.target.value })}
                      placeholder="e.g. Computer Science and Engineering (CSE)"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">University / Institute</label>
                    <input
                      type="text"
                      value={education.university}
                      onChange={(e) => setEducation({ ...education, university: e.target.value })}
                      placeholder="e.g. Chandigarh University, Mohali"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Starting year</label>
                      <input
                        type="text"
                        value={education.startYear}
                        onChange={(e) => setEducation({ ...education, startYear: e.target.value })}
                        placeholder="e.g. 2018"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Passing year</label>
                      <input
                        type="text"
                        value={education.passYear}
                        onChange={(e) => setEducation({ ...education, passYear: e.target.value })}
                        placeholder="e.g. 2023"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setStep('employment')}
                    className="border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('preferences')}
                    className="bg-[#0d2b6b] hover:bg-[#00b4a0] text-white font-bold px-8 py-3 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Save and continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Headline & Preferences */}
            {step === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-black text-[#0d1b3e]">Add Headline & Preferences</h3>
                  <p className="text-xs text-gray-400">Make your profile stronger to get more relevant job recommendations</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Resume headline</label>
                    <textarea
                      value={preferences.headline}
                      onChange={(e) => setPreferences({ ...preferences, headline: e.target.value })}
                      placeholder="Enter resume headline..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors resize-none mb-2"
                    />
                    <div>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide mb-1.5">Suggestions:</p>
                      <button
                        type="button"
                        onClick={() => setPreferences({
                          ...preferences,
                          headline: `Flutter Developer with B.Tech / B.E. in Computer Science and Engineering (CSE) currently living in Patna`
                        })}
                        className="text-left p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-[10px] text-gray-600 font-semibold border border-gray-100 cursor-pointer"
                      >
                        Flutter Developer with B.Tech / B.E. in Computer Science and Engineering (CSE) currently living in Patna
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Preferred work locations (Maximum 10)</label>
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {preferences.preferredLocations.map((loc) => (
                        <span key={loc} className="bg-[#00b4a0]/10 text-[#00b4a0] border border-[#00b4a0]/20 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                          {loc}
                          <button
                            type="button"
                            onClick={() => setPreferences({
                              ...preferences,
                              preferredLocations: preferences.preferredLocations.filter(l => l !== loc)
                            })}
                            className="text-red-500 hover:text-red-700 font-bold text-xs"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide mb-1.5">Suggestions:</p>
                    <div className="flex flex-wrap gap-1">
                      {locationSuggestions.map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => {
                            if (!preferences.preferredLocations.includes(loc) && preferences.preferredLocations.length < 10) {
                              setPreferences({
                                ...preferences,
                                preferredLocations: [...preferences.preferredLocations, loc]
                              });
                            }
                          }}
                          className="px-2.5 py-1 rounded-full text-[9px] font-bold bg-[#f0f5ff] hover:bg-blue-100 text-[#0d2b6b] border border-transparent cursor-pointer"
                        >
                          + {loc}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Preferred salary (per year)</label>
                    <div className="flex gap-2">
                      <span className="px-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-xs text-gray-500 font-bold flex items-center">
                        ₹
                      </span>
                      <input
                        type="text"
                        value={preferences.preferredSalary}
                        onChange={(e) => setPreferences({ ...preferences, preferredSalary: e.target.value })}
                        placeholder="e.g. 5,64,000"
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Gender</label>
                    <div className="flex gap-3">
                      {['Male', 'Female', 'Transgender'].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setPreferences({ ...preferences, gender: g })}
                          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            preferences.gender === g
                              ? 'bg-[#0d2b6b] text-white'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setStep('education')}
                    className="border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleWizardSubmit}
                    className="bg-[#22c36a] hover:bg-[#1aad5c] text-white font-bold px-10 py-3 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md"
                  >
                    Submit Profile
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    )
  }

  // ── VIEW: PROFILE DASHBOARD (OWN PROFILE VIEW) ──
  return (
    <div className="min-h-screen bg-[#f0f5ff] pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        
        {/* Left Side: Avatar, Name & Contact info */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0d2b6b] to-[#00b4a0]" />
            
            <div className="w-24 h-24 rounded-full bg-[#f0f5ff] border-4 border-blue-50 mx-auto flex items-center justify-center text-3xl shadow-sm mb-4">
              👤
            </div>

            <div className="border-b border-gray-100 pb-4 mb-4">
              {isEditingContact ? (
                <div className="space-y-2 text-left">
                  <input
                    type="text"
                    value={basic.name}
                    onChange={(e) => setBasic({ ...basic, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-semibold"
                  />
                  <input
                    type="email"
                    value={basic.email}
                    onChange={(e) => setBasic({ ...basic, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-semibold"
                  />
                  <button
                    onClick={() => {
                      setIsEditingContact(false)
                      handleSaveToDb(basic)
                    }}
                    className="w-full bg-[#00b4a0] hover:bg-[#009888] text-white font-bold py-1.5 rounded-lg text-[10px] uppercase"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-black text-[#0d1b3e] flex items-center justify-center gap-1.5">
                    {basic.name}
                    <button onClick={() => setIsEditingContact(true)} className="text-gray-400 hover:text-[#00b4a0] text-xs">
                      ✏️
                    </button>
                  </h2>
                  <p className="text-[10px] bg-[#00b4a0]/15 text-[#00b4a0] font-black px-3 py-0.5 rounded-full inline-block mt-1 uppercase tracking-wider">Candidate</p>
                </>
              )}
            </div>

            <div className="text-left space-y-3 text-xs">
              <div className="flex items-center gap-2 text-gray-500 font-semibold">
                <span className="text-sm">📞</span>
                <span>+91 {basic.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 font-semibold truncate">
                <span className="text-sm">📧</span>
                <span>{basic.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 font-semibold">
                <span className="text-sm">📍</span>
                <span>{employment.city || 'Patna'}, Bihar</span>
              </div>
            </div>
          </div>

          {/* Resume Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl">
            <h3 className="text-xs font-black text-[#0d1b3e] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex items-center justify-between">
              <span>📄 Candidate Resume</span>
              {resumeUploaded && (
                <span className="text-[#22c36a] text-[10px] font-black">ACTIVE</span>
              )}
            </h3>

            {resumeUploaded ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-green-50/50 p-3 border border-green-100 rounded-2xl">
                  <div className="text-2xl">📄</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-gray-700 truncate">{resumeFileName}</p>
                    <p className="text-[9px] text-gray-400">{resumeSize}</p>
                  </div>
                </div>
                <button
                  onClick={() => resumeInputRef.current?.click()}
                  className="w-full border border-[#00b4a0] text-[#00b4a0] hover:bg-[#00b4a0] hover:text-white font-bold py-2.5 rounded-xl text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                >
                  Replace Resume
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-gray-400 mb-3">No resume uploaded</p>
                <button
                  onClick={() => resumeInputRef.current?.click()}
                  className="bg-[#00b4a0] hover:bg-[#009888] text-white font-bold px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider cursor-pointer"
                >
                  Upload File
                </button>
              </div>
            )}
            <input ref={resumeInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeChange} />
          </div>
        </div>

        {/* Right Side: Editable Sections */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Resume Headline Section */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl relative">
            <h3 className="text-xs font-black text-[#0d1b3e] uppercase tracking-wider mb-3 pb-2 border-b border-gray-100 flex justify-between items-center">
              <span>📝 Resume Headline</span>
              <button
                onClick={() => setIsEditingHeadline(!isEditingHeadline)}
                className="text-[#00b4a0] hover:underline text-[10px] font-bold uppercase cursor-pointer"
              >
                {isEditingHeadline ? 'Cancel' : 'Edit'}
              </button>
            </h3>

            {isEditingHeadline ? (
              <div className="space-y-3">
                <textarea
                  value={preferences.headline}
                  onChange={(e) => setPreferences({ ...preferences, headline: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-[#0d2b6b] resize-none"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setIsEditingHeadline(false)
                      handleSaveToDb(basic, employment, education, preferences)
                    }}
                    className="bg-[#0d2b6b] hover:bg-[#00b4a0] text-white font-bold px-6 py-2 rounded-xl text-[10px] uppercase cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs font-bold text-gray-600 leading-relaxed italic">
                "{preferences.headline}"
              </p>
            )}
          </div>

          {/* Employment Details Section */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl">
            <h3 className="text-xs font-black text-[#0d1b3e] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex justify-between items-center">
              <span>💼 Employment Profile</span>
              <button
                onClick={() => setIsEditingEmployment(!isEditingEmployment)}
                className="text-[#00b4a0] hover:underline text-[10px] font-bold uppercase cursor-pointer"
              >
                {isEditingEmployment ? 'Cancel' : 'Edit'}
              </button>
            </h3>

            {isEditingEmployment ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Company name</label>
                  <input
                    type="text"
                    value={employment.companyName}
                    onChange={(e) => setEmployment({ ...employment, companyName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Job title</label>
                  <input
                    type="text"
                    value={employment.jobTitle}
                    onChange={(e) => setEmployment({ ...employment, jobTitle: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Work experience</label>
                  <input
                    type="text"
                    value={employment.experienceYears}
                    onChange={(e) => setEmployment({ ...employment, experienceYears: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Salary</label>
                  <input
                    type="text"
                    value={employment.salary}
                    onChange={(e) => setEmployment({ ...employment, salary: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Notice period</label>
                  <input
                    type="text"
                    value={employment.noticePeriod}
                    onChange={(e) => setEmployment({ ...employment, noticePeriod: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-semibold"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setIsEditingEmployment(false)
                      handleSaveToDb(basic, employment, education, preferences)
                    }}
                    className="bg-[#0d2b6b] hover:bg-[#00b4a0] text-white font-bold px-6 py-2 rounded-xl text-[10px] uppercase cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Current Employer</p>
                  <p className="font-bold text-gray-700 mt-1">{employment.companyName || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Designation</p>
                  <p className="font-bold text-gray-700 mt-1">{employment.jobTitle || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Experience</p>
                  <p className="font-bold text-gray-700 mt-1">{employment.experienceYears}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Current Salary</p>
                  <p className="font-bold text-gray-700 mt-1">{employment.salary}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Notice Period</p>
                  <p className="font-bold text-gray-700 mt-1">{employment.noticePeriod}</p>
                </div>
              </div>
            )}
          </div>

          {/* Education Details Section */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl">
            <h3 className="text-xs font-black text-[#0d1b3e] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex justify-between items-center">
              <span>🎓 Education Background</span>
              <button
                onClick={() => setIsEditingEducation(!isEditingEducation)}
                className="text-[#00b4a0] hover:underline text-[10px] font-bold uppercase cursor-pointer"
              >
                {isEditingEducation ? 'Cancel' : 'Edit'}
              </button>
            </h3>

            {isEditingEducation ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Qualification</label>
                  <input
                    type="text"
                    value={education.qualification}
                    onChange={(e) => setEducation({ ...education, qualification: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Course</label>
                  <input
                    type="text"
                    value={education.course}
                    onChange={(e) => setEducation({ ...education, course: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Specialization</label>
                  <input
                    type="text"
                    value={education.specialization}
                    onChange={(e) => setEducation({ ...education, specialization: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">University / Institute</label>
                  <input
                    type="text"
                    value={education.university}
                    onChange={(e) => setEducation({ ...education, university: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-semibold"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setIsEditingEducation(false)
                      handleSaveToDb(basic, employment, education, preferences)
                    }}
                    className="bg-[#0d2b6b] hover:bg-[#00b4a0] text-white font-bold px-6 py-2 rounded-xl text-[10px] uppercase cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Highest Qualification</p>
                  <p className="font-bold text-gray-700 mt-1">{education.qualification}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Course / Specialization</p>
                  <p className="font-bold text-gray-700 mt-1">{education.course} ({education.specialization})</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">University / College</p>
                  <p className="font-bold text-gray-700 mt-1">{education.university}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Course Type</p>
                  <p className="font-bold text-gray-700 mt-1">{education.courseType}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Duration</p>
                  <p className="font-bold text-gray-700 mt-1">{education.startYear} - {education.passYear}</p>
                </div>
              </div>
            )}
          </div>

          {/* Preferences Section */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl">
            <h3 className="text-xs font-black text-[#0d1b3e] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex justify-between items-center">
              <span>🎯 Job Preferences</span>
              <button
                onClick={() => setIsEditingPreferences(!isEditingPreferences)}
                className="text-[#00b4a0] hover:underline text-[10px] font-bold uppercase cursor-pointer"
              >
                {isEditingPreferences ? 'Cancel' : 'Edit'}
              </button>
            </h3>

            {isEditingPreferences ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Preferred Locations (Comma separated)</label>
                  <input
                    type="text"
                    value={preferences.preferredLocations.join(', ')}
                    onChange={(e) => setPreferences({ ...preferences, preferredLocations: e.target.value.split(',').map(s => s.trim()) })}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Preferred Salary</label>
                  <input
                    type="text"
                    value={preferences.preferredSalary}
                    onChange={(e) => setPreferences({ ...preferences, preferredSalary: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs font-semibold"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setIsEditingPreferences(false)
                      handleSaveToDb(basic, employment, education, preferences)
                    }}
                    className="bg-[#0d2b6b] hover:bg-[#00b4a0] text-white font-bold px-6 py-2 rounded-xl text-[10px] uppercase cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Preferred work locations</p>
                  <p className="font-bold text-gray-700 mt-1">{preferences.preferredLocations.join(', ')}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Expected Salary</p>
                  <p className="font-bold text-gray-700 mt-1">{preferences.preferredSalary}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Gender</p>
                  <p className="font-bold text-gray-700 mt-1">{preferences.gender}</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
