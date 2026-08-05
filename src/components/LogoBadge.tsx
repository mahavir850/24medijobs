import logo from '@/imports/medijob.jpeg'

interface LogoBadgeProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  inverted?: boolean
  className?: string
}

const sizes = {
  sm: { outer: 'w-14 h-14', ring1: 'w-16 h-16', ring2: 'w-20 h-20', img: 'w-12 h-12' },
  md: { outer: 'w-20 h-20', ring1: 'w-24 h-24', ring2: 'w-28 h-28', img: 'w-18 h-18' },
  lg: { outer: 'w-28 h-28', ring1: 'w-32 h-32', ring2: 'w-36 h-36', img: 'w-24 h-24' },
  xl: { outer: 'w-36 h-36', ring1: 'w-40 h-40', ring2: 'w-44 h-44', img: 'w-32 h-32' },
}

export default function LogoBadge({ size = 'md', inverted = false, className = '' }: LogoBadgeProps) {
  const s = sizes[size]
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Pulsing outer ring 2 */}
      <div
        className={`absolute ${s.ring2} rounded-full border-2 ${inverted ? 'border-white/20' : 'border-[#00b4a0]/20'} animate-ping`}
        style={{ animationDuration: '2.5s' }}
      />
      {/* Pulsing outer ring 1 */}
      <div
        className={`absolute ${s.ring1} rounded-full border-2 ${inverted ? 'border-white/30' : 'border-[#00b4a0]/30'} animate-ping`}
        style={{ animationDuration: '2s', animationDelay: '0.3s' }}
      />
      {/* Spinning gradient ring */}
      <div
        className={`absolute ${s.outer} rounded-full animate-spin-slow`}
        style={{
          background: `conic-gradient(from 0deg, ${inverted ? 'rgba(255,255,255,0.6)' : '#00b4a0'}, transparent, ${inverted ? 'rgba(255,255,255,0.6)' : '#22c36a'}, transparent)`,
          padding: '2px',
        }}
      >
        <div className={`w-full h-full rounded-full ${inverted ? 'bg-[#0d2b6b]' : 'bg-[#f0f5ff]'}`} />
      </div>
      {/* Logo circle */}
      <div className={`relative ${s.outer} rounded-full overflow-hidden border-2 ${inverted ? 'border-white/40' : 'border-white'} shadow-xl z-10`}>
        <img
          src={logo}
          alt="24medijobs"
          className="w-full h-full object-cover object-center"
        />
      </div>
    </div>
  )
}
