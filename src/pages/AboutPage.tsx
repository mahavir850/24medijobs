import LogoBadge from '@/components/LogoBadge'

export default function AboutPage() {
  const team = [
    { name: 'Dr. Rajesh Kumar', role: 'Co-Founder & CEO', bg: 'bg-blue-100', avatar: '👨‍⚕️', desc: 'MBBS, MBA — 15 years in healthcare and technology' },
    { name: 'Priya Mehta', role: 'Co-Founder & CTO', bg: 'bg-teal-100', avatar: '👩‍💻', desc: 'Ex-Google engineer, passionate about healthcare innovation' },
    { name: 'Dr. Anita Sharma', role: 'Head of Medical Partnerships', bg: 'bg-green-100', avatar: '👩‍⚕️', desc: 'MD, Hospital Operations — 12 years pan-India network' },
    { name: 'Rohit Singh', role: 'Head of Product', bg: 'bg-purple-100', avatar: '👨‍💼', desc: 'Product leader with 10 years in HR-tech platforms' },
  ]

  const milestones = [
    { year: '2019', event: '24medijobs founded in Bangalore with a vision to digitize healthcare hiring' },
    { year: '2020', event: 'Crossed 10,000 registered healthcare professionals during the COVID-19 response' },
    { year: '2021', event: 'Partnered with 1,000+ hospitals and expanded to 200+ cities across India' },
    { year: '2022', event: 'Raised Series A funding. Launched AI-powered candidate matching engine' },
    { year: '2023', event: 'Reached 1 lakh+ registered professionals and 5,000+ partner hospitals' },
    { year: '2024', event: '2.5 lakh+ professionals, 12,000+ partners — India\'s largest medical job platform' },
  ]

  return (
    <div className="min-h-screen bg-[#f0f5ff] pt-20">
      {/* Hero */}
      <div className="hero-bg py-16 px-4 sm:px-6 text-center">
        <LogoBadge size="xl" inverted className="mx-auto mb-7" />
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Your Healthcare Career Partner
        </h1>
        <p className="text-white/75 max-w-2xl mx-auto text-lg">
          We are on a mission to connect every healthcare professional in India with the right opportunity —
          making medical hiring faster, smarter, and more humane.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        {/* Mission */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20 items-center">
          <div>
            <span className="inline-block text-sm font-semibold text-[#00b4a0] bg-[#00b4a0]/10 px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
              Our Mission
            </span>
            <h2 className="text-3xl font-bold text-[#0d1b3e] mb-6">
              Bridging the Gap Between Healthcare Talent & Opportunity
            </h2>
            <p className="text-[#5a6a8a] leading-relaxed mb-4">
              India has one of the world's largest healthcare workforces, yet connecting the right
              medical professional with the right institution remains a challenge. 24medijobs was built
              to solve this — with technology, verified profiles, and deep healthcare expertise.
            </p>
            <p className="text-[#5a6a8a] leading-relaxed mb-6">
              Whether you're an MBBS doctor looking for your first hospital posting, an experienced nurse
              seeking better opportunities, or a hospital HR team hunting for specialists —
              24medijobs is your dedicated partner.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { n: '2019', l: 'Founded' },
                { n: '12,000+', l: 'Partner Hospitals' },
                { n: '2.5L+', l: 'Professionals' },
                { n: '500+', l: 'Cities Covered' },
              ].map((s) => (
                <div key={s.l} className="bg-white border border-gray-100 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-[#0d2b6b]">{s.n}</p>
                  <p className="text-[#5a6a8a] text-sm">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#0d2b6b] to-[#00b4a0] rounded-3xl p-8 text-white">
            <h3 className="font-bold text-xl mb-4">Our Values</h3>
            {[
              { icon: '🎯', title: 'Accuracy', desc: 'Every job listing and candidate profile is verified for authenticity.' },
              { icon: '💚', title: 'Care', desc: 'We genuinely care about healthcare professionals and their career growth.' },
              { icon: '⚡', title: 'Speed', desc: 'Fast, efficient hiring that respects everyone\'s time.' },
              { icon: '🔒', title: 'Trust', desc: 'Data privacy, credential verification, and transparent processes.' },
            ].map((v) => (
              <div key={v.title} className="flex gap-4 mb-4 last:mb-0">
                <span className="text-2xl">{v.icon}</span>
                <div>
                  <h4 className="font-bold mb-0.5">{v.title}</h4>
                  <p className="text-white/70 text-sm">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-[#0d1b3e] mb-10 text-center">Our Journey</h2>
          <div className="space-y-4">
            {milestones.map((m, i) => (
              <div key={m.year} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#0d2b6b] text-white font-bold text-sm flex items-center justify-center shrink-0">
                    {m.year}
                  </div>
                  {i < milestones.length - 1 && <div className="w-0.5 h-8 bg-[#d0ddf0] mt-1" />}
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100 flex-1 mb-2">
                  <p className="text-[#0d1b3e] text-sm leading-relaxed">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className="text-3xl font-bold text-[#0d1b3e] mb-10 text-center">Meet Our Team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((member) => (
              <div key={member.name} className="bg-white border border-gray-100 rounded-2xl p-6 text-center card-hover">
                <div className={`w-16 h-16 ${member.bg} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4`}>
                  {member.avatar}
                </div>
                <h3 className="font-bold text-[#0d1b3e] mb-1">{member.name}</h3>
                <p className="text-[#00b4a0] text-xs font-semibold mb-2">{member.role}</p>
                <p className="text-[#5a6a8a] text-xs leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
