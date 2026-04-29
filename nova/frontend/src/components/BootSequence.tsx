import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BootSequenceProps {
  onComplete: () => void;
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [phase, setPhase] = useState<"logo" | "loading" | "fadeout">("logo");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setPhase("loading"), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== "loading") return;
    let width = 0;
    const interval = setInterval(() => {
      width += 1.5;
      setProgress(Math.min(width, 100));
      if (width >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setPhase("fadeout");
          setTimeout(() => onComplete(), 600);
        }, 300);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [phase, onComplete]);

  const statusText =
    progress < 30 ? "Initializing" :
    progress < 60 ? "Loading systems" :
    progress < 90 ? "Almost ready" : "Launching";

  return (
    <AnimatePresence>
      {phase !== "fadeout" ? (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ backgroundColor: "#030712" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <h1
              className="text-7xl md:text-8xl font-black tracking-wider"
              style={{ color: "#1e3a8a", textShadow: "0 0 30px rgba(30,58,138,0.4)" }}
            >
              NOVA
            </h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "120px" }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="h-px mt-4 mb-6"
              style={{ backgroundColor: "#1e40af" }}
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm tracking-[0.25em] uppercase"
              style={{ color: "#1e40af" }}
            >
              AI Learning Platform
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "loading" ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-24 w-full max-w-xs px-8"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs tracking-widest uppercase" style={{ color: "#1e40af" }}>
                {statusText}
              </span>
              <span className="text-xs font-bold" style={{ color: "#2563eb" }}>
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: "#111827" }}>
              <div
                className="h-full rounded-full transition-all duration-100"
                style={{
                  width: `${progress}%`,
                  backgroundColor: "#1e40af",
                  boxShadow: progress > 50 ? "0 0 8px rgba(30,64,175,0.5)" : "none",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
