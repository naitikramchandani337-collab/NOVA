import { AnimatePresence, motion } from 'framer-motion'
import { useAstra } from './AstraContext'
import AstraChatPanel from './AstraChatPanel'

function AstraRobot({
  isLoading,
  isOnline,
  confusionLevel,
}: {
  isLoading: boolean
  isOnline: boolean
  confusionLevel: 'low' | 'medium' | 'high'
}) {
  const eyeColor =
    !isOnline                   ? '#ef4444' :
    isLoading                   ? '#c084fc' :
    confusionLevel === 'high'   ? '#fb923c' :
    confusionLevel === 'medium' ? '#fbbf24' :
                                  '#22d3ee'

  const bodyColor   = '#e8edf8'
  const shadowColor = '#b8c4e0'
  const darkColor   = '#1e293b'

  return (
    <svg width="120" height="200" viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="rg_body2" cx="35%" cy="25%">
          <stop offset="0%"   stopColor="#f4f7ff" />
          <stop offset="100%" stopColor="#c8d4ee" />
        </radialGradient>
        <radialGradient id="rg_ear2" cx="30%" cy="20%">
          <stop offset="0%"   stopColor="#eef2ff" />
          <stop offset="100%" stopColor="#b8c4e0" />
        </radialGradient>
        <radialGradient id="rg_inner_ear2" cx="40%" cy="30%">
          <stop offset="0%"   stopColor="#fda4af" />
          <stop offset="100%" stopColor="#fb7185" />
        </radialGradient>
        <filter id="av_glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="av_shadow">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#6366f1" floodOpacity="0.2"/>
        </filter>
      </defs>

      {/* LEFT EAR */}
      <motion.g
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        style={{ transformOrigin: '35px 52px' }}
      >
        <path d="M 28 52 C 18 40 12 20 16 4 C 18 -4 28 -2 32 6 C 36 16 38 36 38 52 Z"
          fill="url(#rg_ear2)" stroke={shadowColor} strokeWidth="1" />
        <path d="M 29 50 C 22 40 18 22 21 8 C 22 3 28 4 30 9 C 33 18 34 36 34 50 Z"
          fill="url(#rg_inner_ear2)" opacity="0.7" />
        {/* Thruster tip */}
        <motion.circle cx="22" cy="4" r="5" fill="#f97316" filter="url(#av_glow)"
          animate={{ r: [5, 6.5, 5], opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 1.5 }} />
      </motion.g>

      {/* RIGHT EAR */}
      <motion.g
        animate={{ rotate: [3, -3, 3] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: 0.4 }}
        style={{ transformOrigin: '85px 52px' }}
      >
        <path d="M 92 52 C 102 40 108 20 104 4 C 102 -4 92 -2 88 6 C 84 16 82 36 82 52 Z"
          fill="url(#rg_ear2)" stroke={shadowColor} strokeWidth="1" />
        <path d="M 91 50 C 98 40 102 22 99 8 C 98 3 92 4 90 9 C 87 18 86 36 86 50 Z"
          fill="url(#rg_inner_ear2)" opacity="0.7" />
        {/* Thruster tip */}
        <motion.circle cx="98" cy="4" r="5" fill="#f97316" filter="url(#av_glow)"
          animate={{ r: [5, 6.5, 5], opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }} />
      </motion.g>

      {/* HEAD */}
      <ellipse cx="60" cy="68" rx="34" ry="32"
        fill="url(#rg_body2)" stroke={shadowColor} strokeWidth="1.5" filter="url(#av_shadow)" />
      <path d="M 30 60 Q 60 52 90 60" stroke={shadowColor} strokeWidth="1" fill="none" opacity="0.5" />

      {/* VISOR */}
      <ellipse cx="60" cy="70" rx="26" ry="22" fill={darkColor} opacity="0.92" />
      <ellipse cx="52" cy="58" rx="12" ry="5" fill="white" opacity="0.06" />

      {/* LEFT EYE */}
      <ellipse cx="47" cy="68" rx="10" ry="10" fill="#0f172a" />
      <motion.ellipse cx="47" cy="68" rx="7.5" ry="7.5" fill={eyeColor} filter="url(#av_glow)"
        animate={{ rx: [7.5, 8.5, 7.5], ry: [7.5, 8.5, 7.5] }}
        transition={{ repeat: Infinity, duration: 2 }} />
      <ellipse cx="47" cy="68" rx="4" ry="4" fill="#020617" />
      <ellipse cx="44" cy="65" rx="2" ry="2" fill="white" opacity="0.95" />
      <motion.ellipse cx="47" cy="68" rx="10" ry="0" fill={darkColor}
        animate={{ ry: [0, 0, 0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 5, times: [0, 0.75, 0.82, 0.88, 1] }} />

      {/* RIGHT EYE */}
      <ellipse cx="73" cy="68" rx="10" ry="10" fill="#0f172a" />
      <motion.ellipse cx="73" cy="68" rx="7.5" ry="7.5" fill={eyeColor} filter="url(#av_glow)"
        animate={{ rx: [7.5, 8.5, 7.5], ry: [7.5, 8.5, 7.5] }}
        transition={{ repeat: Infinity, duration: 2, delay: 0.3 }} />
      <ellipse cx="73" cy="68" rx="4" ry="4" fill="#020617" />
      <ellipse cx="70" cy="65" rx="2" ry="2" fill="white" opacity="0.95" />
      <motion.ellipse cx="73" cy="68" rx="10" ry="0" fill={darkColor}
        animate={{ ry: [0, 0, 0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 5, delay: 0.15, times: [0, 0.75, 0.82, 0.88, 1] }} />

      {/* MOUTH */}
      <motion.path stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" fill="none"
        animate={{ d: isLoading ? 'M 52 82 Q 60 82 68 82' : 'M 52 81 Q 60 88 68 81' }}
        transition={{ duration: 0.4 }} />
      <ellipse cx="34" cy="76" rx="7" ry="4" fill="#fda4af" opacity="0.25" />
      <ellipse cx="86" cy="76" rx="7" ry="4" fill="#fda4af" opacity="0.25" />

      {/* NECK */}
      <rect x="48" y="98" width="24" height="9" rx="4" fill={bodyColor} stroke={shadowColor} strokeWidth="1" />
      <rect x="51" y="100" width="18" height="2.5" rx="1" fill={shadowColor} opacity="0.5" />
      <rect x="51" y="103" width="18" height="2.5" rx="1" fill={shadowColor} opacity="0.5" />

      {/* BODY */}
      <rect x="20" y="105" width="80" height="58" rx="22"
        fill="url(#rg_body2)" stroke={shadowColor} strokeWidth="1.5" filter="url(#av_shadow)" />

      {/* CHEST PANEL */}
      <rect x="32" y="114" width="56" height="36" rx="9" fill={darkColor} stroke={eyeColor} strokeWidth="1" opacity="0.9" />
      <rect x="35" y="117" width="50" height="20" rx="5" fill="#020617" />
      <motion.path stroke={eyeColor} strokeWidth="1.5" fill="none" strokeLinecap="round"
        animate={{ d: [
          'M 38 127 Q 44 120 50 127 Q 56 134 62 127 Q 68 120 74 127 Q 80 134 82 127',
          'M 38 127 Q 44 134 50 127 Q 56 120 62 127 Q 68 134 74 127 Q 80 120 82 127',
          'M 38 127 Q 44 120 50 127 Q 56 134 62 127 Q 68 120 74 127 Q 80 134 82 127',
        ]}}
        transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }} />
      <motion.circle cx="40" cy="143" r="3.5" fill="#22c55e"
        animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.1 }} />
      <motion.circle cx="52" cy="143" r="3.5" fill={eyeColor}
        animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.1, delay: 0.37 }} />
      <motion.circle cx="64" cy="143" r="3.5" fill="#a78bfa"
        animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.1, delay: 0.74 }} />

      {/* LEFT ARM */}
      <motion.g
        animate={{ rotate: isLoading ? [-12, 12, -12] : [-6, 6, -6] }}
        transition={{ repeat: Infinity, duration: isLoading ? 0.5 : 2.5, ease: 'easeInOut' }}
        style={{ transformOrigin: '20px 118px' }}
      >
        <rect x="4" y="112" width="18" height="30" rx="9" fill="url(#rg_body2)" stroke={shadowColor} strokeWidth="1.5" />
        <ellipse cx="13" cy="146" rx="10" ry="8" fill={bodyColor} stroke={shadowColor} strokeWidth="1.5" />
        <rect x="6"  y="142" width="5" height="9"  rx="2.5" fill="url(#rg_body2)" stroke={shadowColor} strokeWidth="1" />
        <rect x="12" y="140" width="5" height="11" rx="2.5" fill="url(#rg_body2)" stroke={shadowColor} strokeWidth="1" />
        <rect x="18" y="142" width="4" height="9"  rx="2"   fill="url(#rg_body2)" stroke={shadowColor} strokeWidth="1" />
      </motion.g>

      {/* RIGHT ARM */}
      <motion.g
        animate={{ rotate: isLoading ? [12, -12, 12] : [6, -6, 6] }}
        transition={{ repeat: Infinity, duration: isLoading ? 0.5 : 2.5, ease: 'easeInOut', delay: 0.2 }}
        style={{ transformOrigin: '100px 118px' }}
      >
        <rect x="98" y="112" width="18" height="30" rx="9" fill="url(#rg_body2)" stroke={shadowColor} strokeWidth="1.5" />
        <ellipse cx="107" cy="146" rx="10" ry="8" fill={bodyColor} stroke={shadowColor} strokeWidth="1.5" />
        <rect x="98"  y="142" width="4" height="9"  rx="2"   fill="url(#rg_body2)" stroke={shadowColor} strokeWidth="1" />
        <rect x="103" y="140" width="5" height="11" rx="2.5" fill="url(#rg_body2)" stroke={shadowColor} strokeWidth="1" />
        <rect x="109" y="142" width="5" height="9"  rx="2.5" fill="url(#rg_body2)" stroke={shadowColor} strokeWidth="1" />
      </motion.g>

      {/* LEGS */}
      <rect x="30" y="160" width="24" height="20" rx="9" fill="url(#rg_body2)" stroke={shadowColor} strokeWidth="1.5" />
      <rect x="66" y="160" width="24" height="20" rx="9" fill="url(#rg_body2)" stroke={shadowColor} strokeWidth="1.5" />

      {/* BOOTS */}
      <rect x="25" y="175" width="30" height="13" rx="7" fill={bodyColor} stroke={shadowColor} strokeWidth="1.5" />
      <rect x="65" y="175" width="30" height="13" rx="7" fill={bodyColor} stroke={shadowColor} strokeWidth="1.5" />

      {/* TAIL */}
      <motion.path stroke={bodyColor} strokeWidth="9" strokeLinecap="round" fill="none"
        animate={{ d: [
          'M 96 148 Q 116 155 112 170 Q 108 182 96 178',
          'M 96 148 Q 118 153 115 168 Q 112 180 100 176',
          'M 96 148 Q 116 155 112 170 Q 108 182 96 178',
        ]}}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }} />
      <motion.ellipse cx="96" cy="178" rx="6" ry="6" fill={eyeColor} filter="url(#av_glow)"
        animate={{ cx: [96, 100, 96], cy: [178, 176, 178], opacity: [0.8, 1, 0.8] }}
        transition={{ repeat: Infinity, duration: 2.5 }} />

      {/* SHOULDER DOTS */}
      <motion.circle cx="26" cy="116" r="4" fill={eyeColor} opacity="0.7" filter="url(#av_glow)"
        animate={{ opacity: [0.5, 0.9, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} />
      <motion.circle cx="94" cy="116" r="4" fill={eyeColor} opacity="0.7" filter="url(#av_glow)"
        animate={{ opacity: [0.9, 0.5, 0.9] }} transition={{ repeat: Infinity, duration: 2 }} />
    </svg>
  )
}

export default function AstraAvatar() {
  const { isOpen, isOnline, isLoading, toggleOpen, confusionLevel, currentPhase } = useAstra()

  const accentColor =
    !isOnline                   ? '#ef4444' :
    isLoading                   ? '#c084fc' :
    confusionLevel === 'high'   ? '#fb923c' :
    confusionLevel === 'medium' ? '#fbbf24' :
                                  '#22d3ee'

  const statusText =
    !isOnline                   ? 'Offline'        :
    isLoading                   ? 'Thinking... 💭' :
    confusionLevel === 'high'   ? 'Here to help 🚨':
    confusionLevel === 'medium' ? 'Analyzing ⚠️'   :
                                  'ASTRA ✨'

  return (
    <>
      <motion.div
        className="fixed bottom-4 right-5 z-[9999] flex flex-col items-center select-none"
        initial={{ scale: 0, opacity: 0, y: 60 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 14, stiffness: 220, delay: 0.6 }}
      >
        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="mb-1 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10 text-[10px] text-white/70 whitespace-nowrap pointer-events-none"
        >
          {currentPhase ? `Phase ${currentPhase} · AI Mentor` : 'Click to chat with ASTRA'}
        </motion.div>

        <div className="relative">
          {/* Ambient glow */}
          <motion.div
            className="absolute inset-0 rounded-full blur-3xl pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 60%, ${accentColor}40, transparent 70%)`,
              width: 120, height: 200,
            }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
          />

          {/* Robot */}
          <motion.div
            onClick={toggleOpen}
            className="cursor-pointer relative z-10"
            animate={{ y: [-6, 6, -6] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.93 }}
          >
            <AstraRobot isLoading={isLoading} isOnline={isOnline} confusionLevel={confusionLevel} />
          </motion.div>
        </div>

        {/* Name tag */}
        <motion.div
          className="mt-0 px-3 py-0.5 rounded-full border text-[10px] font-bold tracking-widest backdrop-blur-sm"
          style={{
            borderColor: `${accentColor}40`,
            backgroundColor: `${accentColor}12`,
            color: accentColor,
          }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        >
          {statusText}
        </motion.div>

        <div className="flex items-center gap-1.5 mt-1">
          <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
          <span className="text-[9px] text-gray-500">{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed bottom-56 right-6 z-[9998]">
            <AstraChatPanel />
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
