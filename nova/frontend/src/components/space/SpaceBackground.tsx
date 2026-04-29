import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function SpaceBackground() {
  const stars = useMemo(() => {    return Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
    }));
  }, []);

  const nebulas = [
    { color: 'bg-nova-cornflower/10', size: 'w-[800px] h-[800px]', top: '-10%', left: '-10%' },
    { color: 'bg-nova-eastBay/10', size: 'w-[600px] h-[600px]', bottom: '0%', right: '-10%' },
    { color: 'bg-nova-horizon/5', size: 'w-[1000px] h-[1000px]', top: '20%', left: '30%' },
  ];

  return (
    <div className="fixed inset-0 z-[-1] bg-nova-firefly overflow-hidden pointer-events-none">
      {/* Deep Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#162636_0%,_#0E1626_100%)]" />

      {/* Nebulas */}
      {nebulas.map((n, i) => (
        <motion.div
          key={i}
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute rounded-full blur-[120px] ${n.color} ${n.size}`}
          style={{ top: n.top, left: n.left, bottom: n.bottom, right: n.right }}
        />
      ))}

      {/* Parallax Stars */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            initial={{ opacity: 0.1 }}
            animate={{ 
              opacity: [0.1, 0.8, 0.1],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: star.duration, 
              repeat: Infinity, 
              delay: star.delay,
              ease: "easeInOut"
            }}
            className="absolute rounded-full bg-white shadow-[0_0_5px_rgba(255,255,255,0.5)]"
            style={{
              width: star.size,
              height: star.size,
              top: `${star.y}%`,
              left: `${star.x}%`,
            }}
          />
        ))}
      </div>

      {/* Shooting Stars */}
      <div className="absolute inset-0">
        {[1, 2, 3].map((i) => (
           <motion.div
             key={i}
             initial={{ x: '-10%', y: '20%', opacity: 0 }}
             animate={{ 
               x: ['0%', '120%'],
               y: ['20%', '80%'],
               opacity: [0, 1, 0]
             }}
             transition={{ 
               duration: 2, 
               repeat: Infinity, 
               repeatDelay: 10 + Math.random() * 20,
               delay: i * 5
             }}
             className="absolute w-32 h-px bg-gradient-to-r from-transparent via-white to-transparent -rotate-12"
           />
        ))}
      </div>

      {/* Digital Grid lines (Very subtle) */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ 
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
        }}
      />
    </div>
  );
}
