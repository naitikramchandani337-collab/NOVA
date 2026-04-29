import { motion, AnimatePresence } from 'framer-motion';
import { useAstra, type AstraEmotion } from './AstraContext';
import AstraChatPanel from './AstraChatPanel';

// ── Emotion color map ─────────────────────────────────────
const EMOTION_COLORS: Record<AstraEmotion, { core: string; glow: string; ring: string }> = {
  idle:        { core: '#2563eb', glow: 'rgba(37,99,235,0.4)',   ring: 'rgba(37,99,235,0.15)'  },
  thinking:    { core: '#7c3aed', glow: 'rgba(124,58,237,0.5)',  ring: 'rgba(124,58,237,0.15)' },
  happy:       { core: '#0ea5e9', glow: 'rgba(14,165,233,0.5)',  ring: 'rgba(14,165,233,0.15)' },
  alert:       { core: '#d97706', glow: 'rgba(217,119,6,0.5)',   ring: 'rgba(217,119,6,0.15)'  },
  error:       { core: '#dc2626', glow: 'rgba(220,38,38,0.5)',   ring: 'rgba(220,38,38,0.15)'  },
  celebrating: { core: '#0ea5e9', glow: 'rgba(14,165,233,0.6)',  ring: 'rgba(14,165,233,0.2)'  },
  explaining:  { core: '#1d4ed8', glow: 'rgba(29,78,216,0.45)',  ring: 'rgba(29,78,216,0.15)'  },
  focused:     { core: '#1e40af', glow: 'rgba(30,64,175,0.4)',   ring: 'rgba(30,64,175,0.12)'  },
};

// ── Sphere component ──────────────────────────────────────
interface SphereProps {
  emotion: AstraEmotion;
  onClick: () => void;
  isOpen: boolean;
}

function AstraSphere({ emotion, onClick, isOpen }: SphereProps) {
  const colors = EMOTION_COLORS[emotion] ?? EMOTION_COLORS.idle;

  return (
    <motion.div
      onClick={onClick}
      className="relative cursor-pointer select-none flex items-center justify-center"
      style={{ width: '72px', height: '72px' }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
    >
      {/* Outer pulse ring */}
      <motion.div className="absolute rounded-full"
        style={{ width: '72px', height: '72px', border: `1.5px solid ${colors.core}`, opacity: 0.4 }}
        animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
      />

      {/* Second pulse ring */}
      <motion.div className="absolute rounded-full"
        style={{ width: '72px', height: '72px', border: `1px solid ${colors.core}`, opacity: 0.25 }}
        animate={{ scale: [1, 1.6, 1], opacity: [0.25, 0, 0.25] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.6 }}
      />

      {/* Glow halo */}
      <motion.div className="absolute rounded-full"
        style={{ width: '64px', height: '64px', background: colors.ring, filter: 'blur(12px)' }}
        animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Main sphere */}
      <AnimatePresence mode="wait">
        <motion.div key={emotion} className="absolute rounded-full"
          style={{
            width: '48px', height: '48px',
            background: `radial-gradient(circle at 35% 35%, white 0%, ${colors.core} 50%, #0f172a 100%)`,
            boxShadow: `0 0 16px ${colors.glow}, 0 0 32px ${colors.glow}, 0 0 48px ${colors.ring}, inset 0 2px 8px rgba(255,255,255,0.3)`,
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.25 }}
        />
      </AnimatePresence>

      {/* Inner shine */}
      <div className="absolute rounded-full pointer-events-none"
        style={{ width: '16px', height: '12px', top: '14px', left: '19px', background: 'radial-gradient(circle,rgba(255,255,255,0.7),transparent)' }}
      />

      {/* Thinking spinner */}
      {emotion === 'thinking' && (
        <motion.div className="absolute rounded-full pointer-events-none"
          style={{ width: '56px', height: '56px', border: '1.5px solid transparent', borderTopColor: colors.core, borderRightColor: colors.core }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* Celebrating particles */}
      {emotion === 'celebrating' && (
        <>
          {[0, 60, 120, 180, 240, 300].map((deg, i) => (
            <motion.div key={i} className="absolute rounded-full pointer-events-none"
              style={{ width: '5px', height: '5px', background: colors.core, boxShadow: `0 0 6px ${colors.glow}` }}
              animate={{
                x: [0, Math.cos((deg * Math.PI) / 180) * 28, Math.cos((deg * Math.PI) / 180) * 36],
                y: [0, Math.sin((deg * Math.PI) / 180) * 28, Math.sin((deg * Math.PI) / 180) * 36],
                opacity: [1, 0.8, 0], scale: [1, 1, 0],
              }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.1, ease: 'easeOut' }}
            />
          ))}
        </>
      )}

      {/* Online indicator dot */}
      <motion.div className="absolute rounded-full"
        style={{ width: '10px', height: '10px', bottom: '2px', right: '2px', background: isOpen ? colors.core : '#1e40af', border: '2px solid #030712', boxShadow: `0 0 6px ${colors.glow}` }}
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </motion.div>
  );
}

// ── Main export ───────────────────────────────────────────
export default function AstraAvatar() {
  const { isOpen, isLoading, confusionLevel, toggleOpen } = useAstra();

  const emotion: AstraEmotion =
    isLoading                   ? 'thinking'   :
    confusionLevel === 'high'   ? 'alert'      :
    confusionLevel === 'medium' ? 'explaining' :
    isOpen                      ? 'explaining' :
                                  'idle';

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed bottom-28 right-6 z-[9998]">
            <AstraChatPanel />
          </div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-8 right-8 z-[9999] flex flex-col items-center gap-1.5">
        <AstraSphere emotion={emotion} onClick={toggleOpen} isOpen={isOpen} />
        <div className="text-[9px] font-bold tracking-widest uppercase"
          style={{ color: EMOTION_COLORS[emotion].core, textShadow: `0 0 8px ${EMOTION_COLORS[emotion].glow}` }}>
          ASTRA
        </div>
      </div>
    </>
  );
}
