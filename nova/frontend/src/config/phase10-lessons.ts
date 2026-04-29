// Phase 10: Advanced Architectures & Generative AI
import { Lesson } from '../types';

export const PHASE_10_LESSONS: Lesson[] = [
  {
    id: 'adv-001',
    phaseId: 10,
    title: 'Generative Adversarial Networks (GANs)',
    description: 'Learn how to pit two networks against each other',
    estimatedMinutes: 50,
    xpReward: 200,
    content: `GANs (2014) introduced a revolutionary way to generate data (images, music, text) by creating a competition between two neural networks.

### The Generator vs. The Discriminator
1.  **The Generator:** Tries to create fake data that looks real.
2.  **The Discriminator:** Tries to distinguish between real data (from a dataset) and fake data (from the generator).

Think of it like a **forger** and a **detective**. The forger gets better at faking paintings as the detective gets better at spotting the fakes. Eventually, the generator becomes so good that the discriminator can't tell the difference!

### Challenges
*   **Mode Collapse:** The generator finds one specific "type" of image that fools the discriminator and keeps producing only that one.
*   **Unstable Training:** It's hard to balance the two networks; if one becomes too strong, the other stops learning.`,
    codeExample: `import torch.nn as nn

# A tiny GAN Generator
class Generator(nn.Module):
    def __init__(self, latent_dim, img_dim):
        super().__init__()
        self.model = nn.Sequential(
            nn.Linear(latent_dim, 128),
            nn.LeakyReLU(0.2),
            nn.Linear(128, img_dim),
            nn.Tanh() # Normalizes image pixels to [-1, 1]
        )
    def forward(self, z):
        return self.model(z)

print("Generator class defined.")`,
    quiz: [
      {
        id: 'q-gan-1',
        question: 'In a GAN, what is the job of the Discriminator?',
        options: [
          'To generate new images.',
          'To classify whether an image is real or fake.',
          'To calculate the learning rate.',
          'To store the training data.'
        ],
        correctIndex: 1,
        explanation: 'The discriminator is a classifier that learns to tell the difference between the real training data and the fake data produced by the generator.'
      }
    ],
    keyTakeaways: [
      'GANs consist of a Generator and a Discriminator.',
      'They are trained through an adversarial process.',
      'GANs are famous for creating realistic deepfakes and art.'
    ]
  },
  {
    id: 'adv-002',
    phaseId: 10,
    title: 'Diffusion Models',
    description: 'Understand the math behind DALL-E and Midjourney',
    estimatedMinutes: 60,
    xpReward: 250,
    content: `Diffusion models are the current state-of-the-art for image generation, powering tools like **Stable Diffusion**, **DALL-E 3**, and **Midjourney**.

### How it Works: Noise and Denoising
Instead of generating an image all at once (like GANs), Diffusion models learn to **remove noise**.

1.  **Forward Process (Diffusion):** We take a real image and slowly add Gaussian noise until it becomes pure static.
2.  **Reverse Process (Denoising):** The model learns to predict exactly how much noise was added at each step so it can subtract it.

To generate a new image, we start with **pure random noise** and ask the model to "clean it up" over hundreds of steps. By guiding this process with text prompts (using a Transformer), we can generate specific objects.

### Why Diffusion?
*   **Better Stability:** Unlike GANs, Diffusion models are much easier to train.
*   **Higher Quality:** They produce much more detailed and diverse images.
*   **Compositional:** They are better at following complex text instructions.`,
    keyTakeaways: [
      'Diffusion models generate data by reversing a noise process.',
      'They are more stable to train than GANs.',
      'Text-to-image generation is achieved by guiding the denoising process with embeddings.'
    ],
    realWorldConnections: [
      'AI Art generators (Midjourney, Stable Diffusion).',
      'High-quality photo restoration.',
      'Drug discovery (generating new molecular structures).'
    ]
  }
];

export default PHASE_10_LESSONS;
