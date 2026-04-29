// Phase 9: Transformers & Attention Mechanisms
import { Lesson } from '../types';

export const PHASE_9_LESSONS: Lesson[] = [
  {
    id: 'tf-001',
    phaseId: 9,
    title: 'Attention Mechanism Explained',
    description: 'Understand the core of modern NLP',
    estimatedMinutes: 60,
    xpReward: 150,
    content: `Attention allows models to focus on relevant parts of input. It's the foundation of modern NLP.

Instead of trying to compress all information into a single fixed-length vector (like traditional RNNs do), attention mechanisms allow the network to "look back" at the entire input sequence and assign a weight to each part, depending on how relevant it is to the current output word.

### Key Concepts (Q, K, V)
Think of attention as a **database search**:
*   **Query (Q):** What you are looking for.
*   **Key (K):** What labels are in the database.
*   **Value (V):** The actual information you want to retrieve.

The model calculates a score based on how well the **Query** matches each **Key**, and then returns a weighted sum of the **Values**.`,
    codeExample: `import torch
import torch.nn.functional as F

def basic_attention(Q, K, V):
    # Calculate scores (dot product)
    scores = torch.matmul(Q, K.transpose(-2, -1))
    
    # Scale scores (optional but common)
    d_k = Q.size(-1)
    scores = scores / (d_k ** 0.5)
    
    # Softmax to get weights
    weights = F.softmax(scores, dim=-1)
    
    # Weighted sum of values
    return torch.matmul(weights, V)

print("Attention function defined.")`,
    quiz: [
      {
        id: 'q-att-1',
        question: 'What is the main advantage of Attention over RNNs?',
        options: [
          'It is slower to train.',
          'It allows the model to access any part of the sequence directly, regardless of distance.',
          'It only works on very short sentences.',
          'It removes the need for GPUs.'
        ],
        correctIndex: 1,
        explanation: 'RNNs must pass information through every intermediate step. Attention can "jump" directly to any relevant token in the sequence.'
      }
    ],
    keyTakeaways: [
      'Attention solves the long-range dependency problem.',
      'Query, Key, and Value are the fundamental components.',
      'Attention scores determine how much weight to give each input token.'
    ]
  },
  {
    id: 'tf-002',
    phaseId: 9,
    title: 'Self-Attention & Multi-Head',
    description: 'Master the building blocks of the Transformer',
    estimatedMinutes: 60,
    xpReward: 200,
    content: `In **Self-Attention**, the Query, Key, and Value all come from the *same* sequence. This allows the model to build a context-aware representation of each word.

**Example:** "The animal didn't cross the street because **it** was too tired."
Self-attention allows the word "**it**" to strongly attend to "**animal**," helping the model understand what the pronoun refers to.

### Multi-Head Attention
Instead of one big attention operation, we split the work into multiple "heads."
*   Each head looks at the data differently (one might focus on grammar, another on meaning).
*   The results are concatenated together at the end.`,
    codeExample: `import torch.nn as nn

# A simplified Multi-Head Attention layer
mha = nn.MultiheadAttention(embed_dim=512, num_heads=8, batch_first=True)

# Input sequence: (batch, seq_len, embed_dim)
x = torch.randn(1, 10, 512)

# Self-attention: Q, K, and V are all the same 'x'
attn_output, attn_weights = mha(x, x, x)

print(f"Output shape: {attn_output.shape}") # [1, 10, 512]`,
    keyTakeaways: [
      'Self-attention builds context by relating words within the same sentence.',
      'Multi-head attention allows the model to learn multiple types of relationships simultaneously.'
    ]
  },
  {
    id: 'tf-003',
    phaseId: 9,
    title: 'Transformer, BERT & GPT',
    description: 'Learn the architectures that changed the world',
    estimatedMinutes: 65,
    xpReward: 250,
    content: `The **Transformer** (2017) discarded recurrence and convolution entirely in favor of attention.

### BERT (Bidirectional Encoder)
*   **Only uses the Encoder stack.**
*   Looks at both left and right context simultaneously.
*   Great for **understanding** (classification, Q&A).

### GPT (Generative Pre-trained Transformer)
*   **Only uses the Decoder stack.**
*   Looks only at previous words (unidirectional).
*   Great for **generating** text (Chatbots, writing).`,
    keyTakeaways: [
      'Transformers are the backbone of modern LLMs.',
      'BERT is for understanding; GPT is for generation.',
      'Positional encoding is used to give the model a sense of word order.'
    ]
  }
];

export default PHASE_9_LESSONS;
