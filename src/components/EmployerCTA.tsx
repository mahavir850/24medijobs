// EmployerCTA.tsx - Custom Employer Profile & Filtered Jobs Dashboard
import { useEffect, useRef, useState } from 'react';
import { supabase } from '../supabaseClient';

// ===================== EMPLOYER LOGIN COMPONENT =====================
const EmployerLogin = ({ onLogin }: { onLogin: (phone: string) => void }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = () => {
    if (!phone || phone.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowOtp(true);
    }, 1500);
  };

  const handleVerifyOtp = () => {
    if (!otp || otp.length < 4) {
      alert('Please enter a valid OTP');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(phone);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f0f5ff] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#0d1b3e]">Employer Login</h1>
          <p className="text-gray-500 text-sm mt-2">Post jobs and find the best medical talent</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
            <div className="flex gap-2">
              <div className="flex items-center gap-1 px-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-600 font-semibold shrink-0">
                🇮🇳 +91
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#00b4a0] transition-colors text-sm font-semibold tracking-wider"
                placeholder="Enter mobile number"
                disabled={showOtp}
              />
            </div>
          </div>
          {showOtp && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#00b4a0] transition-colors text-center text-lg font-bold tracking-widest"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
              />
              <p className="text-xs text-gray-500 mt-2">OTP sent to +91 {phone}</p>
              <button 
                onClick={handleSendOtp} 
                className="text-xs text-[#00b4a0] mt-1 hover:underline font-semibold"
              >
                Resend OTP
              </button>
            </div>
          )}
          <button
            onClick={showOtp ? handleVerifyOtp : handleSendOtp}
            disabled={isLoading || (!showOtp && phone.length < 10) || (showOtp && otp.length < 6)}
            className="w-full bg-[#0d2b6b] hover:bg-[#00b4a0] text-white font-bold py-3.5 rounded-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Please wait...' : showOtp ? '✓ Verify OTP' : 'Send OTP →'}
          </button>
        </div>
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

// ===================== EMPLOYER PROFILE & VERIFICATION COMPONENT =====================
const EmployerProfileSetup = ({ onNext, onBack }: { onNext: (data: any) => void; onBack: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    email: '',
    businessName: '',
    businessType: 'private_limited' as 'sole_proprietorship' | 'partnership' | 'private_limited' | 'public_limited' | 'llp' | 'other',
    gstNumber: '',
    panNumber: '',
    aadharNumber: '',
  });
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setProfilePic(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.designation || !formData.businessName || !formData.email) {
      alert('Please fill out all required fields marked with *');
      return;
    }
    if (!profilePic) {
      alert('Please upload an employer profile photo or hospital/company logo');
      return;
    }
    // Document validation
    if (!formData.gstNumber && !formData.panNumber && !formData.aadharNumber) {
      alert('Please provide at least one valid business document (GST, PAN, or Aadhar)');
      return;
    }
    if (formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.toUpperCase())) {
      alert('Please enter a valid PAN number (Format: ABCDE1234F)');
      return;
    }
    if (formData.aadharNumber && !/^\d{12}$/.test(formData.aadharNumber)) {
      alert('Please enter a valid 12-digit Aadhar number');
      return;
    }

    onNext({ ...formData, logo: profilePic });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-[#0d1b3e] mb-2 text-center">Complete Employer Profile</h2>
          <p className="text-gray-500 text-sm mb-8 text-center">
            Set up your credentials and verify your account to post medical jobs
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Pic Upload */}
            <div className="flex flex-col items-center gap-3 mb-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-full bg-[#f0f5ff] border-2 border-dashed border-[#00b4a0] flex items-center justify-center cursor-pointer overflow-hidden relative group shadow-inner"
              >
                {profilePic ? (
                  <img src={profilePic} alt="Employer Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-2">
                    <span className="text-3xl">🏥</span>
                    <p className="text-[10px] text-[#00b4a0] font-semibold mt-1">Upload Photo</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
                  <span className="text-white text-xs font-semibold">Change</span>
                </div>
              </div>
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handlePicChange} 
              />
              <p className="text-xs text-[#5a6a8a] font-medium">Profile Photo / Hospital Logo <span className="text-red-500">*</span></p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Representative Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Dr. Rajesh Kumar"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#00b4a0] transition-colors text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Designation <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.designation}
                  onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                  placeholder="e.g. Head of HR / Medical Supt."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#00b4a0] transition-colors text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hospital / Company Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                  placeholder="e.g. Apollo Hospitals / Fortis"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#00b4a0] transition-colors text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Company Type <span className="text-red-500">*</span></label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessType: e.target.value as any }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#00b4a0] transition-colors text-sm text-gray-700 outline-none"
                >
                  <option value="private_limited">Hospital / Clinic (Private Limited)</option>
                  <option value="public_limited">Hospital / Trust (Public Limited)</option>
                  <option value="partnership">Partnership Clinic</option>
                  <option value="sole_proprietorship">Sole Proprietorship Practitioner</option>
                  <option value="llp">LLP / Healthcare Consultant</option>
                  <option value="other">Other Healthcare Entity</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Representative Email Address <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="hr@apollohospitals.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#00b4a0] transition-colors text-sm outline-none"
                />
              </div>
            </div>

            {/* Document details */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-sm font-bold text-gray-700 mb-2">Business Verification Documents</h3>
              <p className="text-xs text-gray-500 mb-4">Please provide at least one of the following documents to verify your business</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">GST Number</label>
                  <input
                    type="text"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, gstNumber: e.target.value.toUpperCase() }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#00b4a0] transition-colors text-sm outline-none"
                    placeholder="e.g. 22ABCDE1234F1Z5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">PAN Card Number</label>
                  <input
                    type="text"
                    value={formData.panNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, panNumber: e.target.value.toUpperCase() }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#00b4a0] transition-colors text-sm outline-none"
                    placeholder="e.g. ABCDE1234F"
                    maxLength={10}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Aadhar Card Number</label>
                  <input
                    type="text"
                    value={formData.aadharNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, aadharNumber: e.target.value.replace(/\D/g, '') }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#00b4a0] transition-colors text-sm outline-none"
                    placeholder="e.g. 12-digit Aadhar Number"
                    maxLength={12}
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-xs text-blue-700 leading-relaxed">
                <span className="font-semibold">Security Note:</span> Your profile photo and verification details are securely stored. Only jobs created by this verified hospital profile will display these details.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button" 
                onClick={onBack} 
                className="flex-1 px-6 py-3.5 border border-gray-300 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button 
                type="submit" 
                className="flex-1 px-6 py-3.5 bg-[#00b4a0] hover:bg-[#009888] text-white rounded-xl font-bold transition-colors shadow-md hover:shadow-lg animate-pulse"
              >
                Save Profile & Setup Dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ===================== EMPLOYER DASHBOARD COMPONENT =====================
const EmployerDashboard = ({ 
  profile, 
  jobs, 
  onPostJob, 
  onLogout 
}: { 
  profile: any; 
  jobs: any[]; 
  onPostJob: () => void; 
  onLogout: () => void; 
}) => {
  const myJobs = jobs.filter(job => job.hospital.toLowerCase() === profile.businessName.toLowerCase());
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);

  const getApplicantsForJob = (jobId: number) => {
    const mockApplicants = [
      {
        id: 101,
        name: 'Dr. Amit Sharma',
        role: 'Cardiologist',
        qualification: 'MBBS, MD Cardiology',
        experience: '6 yrs',
        phone: '+91 98989 89898',
        resumeName: 'Dr_Amit_Sharma_CV.pdf',
        avatar: '👨‍⚕️',
      },
      {
        id: 102,
        name: 'Riya Sen',
        role: 'ICU Staff Nurse',
        qualification: 'B.Sc Nursing, BCLS',
        experience: '4 yrs',
        phone: '+91 97777 66666',
        resumeName: 'Riya_Sen_Nurse_Resume.pdf',
        avatar: '👩‍⚕️',
      },
      {
        id: 103,
        name: 'Dr. Neha Gupta',
        role: 'Pediatric Specialist',
        qualification: 'MBBS, MD Pediatrics',
        experience: '8 yrs',
        phone: '+91 95555 44444',
        resumeName: 'Dr_Neha_Gupta_Resume.pdf',
        avatar: '👩‍⚕️',
      }
    ];

    const savedApplied = localStorage.getItem('seeker_applied_jobs');
    const appliedJobs = savedApplied ? JSON.parse(savedApplied) : [];
    const isApplied = appliedJobs.includes(jobId);

    // For brand new jobs (ID > 12), show only the actual applicant if they applied
    if (jobId > 12) {
      if (isApplied) {
        const basicInfo = localStorage.getItem('seeker_basic_info');
        const profInfo = localStorage.getItem('seeker_professional_info');
        const avatarImg = localStorage.getItem('seeker_avatar');
        
        const basic = basicInfo ? JSON.parse(basicInfo) : {};
        const prof = profInfo ? JSON.parse(profInfo) : {};
        
        return [{
          id: 999,
          name: basic.name || 'Anonymous Candidate',
          role: prof.specialty || 'Medical Specialist',
          qualification: prof.qualification || 'MBBS',
          experience: prof.experience || 'Fresher',
          phone: localStorage.getItem('seeker_phone') || '+91 98765 43210',
          resumeName: localStorage.getItem('seeker_resume_name') || 'My_Resume.pdf',
          avatar: avatarImg || '👤',
        }];
      }
      return [];
    }

    // For default jobs (ID <= 12), return mock applicants + real candidate if applied
    if (isApplied) {
      const basicInfo = localStorage.getItem('seeker_basic_info');
      const profInfo = localStorage.getItem('seeker_professional_info');
      const avatarImg = localStorage.getItem('seeker_avatar');
      
      const basic = basicInfo ? JSON.parse(basicInfo) : {};
      const prof = profInfo ? JSON.parse(profInfo) : {};
      
      const realSeeker = {
        id: 999,
        name: basic.name || 'Anonymous Candidate',
        role: prof.specialty || 'Medical Specialist',
        qualification: prof.qualification || 'MBBS',
        experience: prof.experience || 'Fresher',
        phone: localStorage.getItem('seeker_phone') || '+91 98765 43210',
        resumeName: localStorage.getItem('seeker_resume_name') || 'My_Resume.pdf',
        avatar: avatarImg || '👤',
      };
      return [realSeeker, ...mockApplicants];
    }

    return mockApplicants;
  };

  const handleDownloadResume = (applicant: any) => {
    alert(`📥 Downloading resume for ${applicant.name}: "${applicant.resumeName}"`);
    
    const element = document.createElement("a");
    const file = new Blob([
      `24medijobs PORTAL - CANDIDATE PROFILE RESUME\n`,
      `==========================================\n\n`,
      `Name: ${applicant.name}\n`,
      `Specialty/Role: ${applicant.role}\n`,
      `Qualification: ${applicant.qualification}\n`,
      `Experience: ${applicant.experience}\n`,
      `Phone: ${applicant.phone}\n`,
      `Attached PDF: ${applicant.resumeName}\n\n`,
      `Downloaded securely from 24medijobs Employer Dashboard.`
    ], { type: 'text/plain' });
    
    element.href = URL.createObjectURL(file);
    element.download = applicant.resumeName.replace('.pdf', '.txt');
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#00b4a0] bg-gray-50 shrink-0 shadow-md">
              <img src={profile.logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#0d1b3e] flex items-center gap-1.5">
                {profile.businessName}
                <span className="bg-[#22c36a]/15 text-[#22c36a] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Verified Profile</span>
              </h1>
              <p className="text-sm text-gray-500">{profile.name} — {profile.designation}</p>
            </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={onPostJob}
              className="flex-1 sm:flex-initial bg-[#00b4a0] hover:bg-[#009888] text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-1.5"
            >
              <span>➕</span> Post a New Job
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-3 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-semibold"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card & Stats */}
          <div className="space-y-6">
            {/* Representative Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-[#0d1b3e] text-base mb-4 border-b border-gray-100 pb-2">Business & Profile Details</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Representative Name</p>
                  <p className="font-semibold text-gray-700">{profile.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Designation</p>
                  <p className="font-semibold text-gray-700">{profile.designation}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Company Name</p>
                  <p className="font-semibold text-gray-700">{profile.businessName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Company Type</p>
                  <p className="font-semibold text-gray-700 uppercase">{profile.businessType.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Email Address</p>
                  <p className="font-semibold text-gray-700">{profile.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Verification Document</p>
                  <p className="font-semibold text-gray-700">
                    {profile.gstNumber && `GST: ${profile.gstNumber}`}
                    {!profile.gstNumber && profile.panNumber && `PAN: ${profile.panNumber}`}
                    {!profile.gstNumber && !profile.panNumber && profile.aadharNumber && `Aadhar: XXXX-XXXX-${profile.aadharNumber.slice(-4)}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
              <h3 className="font-bold text-[#0d1b3e] text-base mb-4 text-left border-b border-gray-100 pb-2">Hiring Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-2xl font-black text-blue-700">{myJobs.length}</p>
                  <p className="text-xs text-gray-500 font-medium">Jobs Active</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <p className="text-2xl font-black text-green-700">{myJobs.length * 12}</p>
                  <p className="text-xs text-gray-500 font-medium">Total Applicants</p>
                </div>
              </div>
            </div>
          </div>

          {/* Jobs List Panel */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0d1b3e]">My Job Listings ({myJobs.length})</h2>
              <span className="text-xs text-[#5a6a8a] font-medium bg-[#f0f5ff] px-3 py-1 rounded-full">Active</span>
            </div>

            {myJobs.length > 0 ? (
              <div className="space-y-4">
                {myJobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-[#00b4a0] transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl border border-gray-100 flex items-center justify-center text-3xl bg-gray-50 overflow-hidden shrink-0">
                        {job.logo.length > 4 ? (
                          <img src={job.logo} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <span>{job.logo}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[#0d1b3e] text-base mb-1">{job.title}</h3>
                        <p className="text-sm text-gray-500 font-medium mb-3">{job.hospital}</p>
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[#5a6a8a] font-medium">
                          <span>📍 {job.location}</span>
                          <span>💰 {job.salary}</span>
                          <span>⏱ {job.type}</span>
                          <span>🎓 {job.exp}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="inline-block bg-yellow-50 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase mb-2">Pending Review</span>
                        <p className="text-xs text-gray-400 font-semibold">{job.posted}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-gray-50 mt-4 pt-3 text-xs">
                      <p className="text-gray-400">Applications received: <span className="font-bold text-[#0d1b3e]">{getApplicantsForJob(job.id).length}</span></p>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => setExpandedJobId(expandedJobId === job.id ? null : job.id)} 
                          className="text-[#00b4a0] font-semibold hover:underline"
                        >
                          {expandedJobId === job.id ? 'Hide Applicants' : 'View Applicants'}
                        </button>
                        <button className="text-red-500 font-semibold hover:underline">Deactivate</button>
                      </div>
                    </div>

                    {/* Inline Candidates list directly inside the Job card */}
                    {expandedJobId === job.id && (
                      <div className="border-t border-gray-100 mt-4 pt-4 space-y-3 bg-gray-50/50 p-4 rounded-xl">
                        <h4 className="text-xs font-bold text-[#0d2b6b] uppercase tracking-wider mb-2">
                          Applied Candidates ({getApplicantsForJob(job.id).length}):
                        </h4>
                        {getApplicantsForJob(job.id).length > 0 ? (
                          <div className="space-y-3">
                            {getApplicantsForJob(job.id).map(applicant => (
                              <div key={applicant.id} className="bg-white border border-gray-100 rounded-xl p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-xl overflow-hidden shrink-0 border border-gray-100">
                                    {applicant.avatar.length > 4 ? (
                                      <img src={applicant.avatar} alt="Logo" className="w-full h-full object-cover" />
                                    ) : (
                                      <span>{applicant.avatar}</span>
                                    )}
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-[#0d1b3e] text-sm">{applicant.name}</h5>
                                    <p className="text-[11px] text-[#00b4a0] font-semibold mt-0.5">{applicant.role} • {applicant.qualification}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">Exp: {applicant.experience} | Mob: {applicant.phone}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDownloadResume(applicant)}
                                  className="w-full sm:w-auto bg-[#0d2b6b] hover:bg-[#00b4a0] text-white text-[10px] font-bold px-3.5 py-2 rounded-lg transition-all flex items-center justify-center gap-1 shadow-sm"
                                >
                                  📥 Download CV
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 italic">No candidates have applied to this job yet.</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                <div className="text-5xl mb-4">📢</div>
                <h3 className="font-bold text-[#0d1b3e] text-lg mb-2">No active job listings</h3>
                <p className="text-[#5a6a8a] text-sm mb-6 max-w-sm mx-auto">Create your first medical job posting to receive verified applications from medical specialists.</p>
                <button
                  onClick={onPostJob}
                  className="bg-[#00b4a0] hover:bg-[#009888] text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 text-sm shadow-md hover:shadow-lg inline-flex items-center gap-1.5"
                >
                  Post a Job Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ===================== JOB DETAILS COMPONENT =====================
const JobDetails = ({ onNext, onBack, profile }: { onNext: (data: any) => void; onBack: () => void; profile: any }) => {
  const [formData, setFormData] = useState({
    company: profile ? profile.businessName : 'flutter tech',
    jobTitle: 'Senior Resident Physician',
    jobRoleCategory: 'Doctors',
    jobType: 'fulltime' as 'fulltime' | 'parttime' | 'both',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <div className="flex-1"><div className="h-2 bg-[#00b4a0] rounded-full" style={{ width: '30%' }} /></div>
            <span className="text-sm text-gray-500 font-medium">Step 2 of 7</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-[#0d1b3e] mb-2">Job Details</h2>
          <p className="text-gray-500 text-sm mb-6">
            We use this information to find the best candidates for the job.
            <span className="text-red-500 ml-1">*Marked fields are mandatory</span>
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Hiring Organization</p>
                  <p className="font-semibold text-[#0d1b3e]">{formData.company} (Verified Profile)</p>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company/Hospital you're hiring for <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#00b4a0] transition-colors outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job title / Designation <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#00b4a0] transition-colors outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Only similar job title edits are allowed after publishing</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Role / Category <span className="text-red-500">*</span></label>
              <select
                value={formData.jobRoleCategory}
                onChange={(e) => setFormData(prev => ({ ...prev, jobRoleCategory: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#00b4a0] transition-colors outline-none text-gray-600"
              >
                <option value="Doctors">Doctors & Physicians</option>
                <option value="Nurses">Nursing Staff</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Radiology">Radiology & Imaging</option>
                <option value="Dental">Dental</option>
                <option value="Lab">Lab & Diagnostics</option>
                <option value="Allied">Allied Health & Therapy</option>
                <option value="Mental Health">Mental Health</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type of Job <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-3 gap-3">
                {['fulltime', 'parttime', 'both'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, jobType: type as any }))}
                    className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                      formData.jobType === type ? 'border-[#00b4a0] bg-[#00b4a0]/5 text-[#00b4a0]' : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    {type === 'fulltime' ? 'Full Time' : type === 'parttime' ? 'Part Time' : 'Both'}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button type="button" onClick={onBack} className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">Back</button>
              <button type="submit" className="flex-1 px-6 py-3 bg-[#00b4a0] hover:bg-[#009888] text-white rounded-xl font-semibold transition-colors">Continue</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ===================== LOCATION COMPONENT =====================
const Location = ({ onNext, onBack }: { onNext: (data: any) => void; onBack: () => void }) => {
  const [formData, setFormData] = useState({
    workLocationType: 'office' as 'office' | 'work_from_home' | 'hybrid',
    jobCity: 'Delhi-NCR',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <div className="flex-1"><div className="h-2 bg-[#00b4a0] rounded-full" style={{ width: '50%' }} /></div>
            <span className="text-sm text-gray-500 font-medium">Step 3 of 7</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-[#0d1b3e] mb-2">Location</h2>
          <p className="text-gray-500 text-sm mb-6">Let candidates know where they will be working from.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Work location type <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-3 gap-3">
                {['office', 'work_from_home', 'hybrid'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, workLocationType: type as any }))}
                    className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                      formData.workLocationType === type ? 'border-[#00b4a0] bg-[#00b4a0]/5 text-[#00b4a0]' : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    {type === 'office' ? 'Hospital / Clinic' : type === 'work_from_home' ? 'Work from Home' : 'Hybrid'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job City <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.jobCity}
                onChange={(e) => setFormData(prev => ({ ...prev, jobCity: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#00b4a0] transition-colors outline-none"
              />
              <p className="text-xs text-gray-400 mt-2">Your job will receive applications matching your city or region.</p>
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button type="button" onClick={onBack} className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">Back</button>
              <button type="submit" className="flex-1 px-6 py-3 bg-[#00b4a0] hover:bg-[#009888] text-white rounded-xl font-semibold transition-colors">Continue</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ===================== COMPENSATION COMPONENT =====================
const Compensation = ({ onNext, onBack }: { onNext: (data: any) => void; onBack: () => void }) => {
  const [formData, setFormData] = useState({
    payType: 'fixed' as 'fixed' | 'incentive' | 'both',
    minSalary: '60000',
    maxSalary: '120000',
    averageIncentive: '0',
    additionalPerks: [] as string[],
    joiningFee: 'no' as 'yes' | 'no',
  });
  const [customPerk, setCustomPerk] = useState('');

  const handleAddPerk = () => {
    if (customPerk && !formData.additionalPerks.includes(customPerk)) {
      setFormData(prev => ({ ...prev, additionalPerks: [...prev.additionalPerks, customPerk] }));
      setCustomPerk('');
    }
  };

  const handleRemovePerk = (perk: string) => {
    setFormData(prev => ({ ...prev, additionalPerks: prev.additionalPerks.filter(p => p !== perk) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <div className="flex-1"><div className="h-2 bg-[#00b4a0] rounded-full" style={{ width: '60%' }} /></div>
            <span className="text-sm text-gray-500 font-medium">Step 4 of 7</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-[#0d1b3e] mb-2">Compensation</h2>
          <p className="text-gray-500 text-sm mb-6">Job postings with right salary & incentives will help you find the right candidates.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What is the pay type? <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-3 gap-3">
                {['fixed', 'incentive', 'both'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, payType: type as any }))}
                    className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                      formData.payType === type ? 'border-[#00b4a0] bg-[#00b4a0]/5 text-[#00b4a0]' : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    {type === 'fixed' ? 'Fixed Salary' : type === 'incentive' ? 'Incentive' : 'Fixed + Incentive'}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fixed salary / month <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.minSalary}
                  onChange={(e) => setFormData(prev => ({ ...prev, minSalary: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#00b4a0] transition-colors outline-none"
                  placeholder="₹0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">to</label>
                <input
                  type="text"
                  value={formData.maxSalary}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxSalary: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#00b4a0] transition-colors"
                  placeholder="₹0"
                />
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl space-y-1">
              <p className="text-sm text-gray-600"><span className="font-medium">Fixed Salary / Month</span> ₹ {formData.minSalary} - ₹ {formData.maxSalary}</p>
              <p className="text-sm text-gray-600"><span className="font-medium">Average Incentive / Month</span> ₹ {formData.averageIncentive}</p>
              <p className="text-sm text-[#00b4a0] font-medium">Earning Potential / Month ₹ {formData.minSalary} - ₹ {formData.maxSalary}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Do you offer any additional perks?</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={customPerk}
                  onChange={(e) => setCustomPerk(e.target.value)}
                  placeholder="Add other perks"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-[#00b4a0] transition-colors outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddPerk()}
                />
                <button type="button" onClick={handleAddPerk} className="px-4 py-2 border border-[#00b4a0] text-[#00b4a0] rounded-xl hover:bg-[#00b4a0]/5 transition-colors">+ Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.additionalPerks.map(perk => (
                  <span key={perk} className="inline-flex items-center gap-1 px-3 py-1 bg-[#00b4a0]/10 text-[#00b4a0] rounded-full text-sm">
                    {perk}
                    <button type="button" onClick={() => handleRemovePerk(perk)} className="hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Is there any joining fee or deposit required from the candidate? <span className="text-red-500">*</span></label>
              <div className="flex gap-4">
                {['no', 'yes'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, joiningFee: option as any }))}
                    className={`px-6 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                      formData.joiningFee === option ? 'border-[#00b4a0] bg-[#00b4a0]/5 text-[#00b4a0]' : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    {option === 'no' ? 'No' : 'Yes'}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button type="button" onClick={onBack} className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">Back</button>
              <button type="submit" className="flex-1 px-6 py-3 bg-[#00b4a0] hover:bg-[#009888] text-white rounded-xl font-semibold transition-colors">Continue</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ===================== CANDIDATE REQUIREMENTS COMPONENT =====================
const CandidateRequirements = ({ onNext, onBack }: { onNext: (data: any) => void; onBack: () => void }) => {
  const [formData, setFormData] = useState({
    minEducation: 'Graduate',
    englishLevel: 'Good English',
    experienceRequired: 'Experienced Only',
    minExperience: '2+',
    additionalRequirements: '',
    gender: 'both' as 'male' | 'female' | 'both',
    jobDescription: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <div className="flex-1"><div className="h-2 bg-[#00b4a0] rounded-full" style={{ width: '80%' }} /></div>
            <span className="text-sm text-gray-500 font-medium">Step 5 of 7</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-[#0d1b3e] mb-2">Candidate Requirements</h2>
          <p className="text-gray-500 text-sm mb-6">We'll use these requirement details to make your job visible to the right candidates.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Education <span className="text-red-500">*</span></label>
              <select
                value={formData.minEducation}
                onChange={(e) => setFormData(prev => ({ ...prev, minEducation: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#00b4a0] transition-colors outline-none text-gray-600"
              >
                <option>Graduate</option><option>Post Graduate</option><option>Diploma</option><option>High School</option><option>No Formal Education</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">English level required <span className="text-red-500">*</span></label>
              <select
                value={formData.englishLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, englishLevel: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#00b4a0] transition-colors outline-none text-gray-600"
              >
                <option>Basic English</option><option>Good English</option><option>Fluent English</option><option>Native English</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total experience required <span className="text-red-500">*</span></label>
              <select
                value={formData.experienceRequired}
                onChange={(e) => setFormData(prev => ({ ...prev, experienceRequired: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#00b4a0] transition-colors outline-none text-gray-600"
              >
                <option>Fresher Only</option><option>Experienced Only</option><option>Both</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum experience <span className="text-red-500">*</span></label>
              <select
                value={formData.minExperience}
                onChange={(e) => setFormData(prev => ({ ...prev, minExperience: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#00b4a0] transition-colors outline-none text-gray-600"
              >
                <option>0</option><option>1+</option><option>2+</option><option>3+</option><option>5+</option><option>10+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Requirements (Optional)</label>
              <textarea
                value={formData.additionalRequirements}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalRequirements: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#00b4a0] transition-colors h-20 resize-none outline-none"
                placeholder="Add additional requirements..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <div className="flex gap-4">
                {['both', 'male', 'female'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, gender: option as any }))}
                    className={`px-6 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                      formData.gender === option ? 'border-[#00b4a0] bg-[#00b4a0]/5 text-[#00b4a0]' : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    {option === 'both' ? 'Both' : option === 'male' ? 'Male' : 'Female'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
              <textarea
                value={formData.jobDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#00b4a0] transition-colors h-32 resize-none outline-none"
                placeholder="Describe the responsibilities of this job..."
              />
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button type="button" onClick={onBack} className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">Back</button>
              <button type="submit" className="flex-1 px-6 py-3 bg-[#00b4a0] hover:bg-[#009888] text-white rounded-xl font-semibold transition-colors">Continue</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ===================== INTERVIEWER INFO COMPONENT =====================
const InterviewerInfo = ({ onNext, onBack }: { onNext: (data: any) => void; onBack: () => void }) => {
  const [formData, setFormData] = useState({
    isWalkIn: 'no' as 'yes' | 'no',
    address: 'Buddh Marg, Fraser Road Area, Patna, Bihar 800001, India',
    contactPreference: 'myself' as 'myself' | 'other' | 'none',
    candidateContact: 'all' as 'all' | 'high_medium' | 'high',
    notificationPreference: 'myself' as 'myself' | 'daily',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <div className="flex-1"><div className="h-2 bg-[#00b4a0] rounded-full w-full" /></div>
            <span className="text-sm text-gray-500 font-medium">Step 6 of 7</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-[#0d1b3e] mb-2">Interviewer Information</h2>
          <p className="text-gray-500 text-sm mb-6">Let candidates know how the interview will be conducted for this job.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Is this a walk-in interview? <span className="text-red-500">*</span></label>
              <div className="flex gap-4">
                {['yes', 'no'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isWalkIn: option as any }))}
                    className={`px-6 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                      formData.isWalkIn === option ? 'border-[#00b4a0] bg-[#00b4a0]/5 text-[#00b4a0]' : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    {option === 'yes' ? 'Yes' : 'No'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company address <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#00b4a0] transition-colors outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Do you want candidates to contact you via Call / Whatsapp after they apply? <span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-3">
                {['myself', 'other', 'none'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, contactPreference: option as any }))}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                      formData.contactPreference === option ? 'border-[#00b4a0] bg-[#00b4a0]/5 text-[#00b4a0]' : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    {option === 'myself' ? 'Yes, to myself' : option === 'other' ? 'Yes, to other recruiter' : 'No, I will contact candidates first'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Which candidates should be able to contact you? <span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-3">
                {['all', 'high_medium', 'high'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, candidateContact: option as any }))}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all text-left ${
                      formData.candidateContact === option ? 'border-[#00b4a0] bg-[#00b4a0]/5 text-[#00b4a0]' : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    {option === 'all' ? 'All candidates' : option === 'high_medium' ? 'High & Medium matched candidates' : 'High Matches Only'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notification Preferences</label>
              <div className="flex gap-4">
                {['myself', 'daily'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, notificationPreference: option as any }))}
                    className={`px-6 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                      formData.notificationPreference === option ? 'border-[#00b4a0] bg-[#00b4a0]/5 text-[#00b4a0]' : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    {option === 'myself' ? 'Yes, to myself' : 'Send summary once a day'}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button type="button" onClick={onBack} className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">Back</button>
              <button type="submit" className="flex-1 px-6 py-3 bg-[#00b4a0] hover:bg-[#009888] text-white rounded-xl font-semibold transition-colors">Continue</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ===================== JOB PREVIEW COMPONENT =====================
const JobPreview = ({ data, onNext, onBack, profile }: { data: any; onNext: () => void; onBack: () => void; profile: any }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <div className="flex-1"><div className="h-2 bg-[#00b4a0] rounded-full w-full" /></div>
            <span className="text-sm text-gray-500 font-medium">Step 7 of 7</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#0d1b3e]">Job Preview</h2>
            <button type="button" onClick={onBack} className="text-sm text-[#00b4a0] font-medium hover:underline">Edit details</button>
          </div>
          <div className="space-y-6">
            {profile && (
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Interviewer Representative</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                    <img src={profile.logo} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0d1b3e]">{profile.name} ({profile.designation})</p>
                    <p className="text-xs text-gray-500">{profile.email}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Job Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-gray-400">Company name</p><p className="text-sm font-medium text-[#0d1b3e]">{data?.company || 'Apollo Hospitals'}</p></div>
                <div><p className="text-xs text-gray-400">Job title</p><p className="text-sm font-medium text-[#0d1b3e]">{data?.jobTitle || 'Resident Doctor'}</p></div>
                <div><p className="text-xs text-gray-400">Job role/ category</p><p className="text-sm font-medium text-[#0d1b3e]">{data?.jobRoleCategory || 'Doctors'}</p></div>
                <div><p className="text-xs text-gray-400">Job type</p><p className="text-sm font-medium text-[#0d1b3e]">{data?.jobType === 'fulltime' ? 'Full Time' : data?.jobType === 'parttime' ? 'Part Time' : 'Full / Part Time'}</p></div>
                <div><p className="text-xs text-gray-400">Work type</p><p className="text-sm font-medium text-[#0d1b3e]">{data?.workLocationType === 'office' ? 'Hospital Site' : data?.workLocationType === 'hybrid' ? 'Hybrid' : 'Remote'}</p></div>
                <div><p className="text-xs text-gray-400">Job City</p><p className="text-sm font-medium text-[#0d1b3e]">{data?.jobCity || 'Delhi NCR'}</p></div>
              </div>
            </div>
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Compensation</h3>
              <p className="text-sm font-medium text-[#0d1b3e]">₹ {Number(data?.minSalary).toLocaleString('en-IN')} - ₹ {Number(data?.maxSalary).toLocaleString('en-IN')} per month</p>
              <p className="text-xs text-gray-500 mt-2">Joining Fee: {data?.joiningFee === 'yes' ? 'Yes (deposit required)' : 'No (direct hiring)'}</p>
            </div>
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Candidate Requirements</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-gray-400">Minimum Education</p><p className="text-sm font-medium text-[#0d1b3e]">{data?.minEducation || 'Graduate'}</p></div>
                <div><p className="text-xs text-gray-400">Experience Required</p><p className="text-sm font-medium text-[#0d1b3e]">{data?.experienceRequired || 'Experienced Only'}</p></div>
                <div><p className="text-xs text-gray-400">Minimum Experience</p><p className="text-sm font-medium text-[#0d1b3e]">{data?.minExperience || '2+'}</p></div>
                <div><p className="text-xs text-gray-400">English Level</p><p className="text-sm font-medium text-[#0d1b3e]">{data?.englishLevel || 'Good English'}</p></div>
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button type="button" onClick={onBack} className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">Back</button>
              <button type="button" onClick={onNext} className="flex-1 px-6 py-3 bg-[#00b4a0] hover:bg-[#009888] text-white rounded-xl font-semibold transition-colors">Continue to Publish</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===================== PUBLISH PAGE COMPONENT =====================
const PublishPage = ({ onPublish, onBack }: { onPublish: (plan: string) => void; onBack: () => void }) => {
  const publishPlans = [
    {
      id: 'classic',
      name: 'Classic Job',
      price: '₹699',
      description: 'Job will be active for 15 days',
      features: ['Basic visibility', 'WhatsApp notifications to top candidates', "Featured with 'Urgently hiring' tag", 'AI Calling Agent'],
      recommended: false,
    },
    {
      id: 'premium',
      name: 'Premium Job',
      price: '₹1399',
      description: 'Job will be active for 15 days',
      features: ['Higher visibility', 'WhatsApp notifications to top candidates', "Featured with 'Urgently hiring' tag", 'AI Calling Agent'],
      recommended: true,
    },
    {
      id: 'super-premium',
      name: 'Super premium Job',
      price: '₹2799',
      description: 'Job will be active for 15 days',
      features: ['Maximum visibility', '2x Priority WhatsApp notifications to top candidates', "Featured with 'Urgently hiring' tag", '🔍 Top placements in job listings', 'AI Calling Agent'],
      recommended: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#0d1b3e] text-center mb-2">Choose a job basis your hiring needs</h1>
        <p className="text-gray-500 text-center mb-8">Select the plan that best fits your hiring requirements</p>
        <div className="grid md:grid-cols-3 gap-6">
          {publishPlans.map((plan) => (
            <div key={plan.id} className={`bg-white rounded-2xl shadow-lg p-6 relative transition-all hover:shadow-xl ${plan.recommended ? 'border-2 border-[#00b4a0]' : 'border border-gray-200'}`}>
              {plan.recommended && <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#00b4a0] text-white text-xs font-bold px-4 py-1 rounded-full">RECOMMENDED</span>}
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-[#0d1b3e]">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                <p className="text-3xl font-bold text-[#0d1b3e] mt-3">{plan.price}</p>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-[#00b4a0] mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => onPublish(plan.id)} className={`w-full py-3 rounded-xl font-semibold transition-colors ${plan.recommended ? 'bg-[#00b4a0] hover:bg-[#009888] text-white' : 'bg-gray-100 hover:bg-gray-200 text-[#0d1b3e]'}`}>
                Choose Plan
              </button>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button onClick={onBack} className="text-gray-500 hover:text-[#00b4a0] transition-colors text-sm">← Back to preview</button>
        </div>
      </div>
    </div>
  );
};

// ===================== MAIN EMPLOYER CTA COMPONENT =====================
interface EmployerCTAProps {
  onNavigate: (page: string) => void;
  jobs: any[];
  setJobs: React.Dispatch<React.SetStateAction<any[]>>;
  employerProfile: any;
  setEmployerProfile: (profile: any) => void;
}

const pricingPlans = [
  {
    name: 'Basic',
    price: '₹2,999',
    period: '/month',
    highlight: false,
    features: [
      '5 Job Postings/month',
      'Access to 10,000 profiles',
      'Basic candidate filters',
      'Email support',
      '30-day job visibility',
    ],
  },
  {
    name: 'Professional',
    price: '₹7,999',
    period: '/month',
    highlight: true,
    badge: 'Most Popular',
    features: [
      '25 Job Postings/month',
      'Unlimited profile access',
      'Advanced specialty filters',
      'Priority support',
      '60-day job visibility',
      'Featured job listings',
      'Candidate shortlisting tool',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    highlight: false,
    features: [
      'Unlimited Job Postings',
      'Dedicated account manager',
      'AI-powered candidate matching',
      '24/7 phone & chat support',
      'Branded hospital profile',
      'Analytics dashboard',
      'Bulk hiring solutions',
    ],
  },
];

export default function EmployerCTA({ 
  onNavigate, 
  jobs, 
  setJobs, 
  employerProfile, 
  setEmployerProfile 
}: EmployerCTAProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'profile-setup' | 'job-details' | 'location' | 'compensation' | 'requirements' | 'interviewer' | 'preview' | 'publish'>(employerProfile ? 'home' : 'login');
  const [jobData, setJobData] = useState<any>({});
  const [tempEmployerPhone, setTempEmployerPhone] = useState('');

  useEffect(() => {
    if (!employerProfile) {
      setCurrentPage('login');
    } else if (currentPage === 'login') {
      setCurrentPage('home');
    }
  }, [employerProfile]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.section-reveal').forEach((el) => el.classList.add('visible'));
          }
        });
      },
      { threshold: 0.1 }
    );
    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  const handleLogin = async (phone: string) => {
    setTempEmployerPhone(phone);
    try {
      const { data: profileRow, error } = await supabase
        .from('employer_profiles')
        .select('*')
        .eq('id', phone)
        .maybeSingle();

      if (!error && profileRow) {
        const mappedProfile = {
          name: profileRow.name,
          designation: profileRow.designation,
          email: profileRow.email,
          businessName: profileRow.business_name,
          businessType: profileRow.business_type,
          gstNumber: profileRow.gst_number,
          panNumber: profileRow.pan_number,
          aadharNumber: profileRow.aadhar_number,
          logo: profileRow.logo,
          phone: profileRow.phone
        };
        setEmployerProfile(mappedProfile);
        setCurrentPage('home');
        onNavigate('jobs');
      } else {
        if (error) console.error('Error fetching employer profile:', error);
        setCurrentPage('profile-setup');
      }
    } catch (err) {
      console.error(err);
      setCurrentPage('profile-setup');
    }
  };

  const handleNext = (data: any, nextPage: typeof currentPage) => {
    setJobData({ ...jobData, ...data });
    setCurrentPage(nextPage);
  };

  const handlePublish = async (plan: string) => {
    const salaryStr = `₹${Number(jobData.minSalary).toLocaleString('en-IN')}–₹${Number(jobData.maxSalary).toLocaleString('en-IN')}/mo`;
    const expStr = jobData.minExperience === '0' ? 'Fresher' : `${jobData.minExperience} yrs`;
    const typeStr = jobData.jobType === 'fulltime' ? 'Full-time' : jobData.jobType === 'parttime' ? 'Part-time' : 'Full-time';
    
    const newJobObj = {
      title: jobData.jobTitle || 'Medical Staff Specialist',
      hospital: employerProfile?.businessName || 'Verified Hospital',
      location: jobData.jobCity || 'Delhi NCR',
      type: typeStr,
      salary: salaryStr,
      exp: expStr,
      specialty: jobData.jobRoleCategory || 'Doctors',
      logo: employerProfile?.logo || '🏥',
      posted: 'Just now',
    };

    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert(newJobObj)
        .select();

      if (!error && data && data.length > 0) {
        setJobs([data[0], ...jobs]);
      } else {
        if (error) console.error('Supabase job post error:', error);
        setJobs([{ id: jobs.length + 1, ...newJobObj }, ...jobs]);
      }
    } catch (err) {
      console.error('Error posting job to Supabase:', err);
      setJobs([{ id: jobs.length + 1, ...newJobObj }, ...jobs]);
    }

    alert('✅ Job posted successfully with plan: ' + plan);
    onNavigate('jobs');
    setCurrentPage('home');
  };

  // Render different pages based on current state
  const renderContent = () => {
    // If employer profile is completed and we are on home case, show the Dashboard!
    if (employerProfile && currentPage === 'home') {
      return (
        <EmployerDashboard 
          profile={employerProfile} 
          jobs={jobs} 
          onPostJob={() => setCurrentPage('job-details')} 
          onLogout={() => {
            setEmployerProfile(null);
            setCurrentPage('home');
          }}
        />
      );
    }

    switch (currentPage) {
      case 'login':
        return <EmployerLogin onLogin={handleLogin} />;
      case 'profile-setup':
        return (
          <EmployerProfileSetup 
            onNext={async (data) => {
              const fullProfile = { ...data, phone: tempEmployerPhone || '9876543210' };
              try {
                const empData = {
                  id: fullProfile.phone,
                  name: fullProfile.name,
                  designation: fullProfile.designation,
                  email: fullProfile.email,
                  business_name: fullProfile.businessName,
                  business_type: fullProfile.businessType,
                  gst_number: fullProfile.gstNumber,
                  pan_number: fullProfile.panNumber,
                  aadhar_number: fullProfile.aadharNumber,
                  logo: fullProfile.logo,
                  phone: fullProfile.phone
                };
                await supabase.from('employer_profiles').upsert(empData);
              } catch (err) {
                console.error('Error saving employer profile to Supabase:', err);
              }
              setEmployerProfile(fullProfile);
              setCurrentPage('home');
              onNavigate('jobs');
            }} 
            onBack={() => setCurrentPage('home')} 
          />
        );
      case 'job-details':
        return <JobDetails onNext={(data) => handleNext(data, 'location')} onBack={() => setCurrentPage('home')} profile={employerProfile} />;
      case 'location':
        return <Location onNext={(data) => handleNext(data, 'compensation')} onBack={() => setCurrentPage('job-details')} />;
      case 'compensation':
        return <Compensation onNext={(data) => handleNext(data, 'requirements')} onBack={() => setCurrentPage('location')} />;
      case 'requirements':
        return <CandidateRequirements onNext={(data) => handleNext(data, 'interviewer')} onBack={() => setCurrentPage('compensation')} />;
      case 'interviewer':
        return <InterviewerInfo onNext={(data) => handleNext(data, 'preview')} onBack={() => setCurrentPage('requirements')} />;
      case 'preview':
        return <JobPreview data={jobData} onNext={() => setCurrentPage('publish')} onBack={() => setCurrentPage('interviewer')} profile={employerProfile} />;
      case 'publish':
        return <PublishPage onPublish={handlePublish} onBack={() => setCurrentPage('preview')} />;
      default:
        return (
          <section className="py-20 bg-[#f0f5ff]" ref={sectionRef}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              {/* Employer CTA Banner */}
              <div
                className="rounded-3xl p-8 sm:p-12 mb-20 relative overflow-hidden section-reveal animate-float"
                style={{ background: 'linear-gradient(135deg, #0d2b6b 0%, #00b4a0 100%)' }}
              >
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 animate-spin-slow" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#22c36a]/10 rounded-full translate-y-1/3 -translate-x-1/3" />

                <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <span className="inline-block text-sm font-semibold bg-white/20 text-white px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
                      For Employers & Hospitals
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                      Hire Top Medical Talent Across India
                    </h2>
                    <p className="text-white/80 text-base leading-relaxed mb-6">
                      Post jobs, screen verified candidates, and build your dream healthcare team.
                      Join 12,000+ hospitals already hiring on 24medijobs.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() => setCurrentPage('login')}
                        className="bg-white text-[#0d2b6b] font-bold px-8 py-3.5 rounded-xl hover:bg-[#22c36a] hover:text-white transition-all duration-300 shadow-lg"
                      >
                        Post a Job — Free
                      </button>
                      <button
                        onClick={() => setCurrentPage('login')}
                        className="border-2 border-white text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all duration-200"
                      >
                        View Pricing Plans
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: '⚡', title: 'Fast Hiring', desc: 'Average 72-hour candidate delivery' },
                      { icon: '✅', title: 'Verified Profiles', desc: 'All credentials pre-screened' },
                      { icon: '🎯', title: 'Smart Matching', desc: 'AI-powered candidate recommendations' },
                      { icon: '📊', title: 'Analytics', desc: 'Real-time hiring dashboard' },
                    ].map((item) => (
                      <div key={item.title} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
                        <div className="text-2xl mb-2">{item.icon}</div>
                        <h4 className="font-bold text-white text-sm mb-1">{item.title}</h4>
                        <p className="text-white/70 text-xs">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="text-center mb-12 section-reveal">
                <span className="inline-block text-sm font-semibold text-[#00b4a0] bg-[#00b4a0]/10 px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
                  Pricing Plans
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0d1b3e] mb-4">
                  Simple, <span className="gradient-text">Transparent Pricing</span>
                </h2>
                <p className="text-[#5a6a8a] max-w-xl mx-auto">
                  Start free, scale as you hire. No hidden charges.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {pricingPlans.map((plan, i) => (
                  <div
                    key={plan.name}
                    className={`rounded-2xl p-7 relative section-reveal card-hover ${
                      plan.highlight
                        ? 'bg-[#0d2b6b] text-white shadow-2xl shadow-[#0d2b6b]/30 scale-105'
                        : 'bg-white border border-gray-100'
                    }`}
                    style={{ transitionDelay: `${i * 0.1}s` }}
                  >
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#22c36a] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                        {plan.badge}
                      </div>
                    )}
                    <h3 className={`font-bold text-xl mb-2 ${plan.highlight ? 'text-white' : 'text-[#0d1b3e]'}`}>
                      {plan.name}
                    </h3>
                    <div className="flex items-end gap-1 mb-6">
                      <span className={`text-4xl font-black ${plan.highlight ? 'text-white' : 'text-[#0d2b6b]'}`}>
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className={`text-sm mb-1 ${plan.highlight ? 'text-white/70' : 'text-[#5a6a8a]'}`}>
                          {plan.period}
                        </span>
                      )}
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2.5">
                          <svg className={`w-4 h-4 shrink-0 ${plan.highlight ? 'text-[#22c36a]' : 'text-[#00b4a0]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className={`text-sm ${plan.highlight ? 'text-white/85' : 'text-[#5a6a8a]'}`}>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => setCurrentPage('login')}
                      className={`w-full font-bold py-3 rounded-xl transition-all duration-200 ${
                        plan.highlight
                          ? 'bg-[#00b4a0] text-white hover:bg-[#009888]'
                          : 'bg-[#f0f5ff] text-[#0d2b6b] hover:bg-[#0d2b6b] hover:text-white'
                      }`}
                    >
                      {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
    }
  };

  return <>{renderContent()}</>;
}
