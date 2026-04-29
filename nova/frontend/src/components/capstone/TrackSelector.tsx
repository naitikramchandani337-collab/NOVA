import { motion } from 'framer-motion';
import { Code2, MessageSquare, Gamepad2, ChevronRight, Check } from 'lucide-react';

interface Track {
  id: 'A' | 'B' | 'C';
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  color: string;
  Icon: React.FC<{ className?: string }>;
}

const TRACKS: Track[] = [
  {
    id: 'A',
    name: 'Image Classifier',
    tagline: 'Build a vision AI system',
    description: 'Collect a custom dataset, design a CNN in PyTorch, build a FastAPI backend, and deploy a React frontend that classifies images in real time.',
    stack: ['PyTorch', 'CNN', 'FastAPI', 'React', 'Docker'],
    color: '#f97316',
    Icon: Code2,
  },
  {
    id: 'B',
    name: 'NLP Chatbot',
    tagline: 'Build a domain-specific AI assistant',
    description: 'Fine-tune a transformer model on a domain of your choice, build a RAG pipeline, and deploy a streaming chat interface.',
    stack: ['Transformers', 'RAG', 'FastAPI', 'React', 'LangChain'],
    color: '#818cf8',
    Icon: MessageSquare,
  },
  {
    id: 'C',
    name: 'RL Agent',
    tagline: 'Build an agent that learns',
    description: 'Design an environment, implement Q-learning or policy gradients, train your agent, and build a live dashboard showing it play.',
    stack: ['Q-Learning', 'Policy Gradients', 'Gymnasium', 'React Dashboard'],
    color: '#2dd4bf',
    Icon: Gamepad2,
  },
];

interface Props {
  selectedTrack: string | null;
  onSelect: (track: 'A' | 'B' | 'C') => void;
  disabled?: boolean;
}

export default function TrackSelector({ selectedTrack, onSelect, disabled }: Props) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <div className="text-xs text-teal-400 tracking-widest uppercase mb-2">◑ Choose Your Mission</div>
        <h2 className="text-2xl font-black text-white mb-2">Select Your Capstone Track</h2>
        <p className="text-gray-500 text-sm max-w-lg mx-auto">
          You will build one complete, deployable AI system. Choose the track that excites you most.
          This is real work, Commander.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TRACKS.map((track, i) => {
          const isSelected = selectedTrack === track.id;
          return (
            <motion.button
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => !disabled && onSelect(track.id)}
              disabled={disabled && !isSelected}
              className="relative text-left rounded-2xl border p-6 transition-all duration-300 group"
              style={{
                background: isSelected
                  ? `linear-gradient(135deg, ${track.color}15, ${track.color}08)`
                  : 'rgba(15,15,25,0.8)',
                borderColor: isSelected ? `${track.color}60` : 'rgba(255,255,255,0.08)',
                boxShadow: isSelected ? `0 0 30px ${track.color}20` : 'none',
                cursor: disabled && !isSelected ? 'not-allowed' : 'pointer',
                opacity: disabled && !isSelected ? 0.4 : 1,
              }}
              whileHover={!disabled ? { scale: 1.02 } : {}}
              whileTap={!disabled ? { scale: 0.98 } : {}}
            >
              {/* Track letter badge */}
              <div
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
                style={{
                  background: isSelected ? track.color : 'rgba(255,255,255,0.05)',
                  color: isSelected ? '#000' : 'rgba(255,255,255,0.3)',
                }}
              >
                {isSelected ? <Check className="w-4 h-4" /> : track.id}
              </div>

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${track.color}15`, border: `1px solid ${track.color}30` }}
              >
                <track.Icon className="w-6 h-6" style={{ color: track.color }} />
              </div>

              {/* Content */}
              <div className="text-xs mb-1" style={{ color: track.color }}>Track {track.id}</div>
              <h3 className="text-white font-black text-lg mb-1">{track.name}</h3>
              <p className="text-gray-500 text-xs mb-4">{track.tagline}</p>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{track.description}</p>

              {/* Stack */}
              <div className="flex flex-wrap gap-1.5">
                {track.stack.map(s => (
                  <span
                    key={s}
                    className="text-[10px] px-2 py-0.5 rounded-full border font-medium"
                    style={{ color: track.color, borderColor: `${track.color}30`, background: `${track.color}10` }}
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Select arrow */}
              {!isSelected && !disabled && (
                <div className="flex items-center gap-1 mt-4 text-xs text-gray-600 group-hover:text-gray-400 transition-colors">
                  Select this track <ChevronRight className="w-3 h-3" />
                </div>
              )}
              {isSelected && (
                <div className="flex items-center gap-1 mt-4 text-xs font-bold" style={{ color: track.color }}>
                  ● Track selected
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
