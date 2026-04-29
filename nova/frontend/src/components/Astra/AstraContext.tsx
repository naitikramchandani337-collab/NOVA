import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'
import { 
  AstraMessage, 
  AstraMode, 
  LearningContext, 
  streamAstraChat, 
  pingAstra, 
  LearningTracker,
  celebrateProgress
} from '../../lib/astraClient'

interface AstraContextType {
  // Core State
  isOpen: boolean
  isOnline: boolean
  isLoading: boolean
  messages: AstraMessage[]
  mode: AstraMode
  
  // Learning Context
  currentPhase: number | undefined
  currentLesson: string | undefined
  learningTracker: LearningTracker
  
  // Actions
  toggleOpen: () => void
  sendMessage: (text: string) => Promise<void>
  setMode: (mode: AstraMode) => void
  setContext: (phase?: number, lesson?: string) => void
  checkOnline: () => Promise<void>
  recordQuizAttempt: () => void
  recordReplay: () => void
  celebrateStudentProgress: (data: any) => Promise<void>
  
  // Advanced Features
  confusionLevel: 'low' | 'medium' | 'high'
  suggestions: string[]
  showVisual: boolean
}

const AstraCtx = createContext<AstraContextType | null>(null)

export function AstraProvider({ children }: { children: ReactNode }) {
  // Core state
  const [isOpen, setIsOpen] = useState(false)
  const [isOnline, setIsOnline] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<AstraMessage[]>([])
  const [mode, setMode] = useState<AstraMode>('explain')
  
  // Context state
  const [currentPhase, setCurrentPhase] = useState<number | undefined>()
  const [currentLesson, setCurrentLesson] = useState<string | undefined>()
  const [learningTracker] = useState(() => new LearningTracker())
  
  // Advanced state
  const [confusionLevel, setConfusionLevel] = useState<'low' | 'medium' | 'high'>('low')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showVisual, setShowVisual] = useState(false)
  const [failedAttempts, setFailedAttempts] = useState(0)

  // Check online status with retry
  const checkOnline = useCallback(async () => {
    let attempts = 0
    const maxAttempts = 3

    while (attempts < maxAttempts) {
      try {
        const online = await pingAstra()
        setIsOnline(online)
        if (online) return // Success — stop retrying
      } catch {
        attempts++
        if (attempts < maxAttempts) {
          await new Promise(r => setTimeout(r, 2000))
        }
      }
    }

    // After 3 failed attempts — still allow sending messages
    setIsOnline(true)
  }, [])

  // Toggle chat panel
  const toggleOpen = useCallback(() => {
    setIsOpen(prev => {
      if (!prev) {
        checkOnline()
      }
      return !prev
    })
  }, [checkOnline])

  // Set learning context
  const setContext = useCallback((phase?: number, lesson?: string) => {
    setCurrentPhase(phase)
    setCurrentLesson(lesson)
    learningTracker.reset() // Reset tracking for new context
  }, [learningTracker])

  // Record learning events
  const recordQuizAttempt = useCallback(() => {
    learningTracker.recordQuizAttempt()
    setFailedAttempts(prev => prev + 1)
  }, [learningTracker])

  const recordReplay = useCallback(() => {
    learningTracker.recordReplay()
  }, [learningTracker])

  // Celebrate progress
  const celebrateStudentProgress = useCallback(async (data: any) => {
    try {
      const celebration = await celebrateProgress(data)
      
      // Add celebration as ASTRA message
      const celebrationMsg: AstraMessage = {
        role: 'assistant',
        content: `${celebration.celebration}\n\n${celebration.encouragement}`
      }
      
      setMessages(prev => [...prev, celebrationMsg])
      
      // Reset failed attempts on success
      if (data.quiz_score >= 70) {
        setFailedAttempts(0)
      }
    } catch (error) {
      console.error('Celebration error:', error)
    }
  }, [])

  // Send message to ASTRA
  const sendMessage = useCallback(async (text: string) => {
    // ✅ FIXED: Removed !isOnline check — let it try and handle errors gracefully
    if (!text.trim() || isLoading) return

    const userMsg: AstraMessage = { role: 'user', content: text.trim() }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    const astraMsg: AstraMessage = { role: 'assistant', content: '' }
    setMessages(prev => [...prev, astraMsg])

    try {
      const context: LearningContext = learningTracker.getContext()

      let currentConfusion: 'low' | 'medium' | 'high' = 'low'
      if (context.quiz_attempts && context.quiz_attempts >= 3) {
        currentConfusion = 'high'
      } else if (context.time_on_section && context.time_on_section > 600) {
        currentConfusion = 'medium'
      }
      setConfusionLevel(currentConfusion)

      const stream = streamAstraChat({
        message: text,
        mode,
        phase: currentPhase,
        lesson: currentLesson,
        history: messages.slice(-6),
        context,
        failed_attempts: failedAttempts,
      })

      for await (const chunk of stream) {
        setMessages(prev => {
          const updated = [...prev]
          const last = updated[updated.length - 1]
          if (last?.role === 'assistant') {
            updated[updated.length - 1] = { ...last, content: last.content + chunk }
          }
          return updated
        })
      }

      const modeSuggestions: Record<AstraMode, string[]> = {
        hint:      ['Give me another hint', 'I need more help', 'Show me an example'],
        explain:   ['Show me visually', 'Simpler explanation', 'Connect to previous concepts'],
        visualize: ['Explain the code', 'Give me the theory', 'Show a real example'],
        debug:     ['Why is this wrong?', 'Show best practices', 'Help prevent this error'],
        socratic:  ['Just tell me', 'Give me a hint', 'Show an example'],
      }

      setSuggestions(modeSuggestions[mode] ?? ['Ask me anything 🚀'])
      setShowVisual(mode === 'visualize')

    } catch (err) {
      console.error('ASTRA Error:', err)
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Navigating through turbulence, Commander. Make sure the backend is running on port 8000 🛰️',
        }
        return updated
      })
    } finally {
      setIsLoading(false)
    }
  }, [messages, mode, currentPhase, currentLesson, failedAttempts, isLoading, learningTracker])

  // Check online on mount + re-check when tab becomes active
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkOnline()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    checkOnline()

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [checkOnline])

  const value: AstraContextType = {
    // Core state
    isOpen,
    isOnline,
    isLoading,
    messages,
    mode,
    
    // Learning context
    currentPhase,
    currentLesson,
    learningTracker,
    
    // Actions
    toggleOpen,
    sendMessage,
    setMode,
    setContext,
    checkOnline,
    recordQuizAttempt,
    recordReplay,
    celebrateStudentProgress,
    
    // Advanced features
    confusionLevel,
    suggestions,
    showVisual
  }

  return (
    <AstraCtx.Provider value={value}>
      {children}
    </AstraCtx.Provider>
  )
}

export const useAstra = () => {
  const ctx = useContext(AstraCtx)
  if (!ctx) throw new Error('useAstra must be used inside AstraProvider')
  return ctx
}