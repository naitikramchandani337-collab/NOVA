// src/components/CodeEditor/CodeRunner.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CodeEditor from './CodeEditor';

interface CodeRunnerProps {
  starterCode: string;
  solution: string;
  hints: string[];
  title: string;
  description: string;
  exerciseIndex: number;
}

interface PistonResponse {
  run: { stdout: string; stderr: string; code: number };
}

// Primary + fallback: local backend first, then external APIs
const EXECUTION_ENDPOINTS = [
  { url: (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/code/run', type: 'local' },
  { url: 'https://emkc.org/api/v2/piston/execute', type: 'piston' },
  { url: 'https://piston.rodenthole.com/api/v2/execute', type: 'piston' },
];

async function executePython(code: string): Promise<PistonResponse> {
  let lastError: Error | null = null;

  for (const endpoint of EXECUTION_ENDPOINTS) {
    try {
      const controller = new AbortController();
      const timeout    = setTimeout(() => controller.abort(), 10000);

      const body = endpoint.type === 'local'
        ? JSON.stringify({ code, language: 'python' })
        : JSON.stringify({
            language: 'python',
            version: '3.10.0',
            files: [{ name: 'script.py', content: code }],
          });

      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        signal: controller.signal,
      });

      clearTimeout(timeout);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      // Normalize response format
      if (endpoint.type === 'local') {
        return {
          run: {
            stdout: data.stdout,
            stderr: data.stderr,
            code: data.exit_code,
          },
        };
      } else {
        return data;
      }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw lastError ?? new Error('All execution endpoints failed');
}

export default function CodeRunner({
  starterCode, solution, hints, title, description, exerciseIndex,
}: CodeRunnerProps) {
  const [code,         setCode]         = useState(starterCode);
  const [output,       setOutput]       = useState('');
  const [isRunning,    setIsRunning]    = useState(false);
  const [hasError,     setHasError]     = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [shownHints,   setShownHints]   = useState(0);
  const [retryCount,   setRetryCount]   = useState(0);

  const runCode = async (isRetry = false) => {
    setIsRunning(true);
    setOutput('');
    setHasError(false);
    if (!isRetry) setRetryCount(0);

    try {
      const data   = await executePython(code);
      const result = data.run;

      if (result.stderr && !result.stdout) {
        setHasError(true);
        setOutput(result.stderr);
      } else {
        setOutput(result.stdout || '(no output)');
        if (result.stderr) {
          setOutput(prev => prev + '\n\n⚠️ Warnings:\n' + result.stderr);
        }
      }
    } catch (err) {
      setHasError(true);
      const isAbort = err instanceof Error && err.name === 'AbortError';

      if (isAbort) {
        setOutput(
          '⏱️ Execution timed out (10s limit).\n\n' +
          'Your code may have an infinite loop. Check for:\n' +
          '  • while True: without a break\n' +
          '  • Recursive functions without a base case'
        );
      } else if (!isRetry && retryCount < 2) {
        setOutput('🔄 Execution service temporarily unavailable. Retrying...');
        setRetryCount(n => n + 1);
        setTimeout(() => runCode(true), 2000);
        return;
      } else {
        setOutput(
          '❌ Code execution service is offline.\n\n' +
          'The free Piston API (emkc.org) may be temporarily down.\n\n' +
          'Options:\n' +
          '  • Click "Try Again" in a few minutes\n' +
          '  • Copy your code and run it locally with Python\n' +
          '  • Use "Show Solution" to check your answer'
        );
      }
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="border border-gray-700 rounded-xl overflow-hidden bg-black/20">
      {/* Header */}
      <div className="p-5 border-b border-gray-800">
        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">
          Exercise {exerciseIndex + 1}
        </div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-gray-400 text-sm mt-1">{description}</p>
      </div>

      <div className="p-5">
        <CodeEditor defaultValue={code} onChange={setCode} />

        {/* Buttons */}
        <div className="flex items-center gap-3 mt-4">
          <motion.button
            onClick={() => runCode(false)}
            disabled={isRunning}
            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-500 disabled:bg-green-800 text-white font-semibold rounded-lg transition-colors text-sm"
            whileHover={{ scale: isRunning ? 1 : 1.02 }}
            whileTap={{ scale: isRunning ? 1 : 0.98 }}
          >
            {isRunning ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                {retryCount > 0 ? `Retrying (${retryCount}/2)...` : 'Running...'}
              </>
            ) : '▶ Run Code'}
          </motion.button>

          <button
            onClick={() => setCode(starterCode)}
            className="px-4 py-2.5 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white rounded-lg transition-colors text-sm"
          >
            ↺ Reset
          </button>

          {shownHints < hints.length && (
            <button
              onClick={() => setShownHints(n => n + 1)}
              className="px-4 py-2.5 border border-yellow-700/50 hover:border-yellow-600 text-yellow-500 hover:text-yellow-400 rounded-lg transition-colors text-sm"
            >
              💡 Hint ({hints.length - shownHints} left)
            </button>
          )}
        </div>

        {/* Hints */}
        <AnimatePresence>
          {shownHints > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 space-y-2">
              {hints.slice(0, shownHints).map((hint, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="flex gap-2 text-sm text-yellow-300 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-2"
                >
                  <span>💡</span><span>{hint}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Output */}
        <AnimatePresence>
          {output && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-500 uppercase tracking-widest">Output</div>
                {hasError && retryCount >= 2 && (
                  <button onClick={() => { setRetryCount(0); runCode(false); }} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    ↺ Try Again
                  </button>
                )}
              </div>
              <pre className={`p-4 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre-wrap ${
                hasError ? 'bg-red-950/30 border border-red-700/50 text-red-300' : 'bg-black/60 border border-gray-700 text-green-300'
              }`}>
                {output}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Solution */}
        <div className="mt-4 border-t border-gray-800 pt-4">
          <button onClick={() => setShowSolution(!showSolution)} className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
            {showSolution ? '▼ Hide' : '▶ Show'} Solution
          </button>
          <AnimatePresence>
            {showSolution && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-3">
                <CodeEditor defaultValue={solution} height="200px" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
