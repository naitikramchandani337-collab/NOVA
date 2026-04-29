import { motion } from 'framer-motion';

const SUB_PHASES = [
  { step: 1, title: 'Select Track' },
  { step: 2, title: 'Architecture Plan' },
  { step: 3, title: 'Data Pipeline' },
  { step: 4, title: 'Build the Model' },
  { step: 5, title: 'Train & Evaluate' },
  { step: 6, title: 'Build API Backend' },
  { step: 7, title: 'Build Frontend' },
  { step: 8, title: 'Deploy & Submit' },
];

interface Props {
  completedSteps: number[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export default function CapstoneChecklist({ completedSteps, currentStep, onStepClick }: Props) {
  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
      <div className="text-xs text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
        ◑ Sub-Phases
      </div>

      <div className="space-y-1.5">
        {SUB_PHASES.map(({ step, title }) => {
          const isDone    = completedSteps.includes(step);
          const isCurrent = currentStep === step && !isDone;
          const isLocked  = !isDone && !isCurrent;

          return (
            <motion.button
              key={step}
              onClick={() => onStepClick?.(step)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
              style={{
                background: isCurrent ? 'rgba(45,212,191,0.08)' : isDone ? 'rgba(255,255,255,0.03)' : 'transparent',
                border: isCurrent ? '1px solid rgba(45,212,191,0.2)' : '1px solid transparent',
                cursor: onStepClick ? 'pointer' : 'default',
              }}
              whileHover={onStepClick ? { x: 2 } : {}}
            >
              {/* Status indicator */}
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                {isDone ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center"
                  >
                    <span className="text-black text-[10px] font-black">●</span>
                  </motion.div>
                ) : isCurrent ? (
                  <motion.div
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-5 h-5 rounded-full border-2 border-teal-400 flex items-center justify-center"
                  >
                    <div className="w-2 h-2 rounded-full bg-teal-400" />
                  </motion.div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center">
                    <span className="text-gray-700 text-[9px]">{step}</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <span className={`text-sm font-medium ${
                isDone ? 'text-teal-400 line-through opacity-60' :
                isCurrent ? 'text-white' :
                'text-gray-600'
              }`}>
                {title}
              </span>

              {/* Current badge */}
              {isCurrent && (
                <span className="ml-auto text-[9px] text-teal-400 bg-teal-400/10 px-1.5 py-0.5 rounded-full font-bold">
                  NOW
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <div className="flex justify-between text-xs text-gray-600 mb-1.5">
          <span>{completedSteps.length}/8 complete</span>
          <span>{Math.round((completedSteps.length / 8) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-teal-500 to-indigo-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(completedSteps.length / 8) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}
