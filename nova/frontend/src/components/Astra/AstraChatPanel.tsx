import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Lightbulb, BookOpen, BarChart2, Wrench, HelpCircle,
  Bot, User, Send, Loader2, Wifi, WifiOff,
  AlertTriangle, CheckCircle, AlertCircle, Rocket,
  ChevronRight, Zap, Eye, Code2, MessageSquare,
} from 'lucide-react'
import { useAstra } from './AstraContext'
import { AstraMode } from '../../lib/astraClient'

const MODES: { key: AstraMode; label: string; desc: string; Icon: React.FC<{ className?: string }> }[] = [
  { key: 'hint',      label: 'Hint',      desc: 'Nudge me in the right direction', Icon: Lightbulb  },
  { key: 'explain',   label: 'Explain',   desc: 'Full explanation with examples',  Icon: BookOpen   },
  { key: 'visualize', label: 'Visualize', desc: 'Show me diagrams and visuals',    Icon: Eye        },
  { key: 'debug',     label: 'Debug',     desc: 'Fix my code and explain why',     Icon: Wrench     },
  { key: 'socratic',  label: 'Socratic',  desc: 'Guide me with questions',         Icon: HelpCircle },
]

const QUICK_STARTERS: { text: string; Icon: React.FC<{ className?: string }> }[] = [
  { text: "I don't understand this concept",    Icon: HelpCircle    },
  { text: "Give me a hint for the quiz",        Icon: Lightbulb     },
  { text: "Can you visualize this for me?",     Icon: BarChart2     },
  { text: "Help me debug my code",              Icon: Code2         },
  { text: "Explain this like I'm 12",           Icon: BookOpen      },
  { text: "Connect this to what I learned",     Icon: MessageSquare },
]

export default function AstraChatPanel() {
  const {
    messages,
    isLoading,
    isOnline,
    mode,
    setMode,
    sendMessage,
    currentPhase,
    currentLesson,
    confusionLevel,
    suggestions,
  } = useAstra()

  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    const text = input.trim()
    setInput('')
    await sendMessage(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const confusionInfo = {
    high:   { color: 'text-red-400',    Icon: AlertCircle,  label: 'High confusion — ASTRA is adapting' },
    medium: { color: 'text-yellow-400', Icon: AlertTriangle, label: 'Some confusion detected' },
    low:    { color: 'text-green-400',  Icon: CheckCircle,  label: 'Learning on track' },
  }[confusionLevel]

  const currentModeConfig = MODES.find(m => m.key === mode)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="w-[420px] h-[580px] bg-[#030817]/95 backdrop-blur-xl border border-cyan-500/20 rounded-2xl flex flex-col overflow-hidden shadow-2xl shadow-cyan-500/10"
    >
      {/* ── Header ── */}
      <div className="px-4 py-3 border-b border-cyan-500/10 bg-gradient-to-r from-cyan-500/10 to-indigo-600/10">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-sm flex items-center gap-2">
              ASTRA
              <confusionInfo.Icon className={`w-3.5 h-3.5 ${confusionInfo.color}`} />
            </div>
            <div className="text-cyan-400/60 text-xs truncate">
              {currentPhase ? `Phase ${currentPhase}` : 'AI Learning Companion'}
              {currentLesson ? ` · ${currentLesson}` : ''}
            </div>
          </div>

          {/* Online status */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {isOnline
              ? <Wifi    className="w-3.5 h-3.5 text-green-400" />
              : <WifiOff className="w-3.5 h-3.5 text-red-400"   />
            }
            <span className="text-xs text-gray-500">{isOnline ? 'Online' : 'Offline'}</span>
          </div>
        </div>
      </div>

      {/* ── Confusion Banner ── */}
      {confusionLevel !== 'low' && (
        <div className={`px-3 py-1.5 text-xs ${confusionInfo.color} bg-black/20 border-b border-cyan-500/10 flex items-center gap-1.5`}>
          <confusionInfo.Icon className="w-3.5 h-3.5 flex-shrink-0" />
          {confusionInfo.label}
        </div>
      )}

      {/* ── Mode Selector ── */}
      <div className="px-3 py-2 flex gap-1.5 overflow-x-auto scrollbar-hide border-b border-cyan-500/10 bg-black/20">
        {MODES.map(({ key, label, desc, Icon }) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            title={desc}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              mode === key
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg'
                : 'text-gray-500 hover:text-gray-300 border border-transparent hover:bg-white/5'
            }`}
          >
            <Icon className="w-3 h-3" />
            {label}
          </button>
        ))}
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-hide">
        {messages.length === 0 ? (
          <div className="space-y-4">
            {/* Welcome */}
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400/20 to-indigo-600/20 border border-cyan-500/20 flex items-center justify-center mx-auto mb-3">
                <Rocket className="w-7 h-7 text-cyan-400" />
              </div>
              <p className="text-gray-300 text-sm font-medium mb-1">
                Greetings, Commander! I'm ASTRA.
              </p>
              <p className="text-gray-500 text-xs">
                Your AI mission co-pilot. I adapt to your learning style.
              </p>
            </div>

            {/* Quick starters */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3 h-3" /> Quick Start
              </p>
              {QUICK_STARTERS.map(({ text, Icon }, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(text)}
                  className="w-full text-left px-3 py-2 rounded-xl bg-cyan-500/5 border border-cyan-500/10 text-cyan-300/70 text-xs hover:bg-cyan-500/10 transition-all flex items-center gap-2 group"
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0 text-cyan-500/50 group-hover:text-cyan-400 transition-colors" />
                  {text}
                  <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-50 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* ASTRA avatar */}
              {msg.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
              )}

              <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600/40 text-white border border-indigo-500/30 rounded-tr-none'
                  : 'bg-cyan-500/10 text-cyan-100 border border-cyan-500/20 rounded-tl-none'
              }`}>
                {/* Mode badge on ASTRA messages */}
                {msg.role === 'assistant' && currentModeConfig && (
                  <div className="flex items-center gap-1 mb-1.5 opacity-50">
                    <currentModeConfig.Icon className="w-3 h-3" />
                    <span className="text-[10px] uppercase tracking-widest text-cyan-400">
                      {currentModeConfig.label}
                    </span>
                  </div>
                )}

                <div className="whitespace-pre-wrap">
                  {msg.content}
                  {isLoading && i === messages.length - 1 && msg.role === 'assistant' && !msg.content && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="text-cyan-400"
                    >
                      ▋
                    </motion.span>
                  )}
                </div>
              </div>

              {/* User avatar */}
              {msg.role === 'user' && (
                <div className="w-6 h-6 rounded-full bg-indigo-600/60 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </motion.div>
          ))
        )}

        {/* Thinking indicator */}
        {isLoading && (
          <div className="flex gap-2 justify-start">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl rounded-tl-none px-3 py-2 flex items-center gap-1">
              {[0, 0.2, 0.4].map((delay, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Suggestions ── */}
      {suggestions.length > 0 && messages.length > 0 && (
        <div className="px-3 py-2 border-t border-cyan-500/10 bg-black/20">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s)}
                className="flex-shrink-0 px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs hover:bg-cyan-500/20 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Input ── */}
      <div className="px-3 py-3 border-t border-cyan-500/10 bg-black/40">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isOnline ? 'Ask ASTRA anything...' : 'Reconnecting to Mission Control...'}
            disabled={isLoading}
            rows={1}
            className="flex-1 bg-white/5 border border-cyan-500/20 rounded-xl px-3 py-2 text-white text-sm placeholder-gray-600 resize-none focus:outline-none focus:border-cyan-500/50 disabled:opacity-40 transition-all"
            style={{ minHeight: '36px', maxHeight: '80px' }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="w-10 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center disabled:opacity-40 transition-all shadow-lg shadow-cyan-500/20"
          >
            {isLoading
              ? <Loader2 className="w-4 h-4 text-white animate-spin" />
              : <Send    className="w-4 h-4 text-white" />
            }
          </motion.button>
        </div>

        {/* Mode hint */}
        <div className="mt-1.5 flex items-center justify-center gap-1 text-xs text-gray-600">
          {currentModeConfig && <currentModeConfig.Icon className="w-3 h-3" />}
          <span>{currentModeConfig?.desc}</span>
        </div>
      </div>
    </motion.div>
  )
}
