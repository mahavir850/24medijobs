import { useState, useRef, useEffect } from 'react'
import LogoBadge from '@/components/LogoBadge'
import { supabase } from '../supabaseClient'

interface ProfilePageProps {
  phone?: string
  onNavigate: (page: string) => void
}

export default function ProfilePage({ phone = '', onNavigate }: ProfilePageProps) {
  // Wizard steps state
  const [step, setStep] = useState<'basic' | 'professional' | 'resume' | 'done'>('basic')
  const [avatar, setAvatar] = useState<string | null>(null)
  const [resumeFileName, setResumeFileName] = useState<string>('My_Resume.pdf')
  const [resumeSize, setResumeSize] = useState<string>('145 KB')
  const [resumeUploaded, setResumeUploaded] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const resumeInputRef = useRef<HTMLInputElement>(null)

  // Profile data state
  const [basic, setBasic] = useState({
    name: '',
    email: '',
    dob: '1995-08-15',
    gender: 'male' as 'male' | 'female' | 'other' | 'not_specified',
    city: '',
    state: '',
    pincode: '',
  })

  const [professional, setProfessional] = useState({
    specialty: '',
    qualification: '',
    experience: '',
    currentRole: '',
    currentHospital: '',
    skills: '',
    bio: '',
    registrationNumber: '',
    council: '',
  })

  // Mode state: Display vs Wizard vs Edit Mode
  const [profileSaved, setProfileSaved] = useState<boolean>(() => {
    return localStorage.getItem('seeker_profile_completed') === 'true'
  })
  const [isEditMode, setIsEditMode] = useState<boolean>(false)

  // Load profile data from local storage on mount
  useEffect(() => {
    const savedBasic = localStorage.getItem('seeker_basic_info')
    const savedProf = localStorage.getItem('seeker_professional_info')
    const savedAvatar = localStorage.getItem('seeker_avatar')
    const savedResume = localStorage.getItem('seeker_resume_uploaded')
    const savedResumeName = localStorage.getItem('seeker_resume_name')

    if (savedBasic) setBasic(JSON.parse(savedBasic))
    if (savedProf) setProfessional(JSON.parse(savedProf))
    if (savedAvatar) setAvatar(savedAvatar)
    if (savedResume === 'true') setResumeUploaded(true)
    if (savedResumeName) setResumeFileName(savedResumeName)
  }, [])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string
        setAvatar(dataUrl)
        localStorage.setItem('seeker_avatar', dataUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setResumeFileName(file.name)
      setResumeSize((file.size / 1024).toFixed(0) + ' KB')
      localStorage.setItem('seeker_resume_name', file.name)
      setTimeout(() => {
        setResumeUploaded(true)
        localStorage.setItem('seeker_resume_uploaded', 'true')
      }, 1200)
    }
  }

  const handleSaveWizard = async () => {
    localStorage.setItem('seeker_basic_info', JSON.stringify(basic))
    localStorage.setItem('seeker_professional_info', JSON.stringify(professional))
    localStorage.setItem('seeker_profile_completed', 'true')

    try {
      const seekerData = {
        id: phone || localStorage.getItem('seeker_phone') || '',
        phone: phone || localStorage.getItem('seeker_phone') || '',
        name: basic.name,
        email: basic.email,
        dob: basic.dob,
        gender: basic.gender,
        city: basic.city,
        state: basic.state,
        pincode: basic.pincode,
        avatar: avatar || '',
        specialty: professional.specialty,
        qualification: professional.qualification,
        experience: professional.experience,
        current_role: professional.currentRole,
        current_hospital: professional.currentHospital,
        registration_number: professional.registrationNumber,
        council: professional.council,
        skills: professional.skills,
        bio: professional.bio,
        resume_name: resumeFileName,
        resume_url: ''
      }
      await supabase.from('seeker_profiles').upsert(seekerData)
    } catch (err) {
      console.error('Error saving profile to Supabase:', err)
    }

    setProfileSaved(true)
    setIsEditMode(false)
  }

  const handleUpdateProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!basic.name || !basic.email || !basic.city || !professional.specialty || !professional.qualification) {
      alert('Please fill in all mandatory fields marked with *')
      return
    }
    localStorage.setItem('seeker_basic_info', JSON.stringify(basic))
    localStorage.setItem('seeker_professional_info', JSON.stringify(professional))
    localStorage.setItem('seeker_profile_completed', 'true')

    try {
      const seekerData = {
        id: phone || localStorage.getItem('seeker_phone') || '',
        phone: phone || localStorage.getItem('seeker_phone') || '',
        name: basic.name,
        email: basic.email,
        dob: basic.dob,
        gender: basic.gender,
        city: basic.city,
        state: basic.state,
        pincode: basic.pincode,
        avatar: avatar || '',
        specialty: professional.specialty,
        qualification: professional.qualification,
        experience: professional.experience,
        current_role: professional.currentRole,
        current_hospital: professional.currentHospital,
        registration_number: professional.registrationNumber,
        council: professional.council,
        skills: professional.skills,
        bio: professional.bio,
        resume_name: resumeFileName,
        resume_url: ''
      }
      await supabase.from('seeker_profiles').upsert(seekerData)
    } catch (err) {
      console.error('Error updating profile in Supabase:', err)
    }

    setProfileSaved(true)
    setIsEditMode(false)
    alert('🎉 Profile updated successfully!')
  }

  const steps = [
    { id: 'basic', label: 'Basic Info', icon: '👤' },
    { id: 'professional', label: 'Professional', icon: '🩺' },
    { id: 'resume', label: 'Resume', icon: '📄' },
    { id: 'done', label: 'Done', icon: '✅' },
  ]

  const stepIndex = steps.findIndex((s) => s.id === step)
  const progress = ((stepIndex + 1) / steps.length) * 100

  // ── VIEW: Profile Dashboard (Displaying saved details) ──
  const renderProfileDashboard = () => {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header Dashboard Profile Banner */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#00b4a0]/15 shrink-0 bg-[#f0f5ff] flex items-center justify-center text-3xl shadow-sm relative">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>👤</span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#0d1b3e] flex items-center justify-center sm:justify-start gap-2">
                  {basic.name}
                  <span className="bg-[#00b4a0]/15 text-[#00b4a0] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Candidate</span>
                </h1>
                <p className="text-[#5a6a8a] text-sm font-semibold font-mono mt-0.5">📞 +91 {phone || '98765 43210'}</p>
                <p className="text-xs text-gray-400 mt-1">📍 {basic.city}, {basic.state || 'India'}</p>
              </div>
            </div>
            <div className="flex gap-3 w-full sm:w-auto shrink-0 justify-center">
              <button
                onClick={() => setIsEditMode(true)}
                className="bg-[#0d2b6b] hover:bg-[#00b4a0] text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm shadow-md flex items-center gap-1.5"
              >
                ✏️ Edit Profile
              </button>
              <button
                onClick={() => onNavigate('jobs')}
                className="bg-[#00b4a0] hover:bg-[#009888] text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm shadow-md"
              >
                Find Jobs
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar Details Card */}
            <div className="space-y-6">
              {/* Personal Details */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-[#0d1b3e] text-base mb-4 border-b border-gray-100 pb-2">Personal Information</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 font-semibold">Email Address</p>
                    <p className="font-semibold text-gray-700 mt-0.5">{basic.email || 'Not filled'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold">Date of Birth</p>
                    <p className="font-semibold text-gray-700 mt-0.5">{basic.dob || 'Not filled'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold">Gender</p>
                    <p className="font-semibold text-gray-700 mt-0.5 uppercase">{basic.gender || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold">Pincode</p>
                    <p className="font-semibold text-gray-700 mt-0.5">{basic.pincode || 'Not filled'}</p>
                  </div>
                </div>
              </div>

              {/* Resume Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-[#0d1b3e] text-base mb-4 border-b border-gray-100 pb-2">Uploaded Resume</h3>
                {resumeUploaded ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 bg-green-50/50 p-3 rounded-xl border border-green-100">
                      <div className="text-3xl">📄</div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-gray-700 truncate">{resumeFileName}</p>
                        <p className="text-[10px] text-gray-400">{resumeSize}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => resumeInputRef.current?.click()} 
                      className="w-full text-center text-xs font-semibold text-[#00b4a0] border border-[#00b4a0] py-2.5 rounded-xl hover:bg-[#00b4a0] hover:text-white transition-all"
                    >
                      Replace Resume PDF
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-400 mb-3">No resume uploaded</p>
                    <button 
                      onClick={() => resumeInputRef.current?.click()} 
                      className="text-xs font-bold text-white bg-[#00b4a0] px-4 py-2.5 rounded-xl hover:bg-[#009888] transition-colors"
                    >
                      Upload Resume
                    </button>
                  </div>
                )}
                <input ref={resumeInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeChange} />
              </div>
            </div>

            {/* Main Profile Info Grid */}
            <div className="lg:col-span-2 space-y-6">
              {/* Credentials / Details */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-[#0d1b3e] mb-6 border-b border-gray-100 pb-3 flex items-center gap-1.5">
                  <span>🩺</span> Professional Credentials
                </h2>

                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-5">
                  <div>
                    <p className="text-xs text-gray-400 font-semibold">Medical Specialty</p>
                    <p className="font-bold text-[#0d1b3e] text-sm mt-1">{professional.specialty || 'Not filled'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold">Highest Qualification</p>
                    <p className="font-bold text-[#0d1b3e] text-sm mt-1">{professional.qualification || 'Not filled'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold">Years of Experience</p>
                    <p className="font-bold text-[#0d1b3e] text-sm mt-1">{professional.experience || 'Not filled'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold">Current Role / Designation</p>
                    <p className="font-bold text-[#0d1b3e] text-sm mt-1">{professional.currentRole || 'Not filled'}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs text-gray-400 font-semibold">Current Hospital / Institution</p>
                    <p className="font-bold text-[#0d1b3e] text-sm mt-1">{professional.currentHospital || 'Not filled'}</p>
                  </div>
                </div>
              </div>

              {/* License Registration */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-[#0d1b3e] mb-6 border-b border-gray-100 pb-3 flex items-center gap-1.5">
                  <span>📜</span> Registration details
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-gray-400 font-semibold">Medical Registration No.</p>
                    <p className="font-bold text-[#0d1b3e] text-sm mt-1 font-mono">{professional.registrationNumber || 'Not verified'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold">Registration Council</p>
                    <p className="font-bold text-[#0d1b3e] text-sm mt-1">{professional.council || 'Not selected'}</p>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-[#0d1b3e] mb-4 border-b border-gray-100 pb-3">Key Skills & Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {professional.skills ? (
                    professional.skills.split(',').map((skill) => (
                      <span key={skill.trim()} className="text-xs font-semibold px-3.5 py-2 bg-[#00b4a0]/10 text-[#00b4a0] rounded-xl border border-[#00b4a0]/15">
                        {skill.trim()}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">No skills added</span>
                  )}
                </div>
              </div>

              {/* Bio Summary */}
              {professional.bio && (
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
                  <h2 className="text-xl font-bold text-[#0d1b3e] mb-4 border-b border-gray-100 pb-3">Professional Summary</h2>
                  <div className="border-l-4 border-[#00b4a0] pl-4 italic text-[#5a6a8a] text-sm leading-relaxed">
                    "{professional.bio}"
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── VIEW: Unified Edit Form ──
  const renderEditProfileForm = () => {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-[#0d1b3e]">Edit Profile Details</h2>
                <p className="text-xs text-gray-500 mt-1">Keep your details updated so hospitals can hire you</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditMode(false)}
                className="text-sm font-semibold text-gray-500 hover:text-[#0d2b6b]"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleUpdateProfileSubmit} className="space-y-6">
              {/* Profile Pic Upload */}
              <div className="flex flex-col items-center gap-3 mb-6">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-full bg-[#f0f5ff] border-2 border-dashed border-[#00b4a0] flex items-center justify-center cursor-pointer overflow-hidden relative group shadow-inner"
                >
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-2">
                      <span className="text-3xl">👤</span>
                      <p className="text-[10px] text-[#00b4a0] font-semibold mt-1">Upload Photo</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
                    <span className="text-white text-xs font-semibold">Change</span>
                  </div>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                <p className="text-xs text-[#5a6a8a] font-medium">Profile Photo</p>
              </div>

              {/* Basic Section */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3 border-l-4 border-[#00b4a0] pl-2 uppercase tracking-wider">Basic Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={basic.name}
                      onChange={(e) => setBasic(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b4a0] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      required
                      value={basic.email}
                      onChange={(e) => setBasic(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b4a0] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      value={phone || '9876543210'}
                      readOnly
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
                    <input
                      type="date"
                      value={basic.dob}
                      onChange={(e) => setBasic(prev => ({ ...prev, dob: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b4a0] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
                    <select
                      value={basic.gender}
                      onChange={(e) => setBasic(prev => ({ ...prev, gender: e.target.value as any }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b4a0] transition-colors bg-white text-gray-700"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="not_specified">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">City <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={basic.city}
                      onChange={(e) => setBasic(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b4a0] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
                    <select
                      value={basic.state}
                      onChange={(e) => setBasic(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b4a0] transition-colors bg-white text-gray-700"
                    >
                      <option value="">Select State</option>
                      {['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Gujarat', 'Rajasthan', 'West Bengal', 'Uttar Pradesh', 'Punjab', 'Haryana', 'Kerala', 'Madhya Pradesh', 'Bihar'].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Professional Credentials Section */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-bold text-gray-700 mb-3 border-l-4 border-[#00b4a0] pl-2 uppercase tracking-wider">Professional details</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Medical Specialty <span className="text-red-500">*</span></label>
                    <select
                      value={professional.specialty}
                      onChange={(e) => setProfessional(prev => ({ ...prev, specialty: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b4a0] transition-colors bg-white text-gray-700"
                    >
                      <option value="">Select Specialty</option>
                      {['Doctor / Physician', 'Nurse', 'Pharmacist', 'Lab Technician', 'Radiologist', 'Physiotherapist', 'Dentist', 'Psychiatrist', 'Pediatrician', 'Emergency Medicine', 'Medical Administration', 'Allied Health'].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Highest Qualification <span className="text-red-500">*</span></label>
                    <select
                      value={professional.qualification}
                      onChange={(e) => setProfessional(prev => ({ ...prev, qualification: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b4a0] transition-colors bg-white text-gray-700"
                    >
                      <option value="">Select Qualification</option>
                      {['MBBS', 'MD', 'MS', 'DNB', 'GNM', 'B.Sc Nursing', 'M.Sc Nursing', 'B.Pharm', 'M.Pharm', 'BMLT', 'DMLT', 'BPT', 'MPT', 'BDS', 'MDS', 'BAMS', 'BHMS'].map((q) => (
                        <option key={q}>{q}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Years of Experience <span className="text-red-500">*</span></label>
                    <select
                      value={professional.experience}
                      onChange={(e) => setProfessional(prev => ({ ...prev, experience: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b4a0] transition-colors bg-white text-gray-700"
                    >
                      <option value="">Select Experience</option>
                      <option>Fresher (0 years)</option>
                      <option>1 year</option>
                      <option>2–3 years</option>
                      <option>4–6 years</option>
                      <option>7–10 years</option>
                      <option>10+ years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Role / Designation</label>
                    <input
                      type="text"
                      value={professional.currentRole}
                      onChange={(e) => setProfessional(prev => ({ ...prev, currentRole: e.target.value }))}
                      placeholder="e.g. Senior Resident Doctor"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b4a0] transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Hospital / Institution</label>
                    <input
                      type="text"
                      value={professional.currentHospital}
                      onChange={(e) => setProfessional(prev => ({ ...prev, currentHospital: e.target.value }))}
                      placeholder="e.g. Apollo Hospitals"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b4a0] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* License Registration Section */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-bold text-gray-700 mb-3 border-l-4 border-[#00b4a0] pl-2 uppercase tracking-wider">Registration details</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Medical Registration No.</label>
                    <input
                      type="text"
                      value={professional.registrationNumber}
                      onChange={(e) => setProfessional(prev => ({ ...prev, registrationNumber: e.target.value }))}
                      placeholder="e.g. MH-12345"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b4a0] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Registration Council</label>
                    <select
                      value={professional.council}
                      onChange={(e) => setProfessional(prev => ({ ...prev, council: e.target.value }))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b4a0] transition-colors bg-white text-gray-700"
                    >
                      <option value="">Select Council</option>
                      {['Medical Council of India (NMC)', 'Indian Nursing Council', 'Pharmacy Council of India', 'Dental Council of India', 'State Medical Council', 'Other'].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-bold text-gray-700 mb-1 border-l-4 border-[#00b4a0] pl-2 uppercase tracking-wider">Skills</h3>
                <label className="block text-xs text-gray-400 mb-2">Add your key expertise, separated by commas</label>
                <input
                  type="text"
                  value={professional.skills}
                  onChange={(e) => setProfessional(prev => ({ ...prev, skills: e.target.value }))}
                  placeholder="e.g. ECG, Cardiology, ICU Management, Patient Care"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b4a0] transition-colors"
                />
              </div>

              {/* Bio Summary Section */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-bold text-gray-700 mb-2 border-l-4 border-[#00b4a0] pl-2 uppercase tracking-wider">Professional Summary</h3>
                <textarea
                  value={professional.bio}
                  onChange={(e) => setProfessional(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Write a brief description..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b4a0] transition-colors resize-none"
                />
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditMode(false)}
                  className="flex-1 border border-gray-300 text-gray-600 font-semibold py-3.5 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#00b4a0] hover:bg-[#009888] text-white font-bold py-3.5 rounded-xl transition-colors shadow-md hover:shadow-lg text-sm"
                >
                  Update Profile Details
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Render Seeker Profile View Dashboard
  if (profileSaved && !isEditMode) {
    return renderProfileDashboard()
  }

  // Render Seeker Profile Unified Edit Form
  if (profileSaved && isEditMode) {
    return renderEditProfileForm()
  }

  // ── VIEW: Seeker Multi-Step Profile Wizard (For first time profile setup) ──
  return (
    <div className="min-h-screen bg-[#f0f5ff] pt-20">
      {/* Header */}
      <div className="hero-bg py-10 px-4">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
          <LogoBadge size="lg" inverted className="mb-5" />
          <h1 className="text-3xl font-bold text-white mb-1">Complete Your Profile</h1>
          <p className="text-white/70 text-sm">Help hospitals find you faster — fill in your medical credentials</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Step indicators */}
        <div className="flex items-center gap-1 mb-8">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className={`flex items-center gap-2 shrink-0 ${i <= stepIndex ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                  i < stepIndex ? 'bg-[#22c36a] border-[#22c36a] text-white'
                  : i === stepIndex ? 'bg-[#00b4a0] border-[#00b4a0] text-white'
                  : 'bg-white border-gray-200 text-gray-400'
                }`}>
                  {i < stepIndex ? '✓' : s.icon}
                </div>
                <span className={`hidden sm:block text-xs font-semibold ${i === stepIndex ? 'text-[#00b4a0]' : 'text-[#5a6a8a]'}`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 rounded transition-all ${i < stepIndex ? 'bg-[#22c36a]' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#00b4a0] to-[#22c36a] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* ── STEP: Basic Info ── */}
        {step === 'basic' && (
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#0d1b3e] mb-1">Basic Information</h2>
            <p className="text-[#5a6a8a] text-sm mb-6">Tell us about yourself</p>

            {/* Avatar upload */}
            <div className="flex items-center gap-5 mb-7">
              <div
                className="w-20 h-20 rounded-full bg-[#f0f5ff] border-2 border-dashed border-[#00b4a0] flex items-center justify-center cursor-pointer overflow-hidden relative group"
                onClick={() => fileInputRef.current?.click()}
              >
                {avatar ? (
                  <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <div className="text-2xl">👤</div>
                    <div className="text-[10px] text-[#00b4a0] mt-1">Upload</div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center transition-opacity">
                  <span className="text-white text-xs">Change</span>
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              <div>
                <p className="font-semibold text-[#0d1b3e] text-sm mb-1">Profile Photo</p>
                <p className="text-[#5a6a8a] text-xs">JPG, PNG. Max 5MB. Clear, professional photo recommended.</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 text-xs font-semibold text-[#00b4a0] hover:underline"
                >
                  Upload Photo
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#0d1b3e] mb-1.5">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={basic.name}
                  onChange={(e) => setBasic((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Dr. Rajesh Kumar"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b4a0] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0d1b3e] mb-1.5">Email Address <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={basic.email}
                  onChange={(e) => setBasic((p) => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b4a0] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0d1b3e] mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={phone || '98765 43210'}
                  readOnly
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0d1b3e] mb-1.5">Date of Birth</label>
                <input
                  type="date"
                  value={basic.dob}
                  onChange={(e) => setBasic((p) => ({ ...p, dob: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b4a0] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0d1b3e] mb-1.5">Gender</label>
                <select
                  value={basic.gender}
                  onChange={(e) => setBasic((p) => ({ ...p, gender: e.target.value as any }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b4a0] transition-colors text-gray-600 bg-white"
                >
                  <option value="not_specified">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0d1b3e] mb-1.5">City <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={basic.city}
                  onChange={(e) => setBasic((p) => ({ ...p, city: e.target.value }))}
                  placeholder="Mumbai"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b4a0] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0d1b3e] mb-1.5">State</label>
                <select
                  value={basic.state}
                  onChange={(e) => setBasic((p) => ({ ...p, state: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b4a0] transition-colors text-gray-600 bg-white"
                >
                  <option value="">Select State</option>
                  {['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Gujarat', 'Rajasthan', 'West Bengal', 'Uttar Pradesh', 'Punjab', 'Haryana', 'Kerala', 'Madhya Pradesh', 'Bihar'].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-5 border-t border-gray-100">
              <button
                onClick={() => basic.name && setStep('professional')}
                disabled={!basic.name || !basic.city}
                className="bg-[#0d2b6b] hover:bg-[#00b4a0] text-white font-bold px-8 py-3 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Continue
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: Professional Info ── */}
        {step === 'professional' && (
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#0d1b3e] mb-1">Professional Details</h2>
            <p className="text-[#5a6a8a] text-sm mb-6">Your medical credentials and experience</p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#0d1b3e] mb-1.5">Medical Specialty <span className="text-red-500">*</span></label>
                <select
                  value={professional.specialty}
                  onChange={(e) => setProfessional((p) => ({ ...p, specialty: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b4a0] transition-colors text-gray-600 bg-white"
                >
                  <option value="">Select Specialty</option>
                  {['Doctor / Physician', 'Nurse', 'Pharmacist', 'Lab Technician', 'Radiologist', 'Physiotherapist', 'Dentist', 'Psychiatrist', 'Pediatrician', 'Emergency Medicine', 'Medical Administration', 'Allied Health'].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0d1b3e] mb-1.5">Highest Qualification <span className="text-red-500">*</span></label>
                <select
                  value={professional.qualification}
                  onChange={(e) => setProfessional((p) => ({ ...p, qualification: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b4a0] transition-colors text-gray-600 bg-white"
                >
                  <option value="">Select Qualification</option>
                  {['MBBS', 'MD', 'MS', 'DNB', 'GNM', 'B.Sc Nursing', 'M.Sc Nursing', 'B.Pharm', 'M.Pharm', 'BMLT', 'DMLT', 'BPT', 'MPT', 'BDS', 'MDS', 'BAMS', 'BHMS'].map((q) => (
                    <option key={q}>{q}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0d1b3e] mb-1.5">Years of Experience <span className="text-red-500">*</span></label>
                <select
                  value={professional.experience}
                  onChange={(e) => setProfessional((p) => ({ ...p, experience: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b4a0] transition-colors text-gray-600 bg-white"
                >
                  <option value="">Select Experience</option>
                  <option>Fresher (0 years)</option>
                  <option>1 year</option>
                  <option>2–3 years</option>
                  <option>4–6 years</option>
                  <option>7–10 years</option>
                  <option>10+ years</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0d1b3e] mb-1.5">Current Role / Designation</label>
                <input
                  type="text"
                  value={professional.currentRole}
                  onChange={(e) => setProfessional((p) => ({ ...p, currentRole: e.target.value }))}
                  placeholder="e.g. Senior Resident Doctor"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b4a0] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0d1b3e] mb-1.5">Current Hospital / Institution</label>
                <input
                  type="text"
                  value={professional.currentHospital}
                  onChange={(e) => setProfessional((p) => ({ ...p, currentHospital: e.target.value }))}
                  placeholder="e.g. Apollo Hospitals, Delhi"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b4a0] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0d1b3e] mb-1.5">Medical Registration No.</label>
                <input
                  type="text"
                  value={professional.registrationNumber}
                  onChange={(e) => setProfessional((p) => ({ ...p, registrationNumber: e.target.value }))}
                  placeholder="e.g. MH-12345"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b4a0] transition-colors"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#0d1b3e] mb-1.5">Registration Council</label>
                <select
                  value={professional.council}
                  onChange={(e) => setProfessional((p) => ({ ...p, council: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b4a0] transition-colors text-gray-600 bg-white"
                >
                  <option value="">Select Council</option>
                  {['Medical Council of India (NMC)', 'Indian Nursing Council', 'Pharmacy Council of India', 'Dental Council of India', 'State Medical Council', 'Other'].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#0d1b3e] mb-1.5">Key Skills / Expertise</label>
                <input
                  type="text"
                  value={professional.skills}
                  onChange={(e) => setProfessional((p) => ({ ...p, skills: e.target.value }))}
                  placeholder="e.g. Cardiac catheterization, ECHO, ECG, BCLS, ACLS..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b4a0] transition-colors"
                />
                <p className="text-xs text-[#5a6a8a] mt-1">Comma-separated. These appear as tags on your profile.</p>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-[#0d1b3e] mb-1.5">Professional Summary</label>
                <textarea
                  value={professional.bio}
                  onChange={(e) => setProfessional((p) => ({ ...p, bio: e.target.value }))}
                  placeholder="Brief description of your experience, achievements, and what makes you the right candidate..."
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00b4a0] transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex justify-between mt-6 pt-5 border-t border-gray-100">
              <button
                onClick={() => setStep('basic')}
                className="border-2 border-gray-200 text-gray-600 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-all"
              >
                ← Back
              </button>
              <button
                onClick={() => professional.specialty && setStep('resume')}
                disabled={!professional.specialty || !professional.qualification}
                className="bg-[#0d2b6b] hover:bg-[#00b4a0] text-white font-bold px-8 py-3 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: Resume Upload ── */}
        {step === 'resume' && (
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#0d1b3e] mb-1">Upload Your Resume</h2>
            <p className="text-[#5a6a8a] text-sm mb-6">A strong resume gets you 3x more interview calls</p>

            {/* Upload box */}
            <div
              onClick={() => resumeInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 mb-6 ${
                resumeUploaded
                  ? 'border-[#22c36a] bg-green-50'
                  : 'border-[#00b4a0] bg-[#f0f5ff] hover:bg-[#e8f0ff]'
              }`}
            >
              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleResumeChange}
              />
              {resumeUploaded ? (
                <>
                  <div className="w-16 h-16 bg-[#22c36a] rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4 animate-bounce">
                    ✓
                  </div>
                  <p className="font-bold text-[#22c36a] text-lg mb-1">Resume Uploaded!</p>
                  <p className="text-[#5a6a8a] text-sm">{resumeFileName}</p>
                  <p className="text-[#5a6a8a] text-xs mt-1">{resumeSize}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); setResumeUploaded(false); }}
                    className="mt-3 text-xs text-[#00b4a0] hover:underline"
                  >
                    Replace file
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-[#00b4a0]/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                    📄
                  </div>
                  <p className="font-bold text-[#0d1b3e] text-base mb-2">Drop your resume here</p>
                  <p className="text-[#5a6a8a] text-sm mb-4">PDF, DOC, DOCX — Max 5MB</p>
                  <span className="inline-block bg-[#0d2b6b] text-white text-sm font-semibold px-6 py-2.5 rounded-xl">
                    Browse Files
                  </span>
                </>
              )}
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
              <h4 className="font-bold text-[#0d2b6b] text-sm mb-2">💡 Resume Tips for Healthcare Professionals</h4>
              <ul className="text-[#5a6a8a] text-xs space-y-1.5">
                <li>• Include your Medical Registration Number prominently</li>
                <li>• List all certifications: BCLS, ACLS, NRP, etc.</li>
                <li>• Mention your specializations and key procedures performed</li>
                <li>• Include hospital affiliations and bed strengths</li>
                <li>• Keep it 2 pages max — hiring managers scan quickly</li>
              </ul>
            </div>

            <div className="flex justify-between mt-6 pt-5 border-t border-gray-100">
              <button
                onClick={() => setStep('professional')}
                className="border-2 border-gray-200 text-gray-600 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-all"
              >
                ← Back
              </button>
              <button
                onClick={() => {
                  handleSaveWizard()
                  setStep('done')
                }}
                className="bg-[#0d2b6b] hover:bg-[#00b4a0] text-white font-bold px-8 py-3 rounded-xl transition-all flex items-center gap-2"
              >
                {resumeUploaded ? 'Complete Profile →' : 'Skip for Now →'}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: Done ── */}
        {step === 'done' && (
          <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center">
            <div className="w-24 h-24 bg-[#22c36a] rounded-full flex items-center justify-center text-white text-5xl mx-auto mb-6 animate-bounce">
              🎉
            </div>
            <h2 className="text-2xl font-bold text-[#0d1b3e] mb-3">Profile Complete!</h2>
            <p className="text-[#5a6a8a] mb-2 text-sm max-w-md mx-auto">
              Your 24medijobs profile is live. Hospitals and healthcare organizations can now discover you.
            </p>
            <p className="text-[#00b4a0] font-semibold text-sm mb-8">
              You're now visible to 12,000+ hiring hospitals across India! 🏥
            </p>

            {/* Profile completion bar */}
            <div className="bg-[#f0f5ff] rounded-xl p-4 mb-8 text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-[#0d1b3e] text-sm">Profile Completion</span>
                <span className="font-bold text-[#00b4a0]">{resumeUploaded ? '92%' : '75%'}</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00b4a0] to-[#22c36a] rounded-full transition-all duration-1000"
                  style={{ width: resumeUploaded ? '92%' : '75%' }}
                />
              </div>
            </div>

            <button
              onClick={() => onNavigate('jobs')}
              className="bg-[#0d2b6b] hover:bg-[#00b4a0] text-white font-bold px-10 py-4 rounded-xl transition-all text-lg shadow-lg"
            >
              Start Browsing Jobs →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
