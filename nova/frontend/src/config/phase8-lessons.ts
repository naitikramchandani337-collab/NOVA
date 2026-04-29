// Phase 8: Recurrent Neural Networks (RNNs) & Sequential Data
import { Lesson } from '../types';

export const PHASE_8_LESSONS: Lesson[] = [
  {
    id: 'rnn-001',
    phaseId: 8,
    title: 'Processing Sequences',
    description: 'Learn why standard networks fail on sequential data',
    estimatedMinutes: 40,
    xpReward: 150,
    content: `Images are spatial, but many things in life are **sequential**: text, speech, stock prices, and heartbeats. In these cases, the order of data matters.

### The Problem with "Vanilla" Networks
Standard neural networks assume all inputs are independent. If you feed them words one by one, they "forget" the first word by the time they see the third.

### Recurrent Neural Networks (RNNs)
RNNs have **loops**. They maintain a "hidden state" (a memory) that is updated at every step of the sequence.

*   **Timesteps:** The sequence is processed one step at a time (t=1, t=2, etc.).
*   **Hidden State (h):** At each step, the network takes the current input ($x_t$) AND the previous hidden state ($h_{t-1}$) to produce a new hidden state ($h_t$).
*   **Unrolling:** You can think of an RNN as multiple copies of the same network, each passing a message to a successor.

### Applications
*   **Sentiment Analysis:** Reading a sentence to decide if it's positive or negative.
*   **Time Series Prediction:** Predicting tomorrow's weather based on the last week.
*   **Speech-to-Text:** Processing audio waves over time.`,
    codeExample: `import torch
import torch.nn as nn

# Simple RNN: 10 input features, 20 hidden features
rnn = nn.RNN(input_size=10, hidden_size=20, batch_first=True)

# Sequence of 5 items, each with 10 features
# Shape: (batch_size, sequence_length, input_size)
input_seq = torch.randn(1, 5, 10)

# output: hidden states for all steps
# hn: final hidden state
output, hn = rnn(input_seq)

print(f"Output shape: {output.shape}") # [1, 5, 20]
print(f"Final hidden state: {hn.shape}") # [1, 1, 20]`,
    quiz: [
      {
        id: 'q-rnn-1',
        question: 'What is the "hidden state" in an RNN?',
        options: [
          'A layer that is invisible to the user.',
          'A memory that carries information from previous steps in the sequence.',
          'The final output of the network.',
          'A way to hide weights from the optimizer.'
        ],
        correctIndex: 1,
        explanation: 'The hidden state acts as the networks memory, capturing information about what it has seen in the sequence so far.'
      }
    ],
    keyTakeaways: [
      'RNNs are designed for data where order matters.',
      'The hidden state allows the network to persist information across timesteps.',
      'Unrolling helps visualize how RNNs process sequences.'
    ]
  },
  {
    id: 'rnn-002',
    phaseId: 8,
    title: 'LSTMs: Long Short-Term Memory',
    description: 'Solve the problem of long-term forgetting',
    estimatedMinutes: 50,
    xpReward: 200,
    content: `Basic RNNs have a major flaw: they are very bad at remembering things from a long time ago. This is called the **Vanishing Gradient Problem**. By the time the network gets to the end of a long sentence, the influence of the first word has faded to almost zero.

### Enter the LSTM
LSTMs were designed specifically to solve this. They use a more complex "cell state" and **gates** to control the flow of information.

1.  **Forget Gate:** Decides what information to discard from the memory.
2.  **Input Gate:** Decides what new information to store in the memory.
3.  **Output Gate:** Decides what part of the memory to use for the current output.

### Cell State ($C_t$)
Think of the cell state as a "conveyor belt" that runs through the whole sequence. Gates can add or remove information from this belt with only minor linear interactions. This allows information to flow unchanged for many timesteps!

### GRUs (Gated Recurrent Units)
A simpler, faster version of the LSTM. It combines the forget and input gates into a single "update gate." It often performs just as well as LSTMs but is computationally cheaper.`,
    codeExample: `import torch.nn as nn

# LSTM: 10 input, 20 hidden
lstm = nn.LSTM(input_size=10, hidden_size=20, batch_first=True)

# GRU: 10 input, 20 hidden
gru = nn.GRU(input_size=10, hidden_size=20, batch_first=True)

print("LSTM and GRU layers initialized.")`,
    quiz: [
      {
        id: 'q-lstm-1',
        question: 'Why were LSTMs invented?',
        options: [
          'To make RNNs run faster.',
          'To handle the vanishing gradient problem and remember long-term dependencies.',
          'To process images more effectively.',
          'To replace the need for backpropagation.'
        ],
        correctIndex: 1,
        explanation: 'Standard RNNs forget the beginning of long sequences. LSTMs use gates to maintain a cell state that can preserve information over long intervals.'
      }
    ],
    keyTakeaways: [
      'LSTMs use gates to control what to remember and what to forget.',
      'The cell state is the "long-term memory" of the LSTM.',
      'GRUs are a modern, efficient alternative to LSTMs.'
    ]
  }
];

export default PHASE_8_LESSONS;
