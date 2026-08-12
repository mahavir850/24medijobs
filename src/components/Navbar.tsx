import { useState, useEffect } from 'react'
import logo from '@/imports/medijob.jpeg'
import { supabase } from '../supabaseClient'

function NavLogo() {
  return (
    <div className="flex items-center">
      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/60 shadow-md z-10">
        <img src={logo} alt="24medijobs" className="w-full h-full object-cover object-center" />
      </div>
    </div>
  )
}

interface NavbarProps {
  activePage: string
  onNavigate: (page: string) => void
  seekerPhone?: string
  setSeekerPhone?: (phone: string) => void
  employerProfile?: any
  setEmployerProfile?: (profile: any) => void
}

export default function Navbar({ 
  activePage, 
  onNavigate, 
  seekerPhone, 
  setSeekerPhone, 
  employerProfile, 
  setEmployerProfile 
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavbarLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && employerProfile) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64 = reader.result as string
        const updated = { ...employerProfile, logo: base64 }
        if (setEmployerProfile) setEmployerProfile(updated)
        
        try {
          await supabase
            .from('employer_profiles')
            .update({ logo: base64 })
            .eq('id', employerProfile.email || employerProfile.phone)
        } catch (err) {
          console.error('Error updating company logo:', err)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const navLinks = [
    { label: 'Home', page: 'home' },
    { label: 'Find Jobs', page: 'jobs' },
    { label: 'Categories', page: 'categories' },
    { label: 'About', page: 'about' },
  ]

  const renderDesktopCTA = () => {
    if (employerProfile) {
      return (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 shadow-sm">
            
            {/* Clickable Recruiter Logo */}
            <label 
              htmlFor="navbar-logo-input" 
              className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/40 cursor-pointer relative group block shadow-sm"
              title="Click to edit logo"
            >
              {employerProfile.logo && employerProfile.logo.length > 4 ? (
                <img src={employerProfile.logo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="w-full h-full flex items-center justify-center bg-blue-50 text-xs font-black">🏥</span>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-150">
                <span className="text-[7px] text-white font-black uppercase tracking-wider">Edit</span>
              </div>
            </label>
            <input 
              id="navbar-logo-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleNavbarLogoChange}
            />

            <div className="flex flex-col text-left">
              <span className={`text-xs font-black truncate max-w-[120px] leading-tight ${scrolled ? 'text-[#0d2b6b]' : 'text-white'}`}>
                {employerProfile.businessName}
              </span>
              {employerProfile.gstNumber && (
                <span className="text-[8px] font-black text-gray-400 truncate max-w-[120px] mt-0.5 leading-none uppercase tracking-wide">
                  Reg: {employerProfile.gstNumber}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              if (setEmployerProfile) setEmployerProfile(null)
              onNavigate('home')
            }}
            className="text-xs font-bold text-red-500 bg-red-50 px-3.5 py-2.5 rounded-lg hover:bg-red-100 transition-colors border border-red-100 cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      )
    }

    if (seekerPhone) {
      return (
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2 bg-[#00b4a0]/10 hover:bg-[#00b4a0]/15 text-[#00b4a0] px-4 py-2.5 rounded-xl border border-[#00b4a0]/20 transition-all font-semibold text-sm"
          >
            <span>👤</span> <span className="font-mono text-xs">{seekerPhone}</span> (My Profile)
          </button>
          <button
            onClick={() => {
              if (setSeekerPhone) setSeekerPhone('')
              onNavigate('home')
            }}
            className="text-xs font-bold text-red-500 bg-red-50 px-3.5 py-2.5 rounded-lg hover:bg-red-100 transition-colors border border-red-100"
          >
            Sign Out
          </button>
        </div>
      )
    }

    return (
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
          className={`text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 border flex items-center gap-2 cursor-pointer ${
            scrolled
              ? 'border-[#0d2b6b] text-[#0d2b6b] hover:bg-[#0d2b6b] hover:text-white'
              : 'border-white text-white hover:bg-white/10'
          }`}
        >
          <span>🚀 App</span>
          <span className="text-[10px]">▼</span>
        </button>
        
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn text-left">
            <button
              onClick={() => {
                onNavigate('login');
                setDropdownOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#0d1b3e] hover:bg-[#f0f5ff] hover:text-[#00b4a0] transition-colors cursor-pointer"
            >
              👤 Candidate Login
            </button>
            <div className="h-[1px] bg-gray-100 my-1" />
            <button
              onClick={() => {
                onNavigate('employers-login');
                setDropdownOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#0d1b3e] hover:bg-[#f0f5ff] hover:text-[#00b4a0] transition-colors cursor-pointer"
            >
              🏥 Post Job Login
            </button>
          </div>
        )}
      </div>
    )
  }

  const renderMobileCTA = () => {
    if (employerProfile) {
      return (
        <div className="flex flex-col gap-2 pt-2">
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
            
            {/* Clickable Mobile Recruiter Logo */}
            <label 
              htmlFor="mobile-navbar-logo-input" 
              className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-[#00b4a0] relative group cursor-pointer block"
              title="Click to edit logo"
            >
              {employerProfile.logo && employerProfile.logo.length > 4 ? (
                <img src={employerProfile.logo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="w-full h-full flex items-center justify-center bg-blue-100 text-xs font-bold">🏥</span>
              )}
            </label>
            <input 
              id="mobile-navbar-logo-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleNavbarLogoChange}
            />

            <div className="text-left min-w-0 flex-1">
              <p className="text-xs font-black text-[#0d2b6b] truncate">{employerProfile.businessName}</p>
              {employerProfile.gstNumber && (
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-wide mt-0.5 truncate">
                  Reg: {employerProfile.gstNumber}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              if (setEmployerProfile) setEmployerProfile(null)
              setMobileOpen(false)
              onNavigate('home')
            }}
            className="w-full text-center text-sm font-bold text-red-500 bg-red-50 py-2.5 rounded-lg border border-red-100 cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      )
    }

    if (seekerPhone) {
      return (
        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={() => {
              onNavigate('profile')
              setMobileOpen(false)
            }}
            className="w-full flex items-center justify-center gap-2 bg-[#00b4a0]/10 text-[#00b4a0] py-2.5 rounded-lg border border-[#00b4a0]/20 font-semibold text-sm"
          >
            <span>👤</span> <span className="font-mono text-xs">{seekerPhone}</span> (My Profile)
          </button>
          <button
            onClick={() => {
              if (setSeekerPhone) setSeekerPhone('')
              setMobileOpen(false)
              onNavigate('home')
            }}
            className="w-full text-center text-sm font-bold text-red-500 bg-red-50 py-2.5 rounded-lg border border-red-100"
          >
            Sign Out
          </button>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-2 pt-2">
        <button
          onClick={() => { onNavigate('login'); setMobileOpen(false) }}
          className="w-full text-center text-xs font-bold text-[#0d2b6b] bg-[#f0f5ff] py-3 rounded-xl border border-transparent cursor-pointer"
        >
          👤 Candidate Login
        </button>
        <button
          onClick={() => { onNavigate('employers-login'); setMobileOpen(false) }}
          className="w-full text-center text-xs font-bold text-white bg-[#00b4a0] py-3 rounded-xl border border-transparent cursor-pointer shadow-md"
        >
          🏥 Post Job Login
        </button>
      </div>
    )
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg shadow-blue-900/10 py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => onNavigate('home')} className="flex items-center gap-3">
          <NavLogo />
          <span className={`font-bold text-lg hidden sm:block transition-colors ${scrolled ? 'text-[#0d2b6b]' : 'text-white'}`}>
            24medi<span className={scrolled ? 'text-[#00b4a0]' : 'text-[#22c36a]'}>jobs</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => onNavigate(link.page)}
              className={`nav-link text-sm font-medium transition-colors duration-200 ${
                activePage === link.page
                  ? 'text-[#00b4a0]'
                  : scrolled
                  ? 'text-[#0d1b3e] hover:text-[#00b4a0]'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {renderDesktopCTA()}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-lg"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <div
            className={`w-6 h-0.5 mb-1.5 transition-all duration-300 ${
              scrolled ? 'bg-[#0d1b3e]' : 'bg-white'
            } ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`}
          />
          <div
            className={`w-6 h-0.5 mb-1.5 transition-all duration-300 ${
              scrolled ? 'bg-[#0d1b3e]' : 'bg-white'
            } ${mobileOpen ? 'opacity-0' : ''}`}
          />
          <div
            className={`w-6 h-0.5 transition-all duration-300 ${
              scrolled ? 'bg-[#0d1b3e]' : 'bg-white'
            } ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white shadow-xl transition-all duration-300 overflow-hidden ${
          mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => { onNavigate(link.page); setMobileOpen(false) }}
              className={`text-left text-sm font-medium py-2 border-b border-gray-100 ${
                activePage === link.page ? 'text-[#00b4a0]' : 'text-[#0d1b3e]'
              }`}
            >
              {link.label}
            </button>
          ))}
          {renderMobileCTA()}
        </div>
      </div>
    </nav>
  )
}
