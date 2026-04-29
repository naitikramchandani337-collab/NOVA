import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Loader2, Bot } from 'lucide-react';
import { useAstra } from '../Astra/AstraContext';

interface SubPhaseInfo {
  step: number;
  title: string;
  description: string;
  track: string | null;
}

const STEP_CONTENT: Record<number, {
  instructions: string[];
  submissionLabel: string;
  submissionPlaceholder: string;
  astraPrompt: string;
}> = {
  1: {
    instructions: [
      'Review the three available tracks carefully.',
      'Consider your interests and what you want to build.',
      'Think about which tech stack excites you most.',
      'There is no wrong choice — all three are equally challenging.',
    ],
    submissionLabel: 'Track selection is automatic when you click a track above.',
    submissionPlaceholder: '',
    astraPrompt: 'I am choosing my capstone track. Help me decide between Track A (Image Classifier), Track B (NLP Chatbot), and Track C (RL Agent).',
  },
  2: {
    instructions: [
      'Design your complete system architecture before writing any code.',
      'Define: data flow, model architecture, API endpoints, frontend components.',
      'Identify potential bottlenecks and failure points.',
      'ASTRA will review your plan and ask probing questions.',
    ],
    submissionLabel: 'Paste your architecture plan (text or markdown)',
    submissionPlaceholder: 'Describe your system architecture:\n\n1. Data flow: ...\n2. Model architecture: ...\n3. API design: ...\n4. Frontend components: ...\n5. Deployment strategy: ...',
    astraPrompt: 'Review my architecture plan for my capstone project. Here is my plan:',
  },
  3: {
    instructions: [
      'Collect or source your dataset.',
      'Write preprocessing and cleaning scripts.',
      'Split into train/validation/test sets.',
      'Document your data pipeline with code.',
    ],
    submissionLabel: 'Paste a code snippet showing your data pipeline',
    submissionPlaceholder: '# Paste your data loading/preprocessing code here\nimport ...',
    astraPrompt: 'Review my data pipeline code for my capstone project:',
  },
  4: {
    instructions: [
      'Implement your model architecture in code.',
      'Define the forward pass, loss function, and optimizer.',
      'Start with a simple baseline before adding complexity.',
      'Document your architectural choices.',
    ],
    submissionLabel: 'Paste your model architecture code',
    submissionPlaceholder: '# Paste your model class definition here\nclass MyModel(nn.Module):\n    ...',
    astraPrompt: 'Review my model architecture code:',
  },
  5: {
    instructions: [
      'Train your model and track metrics.',
      'Plot training and validation loss curves.',
      'Tune hyperparameters to improve performance.',
      'Document your final accuracy/metrics.',
    ],
    submissionLabel: 'Paste your training results (accuracy, loss, metrics)',
    submissionPlaceholder: 'Training results:\n- Final train accuracy: ...\n- Final val accuracy: ...\n- Test accuracy: ...\n- Training time: ...',
    astraPrompt: 'Review my training results and help me improve:',
  },
  6: {
    instructions: [
      'Build a FastAPI backend that serves your model.',
      'Create at least one prediction endpoint.',
      'Add proper error handling and input validation.',
      'Test your API with curl or Postman.',
    ],
    submissionLabel: 'Paste your API endpoint code or URL',
    submissionPlaceholder: '# Paste your FastAPI endpoint code\n@app.post("/predict")\nasync def predict(...):\n    ...',
    astraPrompt: 'Review my FastAPI backend code:',
  },
  7: {
    instructions: [
      'Build a React frontend connected to your backend.',
      'Users should be able to interact with your AI system.',
      'Add proper loading states and error handling.',
      'Make it look presentable — this is your portfolio.',
    ],
    submissionLabel: 'Paste a screenshot description or GitHub link',
    submissionPlaceholder: 'GitHub repo link or describe your frontend:\nhttps://github.com/...',
    astraPrompt: 'Review my frontend implementation:',
  },
  8: {
    instructions: [
      'Deploy your complete system to a live URL.',
      'Ensure both frontend and backend are accessible.',
      'Write a brief explanation of your architectural decisions.',
      'Submit your live URL — this is your final deliverable.',
    ],
    submissionLabel: 'Submit your live deployment URL + brief write-up',
    submissionPlaceholder: 'Live URL: https://...\n\nArchitectural decisions:\n1. I chose ... because ...\n2. The hardest part was ...\n3. If I had more time I would ...',
    astraPrompt: 'I have completed my capstone project. Here is my final submission:',
  },
};

interface Props {
  step: number;
  title: string;
  description: string;
  track: string | null;
  isCompleted: boolean;
  onComplete: (submission: string) => Promise<void>;
}

export default function SubPhaseContent({ step, title, description, track, isCompleted, onComplete }: Props) {
  const [submission, setSubmission] = useState('');
  const [loading,    setLoading]    = useState(false);
  const { sendMessage, toggleOpen, setMode } = useAstra();

  const content = STEP_CONTENT[step];

  const handleComplete = async () => {
    if (step !== 1 && !submission.trim()) return;
    setLoading(true);
    try {
      await onComplete(submission);
    } finally {
      setLoading(false);
    }
  };

  const handleAskAstra = () => {
    setMode('explain');
    toggleOpen();
    const msg = submission.trim()
      ? `${content.astraPrompt}\n\n${submission}`
      : content.astraPrompt;
    sendMessage(msg);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 font-black text-sm">
            {step}
          </div>
          <div>
            <h2 className="text-xl font-black text-white">{title}</h2>
            <p className="text-gray-500 text-sm">{description}</p>
          </div>
        </div>
      </div>

      {/* Completed state */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20"
        >
          <CheckCircle className="w-5 h-5 text-teal-400 flex-shrink-0" />
          <div>
            <div className="text-teal-300 font-bold text-sm">Sub-phase complete</div>
            <div className="text-teal-400/60 text-xs">Trajectory confirmed. Moving to next phase.</div>
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
        <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">◑ Instructions</div>
        <div className="space-y-2.5">
          {content.instructions.map((inst, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="text-teal-400 text-xs mt-0.5 flex-shrink-0">▸</span>
              <span className="text-gray-300 text-sm leading-relaxed">{inst}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Submission area — skip for step 1 */}
      {step !== 1 && !isCompleted && (
        <div className="space-y-3">
          <label className="text-xs text-gray-500 uppercase tracking-widest block">
            ◑ {content.submissionLabel}
          </label>
          <textarea
            value={submission}
            onChange={e => setSubmission(e.target.value)}
            placeholder={content.submissionPlaceholder}
            rows={8}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-700 resize-none focus:outline-none focus:border-teal-500/50 font-mono"
          />
        </div>
      )}

      {/* Actions */}
      {!isCompleted && (
        <div className="flex gap-3">
          {/* Ask ASTRA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAskAstra}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium hover:bg-indigo-500/20 transition-all"
          >
            <Bot className="w-4 h-4" />
            Ask ASTRA
          </motion.button>

          {/* Mark Complete */}
          {step !== 1 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleComplete}
              disabled={loading || (!submission.trim() && step !== 1)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-300 text-sm font-bold hover:bg-teal-500/30 transition-all disabled:opacity-40"
            >
              {loading
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <CheckCircle className="w-4 h-4" />
              }
              Mark Complete
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
}
