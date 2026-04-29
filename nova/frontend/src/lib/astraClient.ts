// src/lib/astraClient.ts
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export type AstraMode = 'hint' | 'explain' | 'visualize' | 'debug' | 'socratic';

export interface AstraMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface LearningContext {
  quiz_attempts?: number;
  time_on_section?: number;
  replays?: number;
  weak_topics?: string[];
}

export interface StreamAstraChatParams {
  message: string;
  mode: AstraMode;
  phase?: number;
  lesson?: string;
  history: AstraMessage[];
  context: LearningContext;
  failed_attempts: number;
}

export async function pingAstra(): Promise<boolean> {
  try {
    const response = await axios.get(`${BASE_URL}/health`, { timeout: 5000 });
    return response.status === 200;
  } catch {
    return false;
  }
}

export async function* streamAstraChat(
  params: StreamAstraChatParams
): AsyncGenerator<string> {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/astra/chat`,
      {
        message:         params.message,
        mode:            params.mode ?? 'explain',
        phase:           params.phase ?? 1,
        lesson:          params.lesson ?? '',
        user_id:         'anonymous',
        history:         params.history.map((m) => ({
          role:    m.role,
          content: m.content,
        })),
        context: params.context
          ? {
              quiz_attempts:   params.context.quiz_attempts   ?? 0,
              time_on_section: params.context.time_on_section ?? 0,
              replays:         params.context.replays         ?? 0,
              weak_topics:     params.context.weak_topics     ?? [],
            }
          : null,
        failed_attempts: params.failed_attempts ?? 0,
      },
      { timeout: 30000 }
    );

    const text: string =
      response.data?.message ||
      response.data?.response ||
      'Ready for your next question, Commander 🚀';

    // Simulate streaming word by word
    const words = text.split(' ');
    for (let i = 0; i < words.length; i++) {
      yield (i === 0 ? '' : ' ') + words[i];
      await new Promise((r) => setTimeout(r, 18));
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        yield 'Backend offline. Start with: uvicorn app.main:app --reload 🛰️';
        return;
      }
      if (error.response.status === 422) {
        console.error('422 Validation Error:', error.response.data);
        yield 'Request format error. Check console for details.';
        return;
      }
      if (error.response.status === 403) {
        yield 'Authentication required. Please log in, Commander 🚀';
        return;
      }
      yield `Systems error ${error.response.status}. Adjusting course 🛰️`;
      return;
    }
    yield 'Unknown anomaly. Please try again, Commander 🚀';
  }
}

export class LearningTracker {
  private quizAttempts = 0;
  private replays = 0;
  private startTime = Date.now();
  private weakTopics: string[] = [];

  recordQuizAttempt() { this.quizAttempts++; }
  recordReplay()      { this.replays++; }

  addWeakTopic(topic: string) {
    if (!this.weakTopics.includes(topic)) this.weakTopics.push(topic);
  }

  reset() {
    this.quizAttempts = 0;
    this.replays      = 0;
    this.startTime    = Date.now();
  }

  getContext(): LearningContext {
    return {
      quiz_attempts:   this.quizAttempts,
      time_on_section: Math.floor((Date.now() - this.startTime) / 1000),
      replays:         this.replays,
      weak_topics:     this.weakTopics,
    };
  }
}

export interface CelebrationData {
  quiz_score?: number;
  phase_completed?: number;
  streak?: number;
  xp_gained?: number;
}

export interface CelebrationResponse {
  celebration: string;
  encouragement: string;
}

export async function celebrateProgress(
  data: CelebrationData
): Promise<CelebrationResponse> {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/astra/celebrate-progress`,
      data,
      { timeout: 10000 }
    );
    return response.data;
  } catch {
    const score = data.quiz_score ?? 0;
    return {
      celebration:
        score >= 90 ? '🚀 Outstanding, Commander! Perfect score!'
        : score >= 70 ? '✅ Mission successful!'
        : '💪 Solid effort, Commander!',
      encouragement: 'The stars are waiting for you 🌌',
    };
  }
}
