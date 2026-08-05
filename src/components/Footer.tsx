import logo from '@/imports/medijob.jpeg'

interface FooterProps {
  onNavigate: (page: string) => void
}

export default function Footer({ onNavigate }: FooterProps) {
  const year = new Date().getFullYear()

  const links = {
    'For Job Seekers': [
      'Browse All Jobs', 'Job by Specialty', 'Job by Location', 'Resume Builder',
      'Salary Guide', 'Career Advice',
    ],
    'For Employers': [
      'Post a Job', 'Browse Candidates', 'Pricing Plans', 'Employer Dashboard',
      'Bulk Hiring', 'Contact Sales',
    ],
    'Specialties': [
      'Doctors & Physicians', 'Nursing Staff', 'Pharmacy Jobs', 'Lab Technicians',
      'Radiology Jobs', 'Allied Health',
    ],
    'Company': [
      'About 24medijobs', 'Our Mission', 'Careers at 24medijobs', 'Press & Media',
      'Contact Us', 'Help Center',
    ],
  }

  return (
    <footer className="bg-[#0d1b3e] text-white">
      {/* Newsletter CTA */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-bold text-xl mb-1">Get Job Alerts in Your Inbox</h3>
              <p className="text-white/60 text-sm">Subscribe to receive personalized medical job alerts daily.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 sm:w-64 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm outline-none focus:border-[#00b4a0] transition-colors"
              />
              <button className="bg-[#00b4a0] hover:bg-[#009888] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid lg:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <button onClick={() => onNavigate('home')} className="block mb-5">
              <img
                src={logo}
                alt="24medijobs"
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </button>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              India's #1 healthcare job portal connecting medical professionals with top hospitals,
              clinics, and healthcare organizations across the country.
            </p>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-[#00b4a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:hello@24medijobs.com" className="text-white/60 hover:text-[#00b4a0] text-sm transition-colors">
                hello@24medijobs.com
              </a>
            </div>
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-4 h-4 text-[#00b4a0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-white/60 text-sm">+91 98765 43210</span>
            </div>
            {/* Social */}
            <div className="flex gap-3">
              {[
                { label: 'LinkedIn', icon: 'in' },
                { label: 'Twitter', icon: '𝕏' },
                { label: 'Facebook', icon: 'f' },
                { label: 'Instagram', icon: '▣' },
              ].map((s) => (
                <button
                  key={s.label}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#00b4a0] flex items-center justify-center text-white text-xs font-bold transition-all duration-200"
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-bold text-white text-sm mb-4 uppercase tracking-wider">{category}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => onNavigate('home')}
                      className="text-white/55 hover:text-[#00b4a0] text-sm transition-colors text-left"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">
            © {year} 24medijobs. All rights reserved. Your Healthcare Career Partner.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <button
                key={item}
                className="text-white/40 hover:text-[#00b4a0] text-xs transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
