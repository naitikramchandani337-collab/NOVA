// Phase 12: Capstone Project & Mission Launch
import { Lesson } from '../types';

export const PHASE_12_LESSONS: Lesson[] = [
  {
    id: 'cap-001',
    phaseId: 12,
    title: 'Mission Briefing',
    description: 'Design your final AI system',
    estimatedMinutes: 60,
    xpReward: 300,
    content: `Congratulations, Commander! You have reached the final stage of your journey. Your rocket is nearly complete, but it needs a core mission.

In this phase, you will define and build a **Capstone Project** that demonstrates everything you've learned:
*   Data processing (Phase 1-2)
*   Model selection (Phase 3-6)
*   Advanced architecture (Phase 7-10)
*   Deployment readiness (Phase 11)

### Project Ideas
1.  **Galaxy Classifier:** Identify types of galaxies from satellite imagery.
2.  **Solar Flare Predictor:** Analyze sunspot data to predict flares.
3.  **Astro-Chatbot:** A fine-tuned assistant that knows everything about space exploration.

### Your Goal
You aren't just writing code; you are building a system. Consider the data source, the evaluation metrics, and how a user would interact with it.`,
    keyTakeaways: [
      'The Capstone project is the ultimate test of your skills.',
      'A good project has a clear goal, dataset, and evaluation method.',
      'Documenting your process is as important as the code itself.'
    ]
  },
  {
    id: 'cap-002',
    phaseId: 12,
    title: 'The Final Launch',
    description: 'Finalize your rocket and launch into deep space',
    estimatedMinutes: 30,
    xpReward: 500,
    content: `The engines are humming, the guidance systems are locked, and the AI consciousness is online. It is time for liftoff.

### Professional Roadmap
Becoming an AI Engineer is a lifelong journey. Beyond this course, you should:
1.  **Keep Building:** Join Kaggle competitions or contribute to Open Source.
2.  **Read Papers:** Stay updated with sites like arXiv.org.
3.  **Network:** Engage with the AI community on Twitter and LinkedIn.

### Launch Sequence
When you complete this phase, your rocket will launch from the NOVA platform. You will receive your **Master AI Architect** badge and your place on the global leaderboard will be secured.

Safe travels, Commander. The universe awaits.`,
    keyTakeaways: [
      'Consistency is the key to mastering AI.',
      'Build a portfolio to showcase your Capstone project.',
      'Never stop learning.'
    ]
  }
];

export default PHASE_12_LESSONS;
