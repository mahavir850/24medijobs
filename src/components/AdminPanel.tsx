import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

interface AdminPanelProps {
  onNavigate: (page: string) => void
}

export default function AdminPanel({ onNavigate }: AdminPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('admin_logged_in') === 'true'
  })

  // Login credentials state
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Database lists state
  const [jobs, setJobs] = useState<any[]>([])
  const [employers, setEmployers] = useState<any[]>([])
  const [seekers, setSeekers] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [isLoadingData, setIsLoadingData] = useState(false)

  // Sidebar navigation tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'employers' | 'seekers' | 'applications'>('overview')

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setIsLoggingIn(true)

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .maybeSingle()

      if (!error && data) {
        setIsLoggedIn(true)
        localStorage.setItem('admin_logged_in', 'true')
        setLoginError('')
      } else {
        setLoginError('Invalid Administrator credentials')
      }
    } catch (err) {
      console.error(err)
      setLoginError('Connection failure. Please retry.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('admin_logged_in')
    setUsername('')
    setPassword('')
  }

  // Load all lists from Supabase
  const loadDatabaseData = async () => {
    setIsLoadingData(true)
    try {
      const [jobsRes, empRes, seekerRes, appRes] = await Promise.all([
        supabase.from('jobs').select('*').order('id', { ascending: false }),
        supabase.from('employer_profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('seeker_profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('applications').select('*').order('id', { ascending: false })
      ])

      if (jobsRes.data) setJobs(jobsRes.data)
      if (empRes.data) setEmployers(empRes.data)
      if (seekerRes.data) setSeekers(seekerRes.data)
      if (appRes.data) setApplications(appRes.data)
    } catch (err) {
      console.error('Error fetching database lists:', err)
    } finally {
      setIsLoadingData(false)
    }
  }

  useEffect(() => {
    if (isOpen && isLoggedIn) {
      loadDatabaseData()
    }
  }, [isOpen, isLoggedIn])

  // Admin delete actions
  const handleDeleteJob = async (id: number) => {
    if (confirm('Are you sure you want to permanently delete this job listing?')) {
      await supabase.from('jobs').delete().eq('id', id)
      loadDatabaseData()
    }
  }

  const handleDeleteEmployer = async (id: string) => {
    if (confirm('Are you sure you want to delete this hospital profile?')) {
      await supabase.from('employer_profiles').delete().eq('id', id)
      loadDatabaseData()
    }
  }

  const handleDeleteSeeker = async (id: string) => {
    if (confirm('Are you sure you want to delete this candidate profile?')) {
      await supabase.from('seeker_profiles').delete().eq('id', id)
      loadDatabaseData()
    }
  }

  const handleDeleteApplication = async (id: number) => {
    if (confirm('Are you sure you want to retract this candidate application?')) {
      await supabase.from('applications').delete().eq('id', id)
      loadDatabaseData()
    }
  }

  // Simulator for CV download
  const handleDownloadCV = (seeker: any) => {
    alert(`📥 Downloading resume for ${seeker.name}...`);
    
    const element = document.createElement("a");
    const file = new Blob([
      `24medijobs PORTAL - CANDIDATE RESUME SUMMARY\n`,
      `==========================================\n\n`,
      `Name: ${seeker.name}\n`,
      `Email: ${seeker.email}\n`,
      `Phone: ${seeker.phone}\n`,
      `Specialty: ${seeker.specialty}\n`,
      `Highest Qualification: ${seeker.qualification}\n`,
      `Experience: ${seeker.experience}\n`,
      `Current Role: ${seeker.current_role || 'N/A'}\n`,
      `Current Hospital: ${seeker.current_hospital || 'N/A'}\n`,
      `Medical License Details:\n`,
      `  Registration No: ${seeker.registration_number || 'N/A'}\n`,
      `  Registration Council: ${seeker.council || 'N/A'}\n`,
      `Skills: ${seeker.skills || 'N/A'}\n\n`,
      `Summary / Bio:\n`,
      `  "${seeker.bio || 'No bio entered'}"\n\n`,
      `File Attachment: ${seeker.resume_name || 'My_Resume.pdf'}\n\n`,
      `Downloaded from 24medijobs Admin Portal.`
    ], { type: 'text/plain' });
    
    element.href = URL.createObjectURL(file);
    element.download = `${seeker.name.replace(/\s+/g, '_')}_Resume.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  return (
    <>
      {/* Floating admin panel text trigger bottom left */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-3 left-4 z-50 text-[10px] text-gray-400 hover:text-[#00b4a0] font-bold uppercase tracking-widest transition-colors duration-150 cursor-pointer"
      >
        Admin Panel
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#0d1b3e]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-6xl shadow-2xl relative border border-gray-100 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal close icon */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold p-1 transition-colors z-20"
            >
              ×
            </button>

            {!isLoggedIn ? (
              // ── ADMIN LOGIN DIALOG ──
              <div className="flex-1 flex flex-col justify-center items-center p-8 max-w-md mx-auto w-full">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-[#0d2b6b]/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
                    🔐
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#0d1b3e]">Admin Authentication</h3>
                  <p className="text-xs text-gray-500 mt-1">Authorized administration staff credentials check</p>
                </div>

                {loginError && (
                  <div className="w-full bg-red-50 border border-red-200 text-red-500 rounded-xl p-3 text-xs font-semibold mb-4 text-center">
                    ⚠️ {loginError}
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="w-full space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Username</label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="admin"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-sm font-semibold outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#0d2b6b] text-sm font-semibold outline-none transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full bg-[#0d2b6b] hover:bg-[#00b4a0] text-white font-bold py-3.5 rounded-xl transition-all duration-300 disabled:opacity-40 flex items-center justify-center gap-2 shadow-md text-sm mt-6"
                  >
                    {isLoggingIn ? 'Verifying Credentials...' : '🔐 Sign In as Administrator'}
                  </button>
                </form>
              </div>
            ) : (
              // ── MODERN ADMIN DASHBOARD VIEW ──
              <div className="flex-1 flex flex-col md:flex-row max-h-[90vh] overflow-hidden">
                {/* Left navigation sidebar */}
                <div className="md:w-64 bg-[#0d1b3e] text-white p-6 flex flex-col justify-between shrink-0">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2.5 pb-5 border-b border-white/10">
                      <span className="text-2xl">🛡️</span>
                      <div>
                        <h4 className="font-extrabold text-sm tracking-wide">24medijobs</h4>
                        <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Admin Control</p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {[
                        { id: 'overview', label: 'Dashboard', icon: '📊' },
                        { id: 'jobs', label: 'Jobs Feed', icon: '📢' },
                        { id: 'employers', label: 'Hospitals', icon: '🏥' },
                        { id: 'seekers', label: 'Candidates', icon: '👤' },
                        { id: 'applications', label: 'Applications', icon: '📝' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`w-full text-left font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center gap-2.5 ${
                            activeTab === tab.id
                              ? 'bg-[#00b4a0] text-white shadow-md'
                              : 'text-white/70 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span>{tab.icon}</span>
                          <span>{tab.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10 space-y-3">
                    <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">
                      Administrator Session
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-600/20 border border-red-600/30 hover:bg-red-600 text-red-100 hover:text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
                    >
                      🚪 Log Out
                    </button>
                  </div>
                </div>

                {/* Right content viewport */}
                <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
                  {/* Top Bar */}
                  <div className="bg-white border-b border-gray-100 py-4 px-6 flex justify-between items-center shrink-0">
                    <h3 className="font-extrabold text-[#0d1b3e] text-lg capitalize flex items-center gap-2">
                      {activeTab === 'overview' && '📊 Platform Overview'}
                      {activeTab === 'jobs' && '📢 Jobs Management'}
                      {activeTab === 'employers' && '🏥 Hospital Employers'}
                      {activeTab === 'seekers' && '👤 Registered Candidates'}
                      {activeTab === 'applications' && '📝 Application Logs'}
                    </h3>
                    <button
                      onClick={loadDatabaseData}
                      disabled={isLoadingData}
                      className="text-xs bg-[#f0f5ff] text-[#0d2b6b] border border-blue-100 hover:bg-blue-100 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      🔄 {isLoadingData ? 'Refreshing...' : 'Refresh Database'}
                    </button>
                  </div>

                  {/* Scrollable grid viewport */}
                  <div className="flex-1 overflow-y-auto p-6">
                    {isLoadingData ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin text-3xl mb-3 text-[#0d2b6b]">⌛</div>
                          <p className="text-xs text-[#5a6a8a] font-semibold">Reading database tables...</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* ── TAB: OVERVIEW ── */}
                        {activeTab === 'overview' && (
                          <div className="space-y-6">
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                              {[
                                { count: jobs.length, label: 'Active Jobs', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100', icon: '📢' },
                                { count: employers.length, label: 'Employers', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100', icon: '🏥' },
                                { count: seekers.length, label: 'Candidates', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100', icon: '👤' },
                                { count: applications.length, label: 'Applications', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100', icon: '📝' },
                              ].map((stat) => (
                                <div key={stat.label} className={`border rounded-2xl p-5 bg-white shadow-sm flex items-center justify-between`}>
                                  <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                                    <p className={`text-3xl font-black ${stat.color}`}>{stat.count}</p>
                                  </div>
                                  <div className={`w-12 h-12 rounded-xl border ${stat.bg} flex items-center justify-center text-2xl`}>
                                    {stat.icon}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                              <h4 className="font-extrabold text-[#0d1b3e] text-base mb-3">Welcome to the Admin Portal</h4>
                              <p className="text-xs text-[#5a6a8a] leading-relaxed">
                                Use the sidebar navigation tabs to view all database records configured inside your Supabase backend.
                                You have administrative controls to delete records and download candidate resumes directly.
                              </p>
                              <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-800 p-3.5 rounded-xl text-xs flex gap-2">
                                <span>💡</span>
                                <span className="leading-relaxed">All changes made here interact directly with the active Supabase Postgres tables (`jobs`, `employer_profiles`, `seeker_profiles`, and `applications`).</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ── TAB: JOBS MANAGEMENT ── */}
                        {activeTab === 'jobs' && (
                          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                                    <th className="py-3 px-4">ID</th>
                                    <th className="py-3 px-4">Job Details</th>
                                    <th className="py-3 px-4">Hospital</th>
                                    <th className="py-3 px-4">Location</th>
                                    <th className="py-3 px-4">Type</th>
                                    <th className="py-3 px-4">Salary</th>
                                    <th className="py-3 px-4">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {jobs.map((job) => (
                                    <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                                      <td className="py-3 px-4 font-mono font-bold text-gray-500">{job.id}</td>
                                      <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                          <span className="text-lg shrink-0">{job.logo && job.logo.length > 4 ? '🏥' : job.logo}</span>
                                          <div>
                                            <p className="font-bold text-[#0d1b3e]">{job.title}</p>
                                            <p className="text-[10px] text-[#00b4a0] font-semibold">{job.specialty}</p>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="py-3 px-4 font-semibold text-gray-700">{job.hospital}</td>
                                      <td className="py-3 px-4 text-gray-600 font-medium">{job.location}</td>
                                      <td className="py-3 px-4">
                                        <span className="bg-blue-50 text-blue-700 font-bold text-[10px] px-2 py-0.5 rounded-full">{job.type}</span>
                                      </td>
                                      <td className="py-3 px-4 text-gray-600 font-bold">{job.salary}</td>
                                      <td className="py-3 px-4">
                                        <button
                                          onClick={() => handleDeleteJob(job.id)}
                                          className="text-red-500 hover:text-red-700 font-bold hover:underline"
                                        >
                                          Delete
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                  {jobs.length === 0 && (
                                    <tr>
                                      <td colSpan={7} className="text-center py-8 text-gray-400 italic">No job listings found.</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* ── TAB: EMPLOYERS ── */}
                        {activeTab === 'employers' && (
                          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                                    <th className="py-3 px-4">Hospital Info</th>
                                    <th className="py-3 px-4">Representative</th>
                                    <th className="py-3 px-4">Designation</th>
                                    <th className="py-3 px-4">Email</th>
                                    <th className="py-3 px-4">Contact Phone</th>
                                    <th className="py-3 px-4">Docs</th>
                                    <th className="py-3 px-4">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {employers.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                                      <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-gray-200">
                                            {emp.logo ? <img src={emp.logo} alt="Logo" className="w-full h-full object-cover" /> : <div className="text-center">🏥</div>}
                                          </div>
                                          <div>
                                            <p className="font-bold text-[#0d1b3e]">{emp.business_name}</p>
                                            <p className="text-[9px] text-[#00b4a0] uppercase tracking-wider font-bold">{emp.business_type?.replace('_', ' ')}</p>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="py-3 px-4 font-semibold text-gray-700">{emp.name}</td>
                                      <td className="py-3 px-4 text-gray-600 font-medium">{emp.designation}</td>
                                      <td className="py-3 px-4 font-medium text-gray-500 font-mono">{emp.email}</td>
                                      <td className="py-3 px-4 font-mono font-bold text-gray-600">{emp.phone}</td>
                                      <td className="py-3 px-4">
                                        <p className="text-[10px] text-gray-500 font-mono">
                                          {emp.gst_number && `GST: ${emp.gst_number}`}
                                          {!emp.gst_number && emp.pan_number && `PAN: ${emp.pan_number}`}
                                          {!emp.gst_number && !emp.pan_number && emp.aadhar_number && `Aadhar: XXXX-XXXX-${emp.aadhar_number.slice(-4)}`}
                                        </p>
                                      </td>
                                      <td className="py-3 px-4">
                                        <button
                                          onClick={() => handleDeleteEmployer(emp.id)}
                                          className="text-red-500 hover:text-red-700 font-bold hover:underline"
                                        >
                                          Delete
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                  {employers.length === 0 && (
                                    <tr>
                                      <td colSpan={7} className="text-center py-8 text-gray-400 italic">No registered hospitals found.</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* ── TAB: SEEKERS ── */}
                        {activeTab === 'seekers' && (
                          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                                    <th className="py-3 px-4">Candidate Info</th>
                                    <th className="py-3 px-4">Specialty</th>
                                    <th className="py-3 px-4">Highest Degree</th>
                                    <th className="py-3 px-4">Experience</th>
                                    <th className="py-3 px-4">License Reg. No</th>
                                    <th className="py-3 px-4">Resume / CV</th>
                                    <th className="py-3 px-4">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {seekers.map((seeker) => (
                                    <tr key={seeker.id} className="hover:bg-gray-50/50 transition-colors">
                                      <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-blue-50 border border-gray-200 flex items-center justify-center text-lg">
                                            {seeker.avatar ? <img src={seeker.avatar} alt="Avatar" className="w-full h-full object-cover" /> : '👤'}
                                          </div>
                                          <div>
                                            <p className="font-bold text-[#0d1b3e]">{seeker.name}</p>
                                            <p className="text-[10px] text-gray-400 font-mono">{seeker.phone}</p>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="py-3 px-4 font-bold text-[#0d2b6b]">{seeker.specialty}</td>
                                      <td className="py-3 px-4 font-medium text-gray-600">{seeker.qualification}</td>
                                      <td className="py-3 px-4 font-semibold text-gray-700">{seeker.experience}</td>
                                      <td className="py-3 px-4 font-mono font-medium text-gray-500">
                                        {seeker.registration_number ? `${seeker.registration_number} (${seeker.council})` : 'N/A'}
                                      </td>
                                      <td className="py-3 px-4">
                                        <button
                                          onClick={() => handleDownloadCV(seeker)}
                                          className="text-[#00b4a0] hover:text-[#009888] font-bold hover:underline flex items-center gap-1"
                                        >
                                          📥 {seeker.resume_name || 'My_Resume.pdf'}
                                        </button>
                                      </td>
                                      <td className="py-3 px-4">
                                        <button
                                          onClick={() => handleDeleteSeeker(seeker.id)}
                                          className="text-red-500 hover:text-red-700 font-bold hover:underline"
                                        >
                                          Delete
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                  {seekers.length === 0 && (
                                    <tr>
                                      <td colSpan={7} className="text-center py-8 text-gray-400 italic">No candidates found.</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* ── TAB: APPLICATIONS ── */}
                        {activeTab === 'applications' && (
                          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                                    <th className="py-3 px-4">Application ID</th>
                                    <th className="py-3 px-4">Job ID</th>
                                    <th className="py-3 px-4">Seeker Phone</th>
                                    <th className="py-3 px-4">Submission Time</th>
                                    <th className="py-3 px-4">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {applications.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                                      <td className="py-3 px-4 font-mono font-bold text-gray-500">{app.id}</td>
                                      <td className="py-3 px-4 font-semibold text-[#0d1b3e]">{app.job_id}</td>
                                      <td className="py-3 px-4 font-mono text-gray-700 font-semibold">{app.seeker_phone}</td>
                                      <td className="py-3 px-4 text-gray-400 font-medium">
                                        {new Date(app.created_at).toLocaleString('en-IN')}
                                      </td>
                                      <td className="py-3 px-4">
                                        <button
                                          onClick={() => handleDeleteApplication(app.id)}
                                          className="text-red-500 hover:text-red-700 font-bold hover:underline"
                                        >
                                          Retract
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                  {applications.length === 0 && (
                                    <tr>
                                      <td colSpan={5} className="text-center py-8 text-gray-400 italic">No applications found.</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
