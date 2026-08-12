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
  const myJobs = jobs.filter(job => job.hospital.toLowerCase() === (profile?.businessName || 'digiphlox').toLowerCase());
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'jobs' | 'database' | 'reports' | 'credits' | 'billing' | 'help' | 'sales' | 'offers'>('jobs');
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  const [applicantStatuses, setApplicantStatuses] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('applicant_statuses');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    const loadDbStatuses = async () => {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('job_id, seeker_phone, status');
        if (!error && data) {
          const loaded: Record<string, string> = {};
          data.forEach((row: any) => {
            if (row.status) {
              loaded[`${row.job_id}_${row.seeker_phone}`] = row.status;
            }
          });
          setApplicantStatuses(prev => ({ ...prev, ...loaded }));
        }
      } catch (err) {
        console.error('Error fetching applications status:', err);
      }
    };
    loadDbStatuses();
  }, [jobs]);

  const getApplicantsForJob = (jobId: number) => {
    const mockApplicants = [
      {
        id: 101,
        name: 'Dr. Amit Sharma',
        role: 'Cardiologist',
        qualification: 'MBBS, MD Cardiology',
        experience: '6 yrs',
        phone: '9898989898',
        resumeName: 'Dr_Amit_Sharma_CV.pdf',
        avatar: '👨‍⚕️',
      },
      {
        id: 102,
        name: 'Riya Sen',
        role: 'ICU Staff Nurse',
        qualification: 'B.Sc Nursing, BCLS',
        experience: '4 yrs',
        phone: '9777766666',
        resumeName: 'Riya_Sen_Nurse_Resume.pdf',
        avatar: '👩‍⚕️',
      },
      {
        id: 103,
        name: 'Dr. Neha Gupta',
        role: 'Pediatric Specialist',
        qualification: 'MBBS, MD Pediatrics',
        experience: '8 yrs',
        phone: '9555544444',
        resumeName: 'Dr_Neha_Gupta_Resume.pdf',
        avatar: '👩‍⚕️',
      }
    ];

    const savedApplied = localStorage.getItem('seeker_applied_jobs');
    const appliedJobs = savedApplied ? JSON.parse(savedApplied) : [];
    const isApplied = appliedJobs.includes(jobId);

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
          phone: localStorage.getItem('seeker_phone') || '9876543210',
          resumeName: localStorage.getItem('seeker_resume_name') || 'My_Resume.pdf',
          avatar: avatarImg || '👤',
        }];
      }
      return [];
    }

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
        phone: localStorage.getItem('seeker_phone') || '9876543210',
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
    <div className="min-h-screen bg-gray-50 flex pt-20">
      
      {/* Recruiter Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 shrink-0 flex flex-col justify-between py-6">
        <div className="space-y-6 px-4">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Workspace</h3>
            <p className="text-sm font-black text-[#0d1b3e] mt-1 truncate">{profile?.businessName || 'DigiPhlox'}</p>
          </div>
          
          <nav className="space-y-1.5">
            {[
              { id: 'jobs', label: 'Jobs', icon: '💼' },
              { id: 'database', label: 'Database', icon: '🗄️' },
              { id: 'reports', label: 'Reports', icon: '📊' },
              { id: 'credits', label: 'Credits & usage', icon: '🪙' },
              { id: 'billing', label: 'Billing', icon: '💳' },
              { id: 'help', label: 'Help & Support', icon: '❓' },
              { id: 'sales', label: 'Contact Sales', icon: '📞' },
              { id: 'offers', label: 'Offers', icon: '🔥' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#0d2b6b] text-white shadow-md'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="px-4 border-t border-gray-100 pt-4">
          <button
            onClick={onLogout}
            className="w-full text-center text-xs font-black text-red-500 bg-red-50 hover:bg-red-100 py-3 rounded-xl transition-colors cursor-pointer"
          >
            🚪 Logout Workspace
          </button>
        </div>
      </div>

      {/* Recruiter Workspace Content Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        
        {/* JOBS TAB */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-black text-[#0d1b3e]">Recruiter Job Manager</h2>
                <p className="text-xs text-gray-400">Post new job descriptions and manage responses</p>
              </div>
              {myJobs.length > 0 && (
                <button
                  onClick={onPostJob}
                  className="bg-[#00b4a0] hover:bg-[#009888] text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider shadow-md cursor-pointer"
                >
                  ➕ Post a New Job
                </button>
              )}
            </div>

            {myJobs.length === 0 ? (
              <div className="max-w-2xl mx-auto mt-8 bg-white border border-gray-100 shadow-xl rounded-3xl p-8 text-center">
                <span className="text-5xl">📢</span>
                <h3 className="text-lg font-black text-[#0d1b3e] mt-4">Post your first job</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-2">Hire qualified candidates from India's No.1 Medical Job portal in few clicks.</p>
                
                <div className="grid sm:grid-cols-2 gap-4 mt-8">
                  <div className="border border-gray-200 hover:border-[#0d2b6b] p-5 rounded-2xl text-left bg-gray-50 hover:bg-white transition-all">
                    <p className="text-xs font-black text-[#0d2b6b]">Start with blank form</p>
                    <p className="text-[10px] text-gray-400 font-bold mt-1">Use our blank form to create your job and fill manually.</p>
                    <button
                      onClick={onPostJob}
                      className="mt-4 w-full bg-[#0d2b6b] hover:bg-[#0d2b6b]/90 text-white font-black text-[10px] py-2 rounded-lg uppercase tracking-wider cursor-pointer"
                    >
                      Start with blank form
                    </button>
                  </div>
                  <div className="border border-gray-200 hover:border-[#0d2b6b] p-5 rounded-2xl text-left bg-gray-50 hover:bg-white transition-all">
                    <p className="text-xs font-black text-[#0d2b6b]">Use a template</p>
                    <p className="text-[10px] text-gray-400 font-bold mt-1">Use templates made by apna to save time and hire the right candidates.</p>
                    <button
                      onClick={onPostJob}
                      className="mt-4 w-full bg-[#00b4a0] hover:bg-[#009888] text-white font-black text-[10px] py-2 rounded-lg uppercase tracking-wider cursor-pointer"
                    >
                      Use a template
                    </button>
                  </div>
                </div>
              </div>
            ) : (
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
                        <span className="inline-block bg-[#00b4a0]/15 text-[#00b4a0] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase mb-2">Live Listing</span>
                        <p className="text-xs text-gray-400 font-semibold">{job.posted}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-gray-50 mt-4 pt-3 text-xs">
                      <p className="text-gray-400">Applications received: <span className="font-bold text-[#0d1b3e]">{getApplicantsForJob(job.id).length}</span></p>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => setExpandedJobId(expandedJobId === job.id ? null : job.id)} 
                          className="text-[#00b4a0] font-semibold hover:underline cursor-pointer"
                        >
                          {expandedJobId === job.id ? 'Hide Applicants' : 'View Applicants'}
                        </button>
                        <button className="text-red-500 font-semibold hover:underline cursor-pointer">Deactivate</button>
                      </div>
                    </div>

                    {/* Inline Candidates list */}
                    {expandedJobId === job.id && (
                      <div className="border-t border-gray-100 mt-4 pt-4 space-y-3 bg-gray-50/50 p-4 rounded-xl">
                        <h4 className="text-xs font-bold text-[#0d2b6b] uppercase tracking-wider mb-2">
                          Applied Candidates ({getApplicantsForJob(job.id).length}):
                        </h4>
                        {getApplicantsForJob(job.id).length > 0 ? (
                          <div className="space-y-4">
                            {getApplicantsForJob(job.id).map(applicant => (
                              <div key={applicant.phone} className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col gap-3 shadow-sm">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
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
                                      <p className="text-[10px] text-gray-400 mt-0.5">Exp: {applicant.experience} | Phone: {applicant.phone}</p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleDownloadResume(applicant)}
                                    className="w-full sm:w-auto bg-[#0d2b6b] hover:bg-[#00b4a0] text-white text-[10px] font-bold px-3.5 py-2 rounded-lg transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer shrink-0"
                                  >
                                    📥 Download CV
                                  </button>
                                </div>

                                <div className="border-t border-gray-50 pt-2.5">
                                  <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest mb-2">Hiring Pipeline Status:</p>
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    {['Applied', 'Screened', 'Shortlisted', 'Interview', 'Selected', 'Joined'].map((stage) => {
                                      const isCurrent = (applicantStatuses[`${job.id}_${applicant.phone}`] || 'Applied') === stage;
                                      return (
                                        <button
                                          key={stage}
                                          onClick={async () => {
                                            const newStatuses = { ...applicantStatuses, [`${job.id}_${applicant.phone}`]: stage };
                                            setApplicantStatuses(newStatuses);
                                            localStorage.setItem('applicant_statuses', JSON.stringify(newStatuses));
                                            
                                            try {
                                              await supabase
                                                .from('applications')
                                                .update({ status: stage })
                                                .eq('job_id', job.id)
                                                .eq('seeker_phone', applicant.phone);
                                            } catch (err) {
                                              console.error(err);
                                            }
                                          }}
                                          className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                                            isCurrent
                                              ? 'bg-[#0d2b6b] text-white shadow-sm border border-[#0d2b6b]'
                                              : 'bg-gray-100 hover:bg-gray-200 text-gray-500 border border-transparent'
                                          }`}
                                        >
                                          {stage}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
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
            )}
          </div>
        )}

        {/* DATABASE TAB */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-[#0d1b3e]">Candidate CV Pool</h2>
              <p className="text-xs text-gray-400">Search and contact medical professionals directly</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: 'Dr. Amit Sharma', role: 'Cardiologist', exp: '6 Years', spec: 'General Medicine, ECHO, Cardiology', place: 'Patna' },
                { name: 'Riya Sen', role: 'ICU Staff Nurse', exp: '4 Years', spec: 'BCLS, Critical Care Nursing', place: 'Haldwani' },
                { name: 'Shreya Roy', role: 'Lab Assistant', exp: '2 Years', spec: 'Pathology, Biochemistry', place: 'Mumbai' },
                { name: 'Dr. Rajesh Patel', role: 'Physician', exp: '10 Years', spec: 'General Medicine, Diagnostics', place: 'Bengaluru' },
              ].map((c) => (
                <div key={c.name} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-black text-[#0d1b3e]">{c.name}</h4>
                      <p className="text-[10px] text-[#00b4a0] font-black uppercase mt-0.5">{c.role}</p>
                    </div>
                    <span className="text-[10px] font-bold bg-[#f0f5ff] text-[#0d2b6b] px-3 py-1 rounded-full">{c.exp} Exp</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    <p>🎯 Specialty: {c.spec}</p>
                    <p className="mt-1">📍 Pref Location: {c.place}</p>
                  </div>
                  <button
                    onClick={() => alert(`Unlocked contact details for ${c.name}!`)}
                    className="w-full bg-[#0d2b6b] hover:bg-[#00b4a0] text-white text-[10px] font-black py-2.5 rounded-xl uppercase tracking-wider cursor-pointer"
                  >
                    Contact Candidate
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-[#0d1b3e]">Recruitment Analytics</h2>
              <p className="text-xs text-gray-400">Track listings engagement and applicant metrics</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { title: 'Response Rate', value: '94%', color: 'text-[#22c36a] bg-green-50' },
                { title: 'Job Page Views', value: '1,450', color: 'text-blue-700 bg-blue-50' },
                { title: 'Avg Days to Hire', value: '12 Days', color: 'text-[#00b4a0] bg-teal-50' },
              ].map((stat) => (
                <div key={stat.title} className={`${stat.color} p-6 rounded-3xl text-center shadow-sm`}>
                  <p className="text-3xl font-black">{stat.value}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase mt-1 tracking-wider">{stat.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CREDITS TAB */}
        {activeTab === 'credits' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-[#0d1b3e]">Credits & usage Balance</h2>
              <p className="text-xs text-gray-400">View remaining quotas for job postings and CV downloads</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm grid sm:grid-cols-2 gap-8">
              <div className="text-center p-6 bg-gray-50 rounded-2xl">
                <span className="text-3xl">💼</span>
                <h4 className="text-sm font-black text-[#0d1b3e] mt-2">Active Job Postings Limit</h4>
                <p className="text-2xl font-black text-[#00b4a0] mt-1">5 Remaining</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Renews next billing cycle</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-2xl">
                <span className="text-3xl">🗂️</span>
                <h4 className="text-sm font-black text-[#0d1b3e] mt-2">CV Search Unlocks</h4>
                <p className="text-2xl font-black text-[#00b4a0] mt-1">120 Remaining</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Premium CV downloads quota</p>
              </div>
            </div>
          </div>
        )}

        {/* BILLING TAB */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-[#0d1b3e]">Billing & Subscription</h2>
              <p className="text-xs text-gray-400">View payment receipts and modify plan types</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Invoice ID</th>
                    <th className="p-4">Plan Name</th>
                    <th className="p-4">Amount Paid</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="font-semibold text-gray-600">
                    <td className="p-4">INV-2026-001</td>
                    <td className="p-4">Naukri Recruiter Free Pack</td>
                    <td className="p-4">₹ 0</td>
                    <td className="p-4">12-Aug-2026</td>
                    <td className="p-4 text-green-500 font-black">ACTIVE</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* HELP TAB */}
        {activeTab === 'help' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-[#0d1b3e]">Help & Support Helpdesk</h2>
              <p className="text-xs text-gray-400">Submit queries and read portal tutorials</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm max-w-xl">
              <form onSubmit={(e) => { e.preventDefault(); alert('Query submitted!'); }} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Brief description of problem</label>
                  <textarea rows={3} required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-[#0d2b6b] resize-none" />
                </div>
                <button type="submit" className="bg-[#0d2b6b] hover:bg-[#00b4a0] text-white font-black text-xs py-3 px-6 rounded-xl uppercase tracking-wider cursor-pointer">
                  Submit Ticket
                </button>
              </form>
            </div>
          </div>
        )}

        {/* CONTACT SALES */}
        {activeTab === 'sales' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-[#0d1b3e]">Contact Sales Division</h2>
              <p className="text-xs text-gray-400">Inquire about bulk plans and enterprise dashboard access</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm max-w-md space-y-4">
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-xs text-blue-900 font-bold">
                📞 Recruiter Support Helpline: +91 1800 200 4500
              </div>
              <p className="text-xs text-gray-500 font-semibold leading-relaxed">Our specialists are available Mon-Fri 09:30 AM to 06:30 PM to configure custom CV access quotas for your hospitals.</p>
            </div>
          </div>
        )}

        {/* OFFERS TAB */}
        {activeTab === 'offers' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-[#0d1b3e]">Active Recruitment Offers</h2>
              <p className="text-xs text-gray-400">Get discounted pricing packages for premium medical hiring</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-[#0d2b6b] to-[#1e469a] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-3 right-3 bg-red-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  50% OFF
                </div>
                <div>
                  <h4 className="text-base font-black uppercase tracking-wider">Super Saver Recruiter Pack</h4>
                  <p className="text-xs text-white/70 mt-1">10 Job Listings + 250 CV Search Unlocks</p>
                </div>
                <div className="mt-8 flex justify-between items-center">
                  <div>
                    <span className="text-xs line-through text-white/50 font-bold">₹10,000</span>
                    <span className="text-xl font-black ml-2 text-[#00b4a0]">₹4,999</span>
                  </div>
                  <button
                    onClick={() => setShowOfferPopup(true)}
                    className="bg-[#00b4a0] hover:bg-[#009888] text-white font-black text-[10px] px-4 py-2 rounded-xl uppercase tracking-wider cursor-pointer"
                  >
                    View Offer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* buy-package-offer-popup Modal */}
      {showOfferPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-gray-100 text-center animate-scaleIn">
            <button
              onClick={() => setShowOfferPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg"
            >
              ×
            </button>
            <span className="text-4xl">🎁</span>
            <h3 className="text-base font-black text-[#0d1b3e] mt-3">Exclusive Recruiter Offer</h3>
            <p className="text-xs text-gray-500 mt-1">Pack of 10 Job Postings & Naukri database access (250 CVs)</p>

            <div className="my-6 p-4 bg-[#f0f5ff] rounded-2xl border border-blue-50 text-left space-y-2">
              <div className="flex justify-between text-xs font-semibold text-gray-600">
                <span>Standard price</span>
                <span className="line-through">₹10,000</span>
              </div>
              <div className="flex justify-between text-xs font-black text-gray-700">
                <span>Discount price (50% Off)</span>
                <span className="text-[#0d2b6b]">₹4,999</span>
              </div>
              <div className="flex justify-between text-xs font-black text-gray-700 pt-2 border-t border-blue-100">
                <span>Sub total</span>
                <span>₹4,999</span>
              </div>
              <div className="flex justify-between text-xs font-black text-gray-700">
                <span>Estimated GST (18%)</span>
                <span>₹900</span>
              </div>
              <div className="flex justify-between text-sm font-black text-[#0d1b3e] pt-2 border-t border-blue-100">
                <span>Total payable amount</span>
                <span className="text-[#22c36a]">₹5,899</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  alert('Thank you! Initializing premium payment checkout...');
                  setShowOfferPopup(false);
                }}
                className="w-full bg-[#22c36a] hover:bg-[#1aad5c] text-white font-black text-xs py-3.5 rounded-xl uppercase tracking-wider shadow-md cursor-pointer"
              >
                Proceed To Purchase
              </button>
              <button
                onClick={() => setShowOfferPopup(false)}
                className="w-full border border-gray-200 hover:bg-gray-50 text-gray-500 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

interface JobPostingWizardProps {
  profile: any;
  onPublish: (jobObj: any, profileData?: any) => void;
  onCancel: () => void;
}

const JobPostingWizard = ({ profile, onPublish, onCancel }: JobPostingWizardProps) => {
  const [step, setStep] = useState(0); // 0: Details, 1: Preferences, 2: Screening, 3: Description, 4: Communication, 5: Create Profile
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [emailForVerification, setEmailForVerification] = useState(profile?.email || 'hr@digiphlox.com');
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  // Step 0: Job Details States
  const [postingAs, setPostingAs] = useState<'company' | 'consultancy'>('company');
  const [companyName, setCompanyName] = useState(profile?.businessName || 'DigiPhlox');
  const [companyRegisterNumber, setCompanyRegisterNumber] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [minExp, setMinExp] = useState('Min exp.');
  const [maxExp, setMaxExp] = useState('Max exp.');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [selectedPerks, setSelectedPerks] = useState<string[]>([]);
  const [searchPerkQuery, setSearchPerkQuery] = useState('');

  // Step 1: Candidate Preferences States
  const [department, setDepartment] = useState('Ex. Sales & Marketing');
  const [jobLocation, setJobLocation] = useState('');
  const [qualification, setQualification] = useState('Graduate');
  const [gender, setGender] = useState('Any');
  const [skills, setSkills] = useState('');

  // Step 2: Screening Questions States
  const [questions, setQuestions] = useState<string[]>([]);
  const [customQuestion, setCustomQuestion] = useState('');

  // Step 3: Job Description States
  const defaultTemplate = `Responsibilities:
* Collaborate with cross-functional teams on campaigns & initiatives
* Analyze performance metrics, optimize strategies
* Manage social media presence & create engaging content`;
  const [jobDescription, setJobDescription] = useState(defaultTemplate);
  const [companyAbout, setCompanyAbout] = useState('');

  // Step 4: Communication Preferences States
  const [allowCalls, setAllowCalls] = useState<'yes' | 'no'>('yes');
  const [recruiterName, setRecruiterName] = useState(profile?.name || 'HR Manager');
  const [recruiterPhone, setRecruiterPhone] = useState(profile?.phone || '9876543210');
  const [callStart, setCallStart] = useState('09:30 am');
  const [callEnd, setCallEnd] = useState('06:30 pm');
  const [callDays, setCallDays] = useState('Mon-Fri');

  // Step 5: Profile Creation States
  const [industry, setIndustry] = useState('');
  const [pincode, setPincode] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [password, setPassword] = useState('');

  const perksSuggestions = ['Office cab', 'Health insurance', 'Flexible hours', 'Free meals', 'PF Contribution', 'Performance Bonus'];
  const screeningSuggestions = [
    "What's your current salary?",
    "What's your expected salary?",
    "What's your notice period?",
    "Are you comfortable with English?",
    "What kind of job are you comfortable with?",
    "Are you willing to attend in-person interview?"
  ];

  const handleNext = () => {
    if (step === 0) {
      if (!jobTitle.trim()) {
        alert('Please enter a Job Title (e.g. Ex. Sales manager) to continue.');
        return;
      }
      setShowOtpModal(true);
    } else {
      setStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 0));
  };

  const handleOtpVerifySubmit = () => {
    setShowOtpModal(false);
    setStep(1); // Proceed to Candidate preferences
  };

  const handleAddPerk = (perk: string) => {
    if (selectedPerks.includes(perk)) {
      setSelectedPerks(prev => prev.filter(p => p !== perk));
    } else {
      setSelectedPerks(prev => [...prev, perk]);
    }
  };

  const handleAddSuggestedQuestion = (q: string) => {
    if (!questions.includes(q)) {
      setQuestions(prev => [...prev, q]);
    }
  };

  const handleAddCustomQuestion = () => {
    if (customQuestion.trim() && !questions.includes(customQuestion.trim())) {
      setQuestions(prev => [...prev, customQuestion.trim()]);
      setCustomQuestion('');
    }
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handlePostJobLiveSubmit = () => {
    if (step === 5) {
      if (!industry || !pincode || !companyAddress || !password) {
        alert('Please complete all company profile details to activate the job.');
        return;
      }
    }

    const salaryStr = minSalary && maxSalary ? `₹${Number(minSalary).toLocaleString('en-IN')}–₹${Number(maxSalary).toLocaleString('en-IN')}/mo` : 'Negotiable';
    const expStr = minExp === '0' ? 'Fresher' : `${minExp}–${maxExp} yrs`;
    const typeStr = 'Full-time';

    const newJobObj = {
      title: jobTitle || 'Senior Digital Marketing Executive',
      hospital: companyName || 'DigiPhlox',
      location: jobLocation || 'Haldwani',
      type: typeStr,
      salary: salaryStr,
      exp: expStr,
      specialty: department || 'Ex. Sales & Marketing',
      logo: profile?.logo || '🏥',
      posted: 'Just now',
    };

    const profileData = {
      name: recruiterName || profile?.name || 'HR Manager',
      email: emailForVerification || profile?.email || 'hr@digiphlox.com',
      businessName: companyName || profile?.businessName || 'DigiPhlox',
      businessType: postingAs === 'company' ? 'company' : 'consultancy',
      industry: industry,
      pincode: pincode,
      address: companyAddress,
      password: password,
      phone: recruiterPhone || profile?.phone || '9876543210'
    };

    onPublish(newJobObj, profileData);
  };

  const stepsList = [
    { label: 'Job details', index: 0 },
    { label: 'Candidate preferences', index: 1 },
    { label: 'Screening questions', index: 2 },
    { label: 'Job description', index: 3 },
    { label: 'Communication preferences', index: 4 }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 flex justify-center items-start px-4">
      <div className="max-w-6xl w-full bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden grid md:grid-cols-4 min-h-[70vh]">
        
        {/* Left Sidebar Steps */}
        <div className="bg-[#f8fafc] border-r border-gray-100 p-8 space-y-8 md:col-span-1 shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[#0d1b3e] font-black text-lg tracking-wide">Post a job</span>
            <span className="bg-[#22c36a]/15 text-[#22c36a] text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">Free</span>
          </div>

          <div className="relative space-y-6">
            {stepsList.map((s, idx) => {
              const isCompleted = step > idx;
              const isActive = step === idx;
              return (
                <div key={s.index} className="flex items-center gap-3.5 relative z-10">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                    isCompleted 
                      ? 'bg-[#22c36a] border-[#22c36a] text-white' 
                      : isActive 
                      ? 'bg-[#0d2b6b] border-[#0d2b6b] text-white ring-4 ring-[#0d2b6b]/10' 
                      : 'bg-white border-gray-200 text-gray-400'
                  }`}>
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <span className={`text-xs font-black transition-colors ${
                    isActive ? 'text-[#0d2b6b]' : isCompleted ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right pane */}
        <div className="md:col-span-3 p-8 flex flex-col justify-between relative">
          
          <div className="space-y-6 flex-1 pb-10">
            
            {/* STEP 0: JOB DETAILS */}
            {step === 0 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">You're posting this job as a:</label>
                  <div className="flex gap-2">
                    {['company', 'consultancy'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setPostingAs(t as any)}
                        className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                          postingAs === t 
                            ? 'bg-[#0d2b6b] text-white shadow-sm border border-[#0d2b6b]'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-500 border border-transparent'
                        }`}
                      >
                        {t === 'company' ? 'Company/Business' : 'Consultancy'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Your company name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="DigiPhlox"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Your company register number</label>
                  <input
                    type="text"
                    value={companyRegisterNumber}
                    onChange={(e) => setCompanyRegisterNumber(e.target.value)}
                    placeholder="Enter registration or license number (optional)"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Job title</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Ex. Sales manager"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Work experience</label>
                  <div className="flex items-center gap-3">
                    <select
                      value={minExp}
                      onChange={(e) => setMinExp(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 focus:outline-none outline-none focus:border-[#0d2b6b] bg-transparent"
                    >
                      <option value="Min exp.">Min exp.</option>
                      <option value="0">0 (Fresher)</option>
                      <option value="1">1 year</option>
                      <option value="2">2 years</option>
                      <option value="3">3 years</option>
                      <option value="5">5 years</option>
                    </select>
                    <span className="text-xs text-gray-400 font-bold uppercase">to</span>
                    <select
                      value={maxExp}
                      onChange={(e) => setMaxExp(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 focus:outline-none outline-none focus:border-[#0d2b6b] bg-transparent"
                    >
                      <option value="Max exp.">Max exp.</option>
                      <option value="1">1 year</option>
                      <option value="2">2 years</option>
                      <option value="3">3 years</option>
                      <option value="5">5 years</option>
                      <option value="10">10 years</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Salary per month (₹)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={minSalary}
                      onChange={(e) => setMinSalary(e.target.value)}
                      placeholder="Min"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
                    />
                    <span className="text-xs text-gray-400 font-bold uppercase">to</span>
                    <input
                      type="number"
                      value={maxSalary}
                      onChange={(e) => setMaxSalary(e.target.value)}
                      placeholder="Max"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Perks and benefits (Optional)</label>
                  <input
                    type="text"
                    value={searchPerkQuery}
                    onChange={(e) => setSearchPerkQuery(e.target.value)}
                    placeholder="Search for perks and benefits"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors mb-3"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {perksSuggestions.map((perk) => {
                      const isSelected = selectedPerks.includes(perk);
                      return (
                        <button
                          key={perk}
                          type="button"
                          onClick={() => handleAddPerk(perk)}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-[#0d2b6b] text-white border border-[#0d2b6b]'
                              : 'bg-[#f0f5ff] hover:bg-blue-100 text-[#0d2b6b] border border-transparent'
                          }`}
                        >
                          + {perk}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: CANDIDATE PREFERENCES */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 focus:outline-none outline-none focus:border-[#0d2b6b] bg-transparent"
                  >
                    <option value="Ex. Sales & Marketing">Ex. Sales & Marketing</option>
                    <option value="Doctors">Doctors & Physicians</option>
                    <option value="Nurses">Nursing Staff</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Radiology">Radiology & Imaging</option>
                  </select>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {['Digital Marketing', 'Marketing', 'Corporate Communication'].map((dept) => (
                      <button
                        key={dept}
                        type="button"
                        onClick={() => setDepartment(dept)}
                        className="px-3 py-1.5 rounded-full text-[10px] font-black bg-[#f0f5ff] hover:bg-blue-100 text-[#0d2b6b] cursor-pointer"
                      >
                        + {dept}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Job location</label>
                  <input
                    type="text"
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    placeholder="Search and add your job location"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Candidate's qualification</label>
                  <div className="flex flex-wrap gap-2">
                    {['12th Pass', 'Diploma', 'Graduate', 'Post-Graduate'].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setQualification(q)}
                        className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                          qualification === q
                            ? 'bg-[#0d2b6b] text-white border border-[#0d2b6b]'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-500 border border-transparent'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Gender preference</label>
                  <div className="flex gap-2">
                    {['Any', 'Male', 'Female'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                          gender === g
                            ? 'bg-[#0d2b6b] text-white border border-[#0d2b6b]'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-500 border border-transparent'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Add skills</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="Skills that are needed for this job"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: SCREENING QUESTIONS */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Screening questions</span>
                  <button
                    onClick={handleAddCustomQuestion}
                    className="text-xs bg-[#0d2b6b] text-white font-bold px-3 py-1.5 rounded-lg hover:bg-[#00b4a0] transition-colors cursor-pointer"
                  >
                    + Add a question
                  </button>
                </div>

                <input
                  type="text"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder="Enter custom screening question..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors mb-3"
                />

                <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5">Suggested questions:</p>
                  <div className="flex flex-col gap-2">
                    {screeningSuggestions.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => handleAddSuggestedQuestion(q)}
                        className="text-left py-2 px-3 border border-gray-100 hover:border-gray-200 rounded-xl bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer transition-all flex items-center justify-between"
                      >
                        <span>+ {q}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {questions.length > 0 && (
                  <div className="space-y-3 mt-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected questions:</p>
                    {questions.map((q, idx) => (
                      <div key={idx} className="bg-blue-50/30 border border-blue-100/50 rounded-xl p-3 flex justify-between items-center gap-3">
                        <span className="text-xs font-semibold text-gray-700">{q}</span>
                        <button
                          onClick={() => handleRemoveQuestion(idx)}
                          className="text-red-500 hover:text-red-700 font-bold text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: JOB DESCRIPTION */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="bg-blue-50/40 border border-blue-100/60 text-[#0d2b6b] p-3.5 rounded-xl text-xs font-semibold flex gap-2">
                  <span>💡</span>
                  <span>Auto-generated based on your details. You can edit it as well.</span>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Job description</label>
                    <button
                      onClick={() => setJobDescription(defaultTemplate)}
                      className="text-[11px] font-bold text-[#00b4a0] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      🔄 Regenerate
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-t-xl bg-gray-50/50 p-2 flex gap-3 border-b-0">
                    {['B', 'I', 'U', '• List', '1. List'].map((tool) => (
                      <button
                        key={tool}
                        type="button"
                        className="px-2 py-1 rounded text-xs font-bold text-gray-500 hover:bg-gray-200/50 cursor-pointer"
                      >
                        {tool}
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    maxLength={250}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-b-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors bg-white resize-none"
                  />
                  <div className="text-right text-[10px] text-gray-400 font-bold mt-1.5">
                    {jobDescription.length}/250
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Write something about your company (+)</label>
                  <input
                    type="text"
                    value={companyAbout}
                    onChange={(e) => setCompanyAbout(e.target.value)}
                    placeholder="e.g. DigiPhlox is a healthcare creative agency..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: COMMUNICATION PREFERENCES */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Allow candidates to call you directly for this job?</label>
                  <div className="flex gap-2">
                    {['yes', 'no'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setAllowCalls(option as any)}
                        className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                          allowCalls === option 
                            ? 'bg-[#0d2b6b] text-white border border-[#0d2b6b]'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-500 border border-transparent'
                        }`}
                      >
                        {option === 'yes' ? 'Yes' : 'No'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50/40 border border-blue-100/60 text-[#0d2b6b] p-3 rounded-xl text-xs font-semibold">
                  Complete KYC after posting job to get candidate calls
                </div>

                {allowCalls === 'yes' && (
                  <div className="space-y-4 bg-gray-50 border border-gray-100 rounded-2xl p-5">
                    <h4 className="text-xs font-black text-[#0d1b3e] uppercase tracking-wider">Candidate will be calling</h4>
                    
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Recruiter name</label>
                      <input
                        type="text"
                        value={recruiterName}
                        onChange={(e) => setRecruiterName(e.target.value)}
                        placeholder="HR Manager"
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Mobile number</label>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-gray-400 bg-white border border-gray-200 px-3 py-2 rounded-xl">+91</span>
                        <input
                          type="tel"
                          value={recruiterPhone}
                          onChange={(e) => setRecruiterPhone(e.target.value)}
                          placeholder="9876543210"
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none bg-white"
                        />
                      </div>
                      <p className="text-[9px] text-gray-400 mt-1 font-bold">You can stop receiving calls by editing the job later</p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Receive calls between</label>
                      <div className="flex items-center gap-3">
                        <select
                          value={callStart}
                          onChange={(e) => setCallStart(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 focus:outline-none outline-none focus:border-[#0d2b6b] bg-white"
                        >
                          <option value="09:30 am">09:30 am</option>
                          <option value="10:00 am">10:00 am</option>
                          <option value="11:00 am">11:00 am</option>
                        </select>
                        <span className="text-xs text-gray-400 font-bold uppercase">to</span>
                        <select
                          value={callEnd}
                          onChange={(e) => setCallEnd(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 focus:outline-none outline-none focus:border-[#0d2b6b] bg-white"
                        >
                          <option value="06:30 pm">06:30 pm</option>
                          <option value="05:00 pm">05:00 pm</option>
                          <option value="07:00 pm">07:00 pm</option>
                        </select>
                      </div>
                      <div className="mt-3">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Days</label>
                        <input
                          type="text"
                          value={callDays}
                          onChange={(e) => setCallDays(e.target.value)}
                          placeholder="Mon-Fri"
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none bg-white"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400/90 leading-relaxed mt-4 bg-white border border-gray-200/50 rounded-xl p-3">
                        ℹ️ Naukri allows job seekers call you only during your specified availability, but they may call anytime once they have your number.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 5: CREATE PROFILE & MAKE JOB LIVE */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="bg-[#f0f5ff] border border-blue-100 rounded-2xl p-5">
                  <h3 className="text-base font-black text-[#0d2b6b]">{jobTitle || 'Senior Digital Marketing Executive'}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-2 font-semibold">
                    <span>⏱ {minExp}–{maxExp} years</span>
                    <span>₹ {minSalary && maxSalary ? `${Number(minSalary).toLocaleString('en-IN')}–${Number(maxSalary).toLocaleString('en-IN')}/month` : 'Negotiable'}</span>
                    <span>📍 {jobLocation || 'Haldwani'}</span>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4">
                  <div className="border-b border-gray-100 pb-3">
                    <h4 className="text-lg font-black text-[#0d1b3e]">Create profile</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Create your profile to make this job live</p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl text-xs space-y-1 font-semibold text-gray-600">
                      <p>Company: <span className="text-[#0d1b3e] font-bold">{companyName}</span></p>
                      <p>Email: <span className="text-[#0d1b3e] font-bold">{emailForVerification}</span></p>
                      {companyRegisterNumber && <p>Reg No: <span className="text-[#0d1b3e] font-bold">{companyRegisterNumber}</span></p>}
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Industry</label>
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 focus:outline-none outline-none focus:border-[#0d2b6b] bg-transparent"
                      >
                        <option value="">Select industry</option>
                        <option value="Healthcare">Healthcare & Medicine</option>
                        <option value="Marketing">Marketing & Advertising</option>
                        <option value="Technology">Technology & Software</option>
                        <option value="Education">Education & Training</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Pin code</label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="Enter company pincode"
                        maxLength={6}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Company address</label>
                      <input
                        type="text"
                        value={companyAddress}
                        onChange={(e) => setCompanyAddress(e.target.value)}
                        placeholder="Enter company address"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Create password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer Actions */}
          <div className="flex justify-between items-center border-t border-gray-100 pt-4 shrink-0">
            {step > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="border border-gray-300 text-gray-600 font-bold px-6 py-2.5 rounded-xl hover:bg-gray-50 text-xs transition-colors cursor-pointer"
              >
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600 font-bold text-xs"
              >
                Cancel
              </button>
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-[#0d2b6b] hover:bg-[#00b4a0] text-white font-bold px-8 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePostJobLiveSubmit}
                className="bg-[#22c36a] hover:bg-[#1db05d] text-white font-black px-8 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md"
              >
                Make this job live
              </button>
            )}
          </div>
        </div>
      </div>

      {/* EMAIL VERIFICATION MODAL POPUP */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-[#0d1b3e]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative border border-gray-100 text-center">
            
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold p-1 transition-colors"
            >
              ×
            </button>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-black text-[#0d1b3e]">Verify email</h3>
              <p className="text-xs text-gray-400 font-semibold mt-2.5 flex items-center justify-center gap-1.5">
                We have sent an OTP to your email
                {isEditingEmail ? (
                  <input
                    type="email"
                    value={emailForVerification}
                    onChange={(e) => setEmailForVerification(e.target.value)}
                    onBlur={() => setIsEditingEmail(false)}
                    onKeyDown={(e) => { if (e.key === 'Enter') setIsEditingEmail(false); }}
                    className="border border-gray-200 px-2 py-0.5 rounded text-xs text-gray-700 outline-none"
                    autoFocus
                  />
                ) : (
                  <>
                    <span className="text-[#0d2b6b] font-black">{emailForVerification}</span>
                    <button
                      onClick={() => setIsEditingEmail(true)}
                      className="text-xs text-gray-400 hover:text-[#0d2b6b]"
                    >
                      ✏️
                    </button>
                  </>
                )}
              </p>
            </div>

            <div className="flex gap-2 justify-center my-6">
              {otpDigits.map((digit, i) => (
                <input
                  key={i}
                  id={`verify-otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!/^\d?$/.test(val)) return;
                    const nextDigits = [...otpDigits];
                    nextDigits[i] = val;
                    setOtpDigits(nextDigits);
                    if (val && i < 5) {
                      const nextInput = document.getElementById(`verify-otp-${i + 1}`) as HTMLInputElement;
                      nextInput?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !otpDigits[i] && i > 0) {
                      const prevInput = document.getElementById(`verify-otp-${i - 1}`) as HTMLInputElement;
                      prevInput?.focus();
                    }
                  }}
                  className={`w-11 h-12 text-center text-lg font-bold border-2 rounded-xl outline-none transition-all ${
                    digit ? 'border-[#00b4a0] bg-[#00b4a0]/5 text-[#0d1b3e]' : 'border-gray-200 text-gray-400'
                  } focus:border-[#00b4a0]`}
                />
              ))}
            </div>

            <p className="text-[11px] text-gray-400 font-bold mb-6">
              Didn't receive it?{' '}
              <button
                onClick={() => { alert('📬 Resent verification OTP to: ' + emailForVerification); setOtpDigits(['', '', '', '', '', '']); }}
                className="text-[#00b4a0] hover:underline font-black cursor-pointer"
              >
                Resend OTP
              </button>
            </p>

            <button
              onClick={handleOtpVerifySubmit}
              disabled={otpDigits.join('').length < 6}
              className="w-full bg-[#0d2b6b] hover:bg-[#00b4a0] text-white font-bold py-3.5 rounded-xl transition-all duration-300 disabled:opacity-40 flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
            >
              Verify OTP
            </button>
          </div>
        </div>
      )}
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

// ── CUSTOM SUB-COMPONENT: PRICING SCREEN ──
function PricingScreen({ onSelectPlan }: { onSelectPlan: (plan: { name: string; price: number }) => void }) {
  const plans = [
    {
      name: '30 Days Plan',
      price: 2500,
      description: 'Get access to candidate database for 30 days',
      recommended: false,
      features: [
        '2 SMB Job postings',
        'Get unlimited applies',
        'Instant CV recommendations from Naukri database, while applies follow',
        '60 CV views from Naukri database',
        'Job boost included'
      ],
      validity: 'Job validity 30 days',
      discount: ''
    },
    {
      name: '45 Days Plan',
      price: 3500,
      description: 'Get access to candidate database for 45 days',
      recommended: true,
      features: [
        '3 SMB Job postings',
        'Get unlimited applies',
        'Instant CV recommendations from Naukri database, while applies follow',
        '90 CV views from Naukri database',
        'Job boost included'
      ],
      validity: 'Job validity 45 days',
      discount: ''
    },
    {
      name: '60 Days Plan',
      price: 4950,
      description: 'Get access to candidate database for 60 days',
      recommended: false,
      features: [
        '5 SMB Job postings',
        'Get unlimited applies',
        'Instant CV recommendations from Naukri database, while applies follow',
        '150 CV views from Naukri database',
        'Job boost included'
      ],
      validity: 'Job validity 60 days',
      discount: ''
    },
    {
      name: 'Free',
      price: 0,
      description: 'Basic listing to start recruitment',
      recommended: false,
      features: [
        '1 Job posting',
        'Get unlimited applies (Not Included)',
        'Instant CV recommendations from Naukri database, while applies follow (Not Included)',
        '10 CV views from Naukri database',
        'Job boost (Not Included)'
      ],
      validity: 'Job validity 15 days',
      discount: ''
    }
  ];

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-[#0d2b6b] bg-[#0d2b6b]/5 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-wider">
            EXCLUSIVE PACKAGES FOR SMALL BUSINESSES & STARTUPS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0d1b3e] mt-5">
            Post a job and get access to Naukri's candidate database
          </h2>
          <p className="text-gray-500 mt-2 text-xs sm:text-sm font-semibold">
            Trusted by 9 Cr+ candidates | 5 Lakh+ employers | Call Sales: 1800-102-2558
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((p) => (
            <div key={p.name} className={`bg-white rounded-3xl p-6 shadow-xl border flex flex-col justify-between relative transition-all duration-300 hover:-translate-y-1.5 ${p.recommended ? 'border-2 border-blue-500 shadow-blue-500/10' : 'border-gray-100 shadow-gray-200/50'}`}>
              {p.recommended && (
                <span className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                  Best Value
                </span>
              )}
              <div>
                <h3 className="text-sm font-black text-gray-500 uppercase tracking-wide">{p.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-black text-[#0d1b3e]">
                    {p.price === 0 ? 'Free' : `₹${p.price.toLocaleString('en-IN')}`}
                  </span>
                  {p.price > 0 && (
                    <span className="text-[10px] text-gray-400 font-bold ml-1.5 uppercase tracking-wide">
                      *GST as applicable
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5 font-medium">{p.description}</p>
                <div className="h-[1px] bg-gray-100 my-5" />

                <div className="space-y-3 mb-6">
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Key Features</p>
                  {p.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className={f.includes('Not Included') ? 'text-gray-300' : 'text-green-500'}>
                        {f.includes('Not Included') ? '✗' : '✓'}
                      </span>
                      <span className={f.includes('Not Included') ? 'text-gray-400 line-through' : 'text-gray-700 font-bold'}>
                        {f.replace(' (Not Included)', '')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="h-[1px] bg-gray-100 my-5" />
                <div className="text-center mb-5 space-y-1">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-wide">{p.validity}</p>
                </div>
                <button
                  onClick={() => onSelectPlan({ name: p.name, price: p.price })}
                  className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    p.price === 0 
                      ? 'bg-green-50 hover:bg-green-500 text-green-500 hover:text-white border border-green-200 shadow-sm'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/10'
                  }`}
                >
                  {p.price === 0 ? 'Post a free job' : 'Buy now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PurchaseLoginScreen({ 
  onLogin, 
  onRegister, 
  planName,
  hasSelectedPlan
}: { 
  onLogin: (phone: string) => void; 
  onRegister: () => void; 
  planName: string;
  hasSelectedPlan: boolean;
}) {
  const [phone, setPhone] = useState('');
  const [googleLoggingIn, setGoogleLoggingIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim()) onLogin(phone.trim());
  };

  const handleGoogleLogin = () => {
    setGoogleLoggingIn(true);
    setTimeout(() => {
      setGoogleLoggingIn(false);
      onLogin('9876543210'); // Simulated profile number
    }, 1200);
  };

  return (
    <div className="py-16 bg-[#f0f5ff] min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-xl border border-gray-100 text-center mx-4">
        <span className="text-[#00b4a0] bg-[#00b4a0]/10 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
          {hasSelectedPlan ? 'Purchase Flow' : 'Recruiter Sign In'}
        </span>
        <h2 className="text-2xl font-black text-[#0d1b3e] mt-4 mb-2">Find & Hire the Right Talent With Us</h2>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-6">Trusted by 9 Cr+ candidates | 5 Lakh+ employers</p>

        {hasSelectedPlan && (
          <div className="bg-blue-50/50 border border-blue-100/50 rounded-2xl p-4 mb-6">
            <p className="text-xs font-bold text-gray-700">Continuing purchase for: <span className="text-[#0d2b6b] font-black">{planName} Plan</span></p>
          </div>
        )}

        <div className="space-y-6">
          {/* New User registration CTA */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 text-left">
            <h4 className="text-sm font-black text-[#0d1b3e] mb-1">New to 24medijobs?</h4>
            <p className="text-xs text-gray-500 mb-4">Complete your hospital details to configure your recruiter portal profile.</p>
            <button
              onClick={onRegister}
              className="w-full bg-[#00b4a0] hover:bg-[#009888] text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Continue as a New User
            </button>
          </div>

          <div className="flex items-center my-4">
            <div className="h-[1px] bg-gray-200 flex-1" />
            <span className="text-[10px] font-extrabold text-gray-400 px-4 uppercase tracking-widest">or Sign In</span>
            <div className="h-[1px] bg-gray-200 flex-1" />
          </div>

          {/* Existing User Login form */}
          <form onSubmit={handleSubmit} className="text-left space-y-4">
            <div>
              <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">Registered Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter 10-digit phone"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#0d2b6b] hover:bg-[#0d2b6b]/95 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md"
            >
              Verify OTP & Sign In
            </button>
          </form>

          <button
            onClick={handleGoogleLogin}
            disabled={googleLoggingIn}
            className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {googleLoggingIn ? (
              <span>Connecting to Google...</span>
            ) : (
              <>
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.76 14.94 1 12 1 7.35 1 3.39 3.65 1.5 7.5l3.86 3C6.31 7.49 8.94 5.04 12 5.04z" />
                  <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-2 3.71-4.94 3.71-8.6z" />
                  <path fill="#FBBC05" d="M5.36 14.5c-.24-.72-.38-1.49-.38-2.3s.14-1.58.38-2.3L1.5 6.9C.54 8.82 0 10.97 0 13.2s.54 4.38 1.5 6.3l3.86-3z" />
                  <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.7-2.87c-1.11.75-2.53 1.2-4.26 1.2-3.06 0-5.69-2.45-6.64-5.46L1.5 15.96C3.39 19.8 7.35 22.46 12 23z" />
                </svg>
                Continue with Google
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── CUSTOM SUB-COMPONENT: PAY NOW CHECKOUT SCREEN ──
function PayNowScreen({ 
  plan, 
  onPaymentSuccess 
}: { 
  plan: { name: string; price: number }; 
  onPaymentSuccess: () => void 
}) {
  const [gstNumber, setGstNumber] = useState('');
  const [upiId, setUpiId] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const subTotal = plan.price;
  const gst = subTotal * 0.18;
  const total = subTotal + gst;

  const handleVerifyUpi = () => {
    if (!upiId.trim() || !upiId.includes('@')) {
      alert('Please enter a valid UPI ID (e.g. user@okaxis)');
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsPaying(true);
      setTimeout(() => {
        setIsPaying(false);
        onPaymentSuccess();
      }, 1500);
    }, 1200);
  };

  const handleSimulateQRScan = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      onPaymentSuccess();
    }, 1800);
  };

  return (
    <div className="py-16 bg-[#f0f5ff] min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-3xl p-8 max-w-3xl w-full shadow-xl border border-gray-100 grid md:grid-cols-2 gap-8 mx-4">
        {/* Left: Invoice Summary */}
        <div className="space-y-6">
          <div>
            <span className="text-[#0d2b6b] bg-[#0d2b6b]/5 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider">Plan Details</span>
            <h3 className="text-xl font-black text-[#0d1b3e] mt-3">Plan: {plan.name}</h3>
            <p className="text-xs text-[#00b4a0] font-bold mt-1">Pack of 2 Job Postings and Naukri database access (60 CVs)</p>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-3">
            <div className="flex justify-between text-xs font-bold text-gray-500">
              <span>Sub total</span>
              <span>₹{subTotal.toLocaleString('en-IN')}.00</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-gray-500">
              <span>Estimated GST (18%)</span>
              <span>+ ₹{gst.toLocaleString('en-IN')}.00</span>
            </div>
            <div className="h-[1px] bg-gray-200/60 my-2" />
            <div className="flex justify-between text-sm font-black text-[#0d1b3e]">
              <span>Total payable amount</span>
              <span>₹{total.toLocaleString('en-IN')}.00</span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">Add GST number (Optional)</label>
            <input
              type="text"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
              placeholder="e.g. 07AAAAA1111A1Z1"
              maxLength={15}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors uppercase"
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-xl text-[10px] leading-relaxed flex gap-2">
            <span>⚠️</span>
            <span>
              <strong>Note:</strong> To activate your subscription, it’s mandatory to complete the KYC process as mandated by government regulations. <span className="underline cursor-pointer font-bold">Know more</span>
            </span>
          </div>
        </div>

        {/* Right: Payment Gateway */}
        <div className="border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8 flex flex-col justify-center space-y-6">
          <div className="text-center">
            <h4 className="text-sm font-black text-[#0d1b3e] mb-1">Select Payment Mode</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Secure UPI Checkout</p>
          </div>

          {/* QR Code toggle */}
          <div className="space-y-4">
            <button
              onClick={() => setShowQR(!showQR)}
              className="w-full border-2 border-dashed border-[#0d2b6b]/30 hover:border-[#00b4a0] bg-gray-50/50 hover:bg-white rounded-2xl p-4 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1.5"
            >
              <span className="text-lg">📱</span>
              <span className="text-xs font-black text-gray-700">{showQR ? 'Hide UPI QR Code' : 'Show QR Code'}</span>
              <p className="text-[9px] text-gray-400 font-medium">Scan using any BHIM, GPAY, PhonePe app</p>
            </button>

            {showQR && (
              <div className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-lg flex flex-col items-center justify-center">
                {/* Mock SVG QR Code */}
                <svg className="w-28 h-28 text-gray-800" viewBox="0 0 100 100">
                  <rect width="100" height="100" fill="#fff" />
                  <rect x="10" y="10" width="20" height="20" fill="currentColor" />
                  <rect x="15" y="15" width="10" height="10" fill="#fff" />
                  <rect x="70" y="10" width="20" height="20" fill="currentColor" />
                  <rect x="75" y="15" width="10" height="10" fill="#fff" />
                  <rect x="10" y="70" width="20" height="20" fill="currentColor" />
                  <rect x="15" y="75" width="10" height="10" fill="#fff" />
                  <rect x="40" y="20" width="8" height="8" fill="currentColor" />
                  <rect x="55" y="30" width="10" height="4" fill="currentColor" />
                  <rect x="35" y="45" width="15" height="5" fill="currentColor" />
                  <rect x="45" y="60" width="6" height="10" fill="currentColor" />
                  <rect x="55" y="75" width="10" height="10" fill="currentColor" />
                  <rect x="30" y="75" width="5" height="5" fill="currentColor" />
                </svg>
                <p className="text-[10px] font-bold text-gray-700 mt-3 leading-relaxed">Scan the QR code using any UPI app to complete your payment</p>
                <button
                  onClick={handleSimulateQRScan}
                  disabled={isPaying}
                  className="mt-3 bg-[#22c36a] hover:bg-[#1db05d] text-white text-[10px] font-extrabold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  {isPaying ? 'Processing payment...' : '✓ Simulated QR Scan Completed'}
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center">
            <div className="h-[1px] bg-gray-200/80 flex-1" />
            <span className="text-[9px] font-extrabold text-gray-400 px-3 uppercase tracking-widest">or</span>
            <div className="h-[1px] bg-gray-200/80 flex-1" />
          </div>

          {/* UPI ID input */}
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5">Enter UPI ID</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="username@upi"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-xs font-semibold outline-none transition-colors"
              />
            </div>
            <button
              onClick={handleVerifyUpi}
              disabled={isVerifying || isPaying}
              className="w-full bg-[#0d2b6b] hover:bg-[#00b4a0] text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {isVerifying ? 'Verifying ID...' : isPaying ? 'Processing Payment...' : 'Verify & Pay'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EmployerCTA({ 
  onNavigate, 
  jobs, 
  setJobs, 
  employerProfile, 
  setEmployerProfile,
  initialStep
}: EmployerCTAProps & { initialStep?: 'pricing' | 'login' }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'pricing' | 'login' | 'profile-setup' | 'pay-now' | 'job-details' | 'location' | 'compensation' | 'requirements' | 'interviewer' | 'preview' | 'publish'>(employerProfile ? 'home' : (initialStep || 'pricing'));
  const [jobData, setJobData] = useState<any>({});
  const [tempEmployerPhone, setTempEmployerPhone] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: number } | null>(null);

  useEffect(() => {
    if (initialStep === 'login') {
      setSelectedPlan(null);
    }
  }, [initialStep]);

  useEffect(() => {
    if (!employerProfile) {
      setCurrentPage(initialStep || 'pricing');
    } else if (currentPage === 'login' || currentPage === 'pricing' || currentPage === 'pay-now') {
      if (selectedPlan && selectedPlan.price === 0) {
        setCurrentPage('job-details');
      } else {
        setCurrentPage('home');
      }
    }
  }, [employerProfile, initialStep, selectedPlan, currentPage]);

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
        
        if (selectedPlan && selectedPlan.price > 0) {
          setCurrentPage('pay-now');
        } else if (selectedPlan && selectedPlan.price === 0) {
          setCurrentPage('job-details');
        } else {
          setCurrentPage('home');
        }
      } else {
        if (error) console.error('Error fetching employer profile:', error);
        
        // Setup temporary default profile for new recruiters to log them in instantly
        setEmployerProfile({
          name: 'HR Manager',
          email: 'hr@digiphlox.com',
          businessName: 'DigiPhlox',
          logo: '🏥',
          phone: phone || '9876543210'
        });

        if (selectedPlan && selectedPlan.price > 0) {
          setCurrentPage('pay-now');
        } else if (selectedPlan && selectedPlan.price === 0) {
          setCurrentPage('job-details');
        } else {
          setCurrentPage('home'); // Go to recruiter dashboard
        }
      }
    } catch (err) {
      console.error(err);
      setEmployerProfile({
        name: 'HR Manager',
        email: 'hr@digiphlox.com',
        businessName: 'DigiPhlox',
        logo: '🏥',
        phone: '9876543210'
      });
      if (selectedPlan && selectedPlan.price > 0) {
        setCurrentPage('pay-now');
      } else if (selectedPlan && selectedPlan.price === 0) {
        setCurrentPage('job-details');
      } else {
        setCurrentPage('home');
      }
    }
  };

  const handleNext = (data: any, nextPage: typeof currentPage) => {
    setJobData({ ...jobData, ...data });
    setCurrentPage(nextPage);
  };

  const handlePublish = async (newJobObj: any, profileData?: any) => {
    if (profileData) {
      try {
        const empData = {
          id: profileData.phone,
          name: profileData.name,
          email: profileData.email,
          business_name: profileData.businessName,
          business_type: profileData.businessType,
          industry: profileData.industry,
          pincode: profileData.pincode,
          address: profileData.address,
          password: profileData.password,
          logo: '🏥',
          phone: profileData.phone
        };
        await supabase.from('employer_profiles').upsert(empData);
        setEmployerProfile(profileData);
      } catch (err) {
        console.error('Error saving employer profile in publish:', err);
      }
    }

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

    alert('✅ Job posted successfully!');
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
            setCurrentPage('pricing');
          }}
        />
      );
    }

    switch (currentPage) {
      case 'pricing':
        return (
          <PricingScreen 
            onSelectPlan={(plan) => {
              setSelectedPlan(plan);
              setCurrentPage('login');
            }} 
          />
        );
      case 'login':
        return (
          <PurchaseLoginScreen 
            planName={selectedPlan?.name || 'Free'}
            hasSelectedPlan={!!selectedPlan}
            onLogin={handleLogin}
            onRegister={() => setCurrentPage('profile-setup')}
          />
        );
      case 'pay-now':
        return (
          <PayNowScreen 
            plan={selectedPlan || { name: 'Standard', price: 400 }}
            onPaymentSuccess={() => {
              alert('🎉 Payment verified successfully! Recruit credits unlocked.');
              setCurrentPage('home');
              onNavigate('jobs');
            }}
          />
        );
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
              
              if (selectedPlan && selectedPlan.price > 0) {
                setCurrentPage('pay-now');
              } else if (selectedPlan && selectedPlan.price === 0) {
                setCurrentPage('job-details');
              } else {
                setCurrentPage('home');
              }
            }} 
            onBack={() => setCurrentPage('pricing')} 
          />
        );
      case 'job-details':
        return (
          <JobPostingWizard 
            profile={employerProfile}
            onPublish={handlePublish}
            onCancel={() => setCurrentPage('home')}
          />
        );
      default:
        return (
          <PricingScreen 
            onSelectPlan={(plan) => {
              setSelectedPlan(plan);
              setCurrentPage('login');
            }} 
          />
        );
    }
  };

  return <>{renderContent()}</>;
}
