import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WarpTransition({ active, onComplete }: { active: boolean, onComplete: () => void }) {
  React.useEffect(() => {
    if (active) {
      const timer = setTimeout(onComplete, 1200);
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[1000] bg-nova-firefly flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-nova-cornflower font-mono text-[10px] tracking-[1em] uppercase animate-pulse"
      >
        Initializing Neural Link...
      </motion.div>
      
      {/* Subtle Scanner Line */}
      <motion.div 
        initial={{ top: '-10%' }}
        animate={{ top: '110%' }}
        transition={{ duration: 1, ease: "linear" }}
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-nova-cornflower/30 to-transparent"
      />
    </motion.div>
  );
}
