import { Lesson } from '@/types';

export const PHASE_5_LESSONS: Lesson[] = [
  {
    id: 'phase5-lesson1',
    phaseId: 5,
    title: 'Transformers & Self-Attention',
    description: 'Master the attention mechanism that powers modern AI',
    estimatedMinutes: 60,
    xpReward: 150,
    visualization: 'attention_mechanism',
    content: `# Lesson 1: Transformers & Self-Attention

## What is Self-Attention?

Self-attention is a mechanism that allows each token in a sequence to attend to (look at) every other token. It computes a weighted sum of all tokens, where the weights are learned based on relevance.

Think of it like this: when reading a sentence, your brain doesn't process each word in isolation. Instead, you understand each word by considering its relationship to all other words in the context.

Example: "The bank can guarantee deposits will cover future tuition costs"
- When processing "bank", self-attention looks at all words
- It learns that "deposits" and "guarantee" are relevant to understanding "bank"
- It learns that "tuition" and "costs" are NOT relevant to "bank"
- Result: "bank" is understood as financial institution, not river bank

## The Math Behind Self-Attention

Self-attention computes three matrices from the input:
- **Query (Q)**: What am I looking for?
- **Key (K)**: What information do I have?
- **Value (V)**: What information should I pass forward?

The attention score between position i and j is:
\\\
attention_score(i,j) = softmax(Q_i · K_j / √d_k)
\\\

The output is a weighted sum of values:
\\\
output_i = Σ_j attention_score(i,j) × V_j
\\\

The √d_k scaling prevents attention scores from becoming too large (which would make gradients tiny).

## Multi-Head Attention

Instead of one attention head, Transformers use multiple heads in parallel. Each head learns different types of relationships:
- Head 1: might learn subject-verb relationships
- Head 2: might learn adjective-noun relationships
- Head 3: might learn long-range dependencies
- Head 4: might learn syntactic structure

The outputs are concatenated and projected back to the original dimension.

## Why Transformers Are Revolutionary

Before Transformers (RNNs, LSTMs):
- Process sequences sequentially (token by token)
- Hard to parallelize (must wait for previous token)
- Slow to train on long sequences
- Forget information from distant tokens

Transformers:
- Process entire sequence in parallel
- All tokens attend to all other tokens simultaneously
- Fast to train (can use all GPU cores)
- Can learn long-range dependencies easily

## Positional Encoding

Transformers don't have built-in notion of position. To tell the model "token 5 comes after token 4", we add positional encodings to the embeddings.

Two approaches:
1. **Sinusoidal (absolute)**: Use sin/cos functions of different frequencies
2. **Learned (relative)**: Learn position embeddings like token embeddings

Modern models often use relative positional encodings (RoPE, ALiBi) which generalize better to longer sequences than the model was trained on.

## The Transformer Block

A complete Transformer block has:
1. Multi-head self-attention
2. Feed-forward network (two linear layers with ReLU)
3. Layer normalization (before or after each sublayer)
4. Residual connections (skip connections)

The residual connections are crucial — they allow gradients to flow directly through the network, enabling training of very deep models (100+ layers).`
  },
  {
    id: 'phase5-lesson2',
    phaseId: 5,
    title: 'BERT: Bidirectional Encoder Representations',
    description: 'Learn how BERT revolutionized NLP with masked language modeling',
    estimatedMinutes: 65,
    xpReward: 150,
    visualization: 'bert_architecture',
    content: `# Lesson 2: BERT - Bidirectional Encoder Representations

## What is BERT?

BERT (Bidirectional Encoder Representations from Transformers) is a pre-trained Transformer encoder that reads text bidirectionally — each token can attend to all other tokens (left and right).

Key innovation: BERT uses **Masked Language Modeling (MLM)** for pre-training instead of predicting the next token.

## Masked Language Modeling (MLM)

The MLM objective:
1. Randomly mask 15% of tokens in the input
2. Train the model to predict the masked tokens
3. The model must use context from BOTH left and right

Example:
\\\
Original:  "The cat sat on the mat"
Masked:    "The [MASK] sat on the [MASK]"
Target:    "cat" and "mat"
\\\

The model learns bidirectional context because it needs information from both sides to predict masked tokens.

## The Three-Way Masking Strategy

For the 15% of tokens selected for masking:
- 80% → replaced with [MASK] token
- 10% → replaced with random token
- 10% → kept as original

Why this split?
- 80% [MASK]: Forces the model to predict from context
- 10% random: Prevents the model from ignoring non-[MASK] tokens
- 10% original: Provides an anchor signal

This ensures the model learns good representations for ALL token types, not just [MASK].

## Next Sentence Prediction (NSP)

BERT also uses NSP as a secondary objective:
- 50% of the time: sentence B is the actual next sentence (label: IsNext)
- 50% of the time: sentence B is a random sentence (label: NotNext)

The model learns to predict whether B follows A.

Note: Later research (RoBERTa) showed NSP doesn't help much — MLM alone is sufficient.

## BERT's Architecture

- **Encoder-only**: No decoder, just stacked Transformer encoder layers
- **Bidirectional**: Each token attends to all positions
- **Pre-trained**: Trained on 3.3B words from BookCorpus + Wikipedia
- **Fine-tuned**: Adapted to downstream tasks (classification, NER, QA)

## How to Use BERT

1. **Pre-training** (done by Google, takes weeks on TPUs):
   - Train on massive unlabeled text
   - Learn general language understanding

2. **Fine-tuning** (you can do this):
   - Add a task-specific head (e.g., classification layer)
   - Train on labeled data for your task
   - Takes hours on a single GPU

Example tasks:
- Sentiment classification: [CLS] review text [SEP] → positive/negative
- Named entity recognition: tag each token as person/org/location/other
- Question answering: [CLS] question [SEP] passage [SEP] → span of answer

## Why Bidirectional Matters

Bidirectional context is crucial for understanding:
- Ambiguous words: "bank" (financial vs river) — need full context
- Pronouns: "it" — need to look ahead to understand what "it" refers to
- Negation: "not good" — need both words to understand the meaning

This is why BERT excels at understanding tasks but struggles at generation (it can't generate left-to-right).`
  },
  {
    id: 'phase5-lesson3',
    phaseId: 5,
    title: 'GPT: Generative Pre-trained Transformers',
    description: 'Master autoregressive generation and the GPT family',
    estimatedMinutes: 60,
    xpReward: 150,
    visualization: 'gpt_generation',
    content: `# Lesson 3: GPT - Generative Pre-trained Transformers

## What is GPT?

GPT (Generative Pre-trained Transformer) is a Transformer **decoder** that generates text one token at a time, left-to-right.

Key difference from BERT:
- BERT: bidirectional encoder (understands text)
- GPT: unidirectional decoder (generates text)

## Causal Masking

GPT uses **causal masking** in self-attention: each position can only attend to itself and previous positions.

Why? Because during generation, future tokens don't exist yet. The model must predict token t+1 without seeing it.

Example:
\\\
Position 0: can attend to [0]
Position 1: can attend to [0, 1]
Position 2: can attend to [0, 1, 2]
Position 3: can attend to [0, 1, 2, 3]
\\\

This is implemented with a triangular attention mask that sets future positions to -∞ before softmax.

## Autoregressive Generation

GPT generates text by repeatedly:
1. Take the sequence so far
2. Compute logits for the next token
3. Sample from the distribution
4. Append the sampled token
5. Repeat

Example:
\\\
Step 1: input = [The]
        output = logits for next token
        sample "cat" with probability 0.8
        
Step 2: input = [The, cat]
        output = logits for next token
        sample "sat" with probability 0.6
        
Step 3: input = [The, cat, sat]
        output = logits for next token
        sample "on" with probability 0.7
\\\

## Temperature Sampling

Raw logits can be scaled by temperature before sampling:
- **Temperature < 1** (e.g., 0.3): sharper distribution, more focused/deterministic
- **Temperature = 1**: normal distribution
- **Temperature > 1** (e.g., 1.8): flatter distribution, more random/creative

\\\
logits_scaled = logits / temperature
probs = softmax(logits_scaled)
\\\

Lower temperature → model repeats high-probability tokens (boring but coherent)
Higher temperature → model explores low-probability tokens (creative but incoherent)

## Top-K and Top-P Sampling

To avoid sampling rare tokens that break coherence:

**Top-K**: Only sample from the K most likely tokens
- Prevents sampling from the long tail of unlikely tokens
- Typical: K = 40-50

**Top-P (Nucleus)**: Only sample from tokens whose cumulative probability reaches P
- More adaptive than top-K
- Typical: P = 0.9

## The GPT Family

- **GPT (2018)**: 117M parameters, trained on 40GB of text
- **GPT-2 (2019)**: 1.5B parameters, showed emergent abilities
- **GPT-3 (2020)**: 175B parameters, in-context learning
- **GPT-3.5 (2022)**: Fine-tuned with RLHF → ChatGPT
- **GPT-4 (2023)**: Multimodal, 128K context window

## In-Context Learning

GPT-3 showed a surprising ability: it can learn from examples in the prompt without any weight updates.

Example:
\\\
Prompt:
"Translate English to French:
dog → chien
cat → chat
house → ?"

Output: "maison"
\\\

The model learned the translation task from just 2 examples in the context. This is called **few-shot learning** and it's an emergent ability that appears at scale (100B+ parameters).

## Why Autoregressive Generation?

Autoregressive generation is:
- **Flexible**: Can generate any length of text
- **Controllable**: Can use temperature, top-K, top-P to control randomness
- **Efficient**: Only need to compute logits for the next token
- **Natural**: Matches how humans read (left-to-right)

But it's also:
- **Slow**: Must generate one token at a time (can't parallelize)
- **Error-prone**: Mistakes compound (wrong token at step 5 affects step 6)`
  },
  {
    id: 'phase5-lesson4',
    phaseId: 5,
    title: 'Fine-tuning & LoRA: Adapting Pre-trained Models',
    description: 'Learn efficient fine-tuning techniques for large models',
    estimatedMinutes: 55,
    xpReward: 150,
    visualization: 'lora_adaptation',
    content: `# Lesson 4: Fine-tuning & LoRA - Adapting Pre-trained Models

## The Pre-training + Fine-tuning Paradigm

Modern NLP follows a two-stage process:

**Stage 1: Pre-training** (done once, by big labs)
- Train on massive unlabeled text (100B-1T tokens)
- Learn general language understanding
- Takes weeks/months on thousands of GPUs
- Result: a general-purpose model

**Stage 2: Fine-tuning** (you can do this)
- Train on labeled data for your specific task
- Adapt the pre-trained model to your domain
- Takes hours/days on a single GPU
- Result: a task-specific model

Why is this better than training from scratch?
- Pre-training learns universal features (grammar, facts, reasoning)
- Fine-tuning only needs to learn task-specific patterns
- Requires far less labeled data (100s instead of millions)
- Trains much faster (hours instead of weeks)

## Full Fine-tuning

Full fine-tuning updates ALL parameters of the pre-trained model.

Pros:
- Maximum model capacity for the task
- Best possible performance

Cons:
- Requires storing gradients for all parameters
- Memory usage: 3-4× model size (weights + gradients + optimizer states)
- For GPT-3 (175B): need 500GB+ GPU memory
- Expensive and slow

## LoRA: Low-Rank Adaptation

LoRA (Hu et al., 2021) is a parameter-efficient fine-tuning method.

**Key idea**: The weight updates ΔW during fine-tuning are low-rank.

Instead of updating the full weight matrix W:
\\\
W_new = W_old + ΔW
\\\

LoRA approximates ΔW as a product of two small matrices:
\\\
ΔW ≈ B @ A
where:
  A ∈ ℝ^{r × d_in}   (r << d_in)
  B ∈ ℝ^{d_out × r}  (r << d_out)
\\\

The forward pass becomes:
\\\
output = W @ x + (B @ A) @ x
       = W @ x + B @ (A @ x)
\\\

## Why LoRA Works

Empirical observation: when fine-tuning large pre-trained models, the weight updates are intrinsically low-rank.

This means:
- The model doesn't need to change much to adapt to a new task
- The changes it does make live in a low-dimensional subspace
- We can capture 99% of the fine-tuning performance with rank r=16-64

## LoRA Initialization

Critical detail: B is initialized to ZERO.

Why? Because ΔW = B @ A:
- If B = 0, then ΔW = 0 @ A = 0
- The model starts with the pre-trained weights unchanged
- Training smoothly adapts from the pre-trained baseline

If both A and B were random, the initial ΔW would be a large random matrix that destroys the pre-trained representations.

## LoRA Benefits

For GPT-3 (175B parameters):
- Full fine-tuning: 175B trainable parameters
- LoRA (rank 16): ~3.3M trainable parameters
- **Parameter reduction: 99.998%**

Memory savings:
- Full fine-tuning: 500GB GPU memory
- LoRA: 50GB GPU memory
- **10× memory reduction**

Cost savings:
- Full fine-tuning: /hour on 8× A100 GPUs
- LoRA: /hour on 1× A100 GPU
- **8× cost reduction**

## QLoRA: Quantized LoRA

QLoRA (Dettmers et al., 2023) combines LoRA with quantization:
- Load model in 4-bit (NF4 quantization)
- Add LoRA adapters in float16
- Fine-tune on a single consumer GPU

Example: LLaMA 70B on a single 80GB A100
- Without QLoRA: impossible (needs 140GB just for weights)
- With QLoRA: works perfectly, costs < total

## When to Use Each Method

**Full fine-tuning**:
- Small models (< 1B parameters)
- Unlimited compute budget
- Maximum performance needed

**LoRA**:
- Large models (> 7B parameters)
- Limited compute budget
- Good performance is sufficient

**QLoRA**:
- Very large models (> 30B parameters)
- Consumer hardware only
- Acceptable performance is sufficient`
  },
  {
    id: 'phase5-lesson5',
    phaseId: 5,
    title: 'Tokenization & Scaling: From Text to Tokens to Trillion-Parameter Models',
    description: 'Master tokenization and understand how models scale',
    estimatedMinutes: 60,
    xpReward: 150,
    visualization: 'tokenization_pipeline',
    content: `# Lesson 5: Tokenization & Scaling

## Why Tokenization Matters

Transformers process integers, not text. Tokenization converts text into integers.

The tokenizer is the interface between human language and model computation:
- Input: "Hello, world!"
- Tokenizer: [15496, 11, 1917, 0]
- Model: processes integers
- Output: next token ID

The choice of tokenizer affects:
- Sequence length (more tokens = slower)
- Model vocabulary size
- How well the model handles rare words
- How well it generalizes to new languages/domains
- How well it handles code/math

## The Tokenization Pipeline

1. **Normalization**: Clean text (lowercase, remove extra spaces)
2. **Pre-tokenization**: Split into chunks (usually words)
3. **Model**: Convert chunks to subword tokens (BPE, WordPiece)
4. **Post-processing**: Add special tokens ([CLS], [SEP], [EOS])

## Common Tokenizers

- **BPE (Byte-Pair Encoding)**: Used by GPT-2, GPT-3, LLaMA
- **WordPiece**: Used by BERT
- **SentencePiece**: Language-independent, used by T5

## Scaling Laws (The Chinchilla Discovery)

Research shows model performance depends predictably on:
- Number of parameters (N)
- Dataset size (D)
- Compute budget (C)

**Key Insight**: Most models were "under-trained". To scale efficiently, you should scale parameters and tokens equally. 10B parameters need 200B tokens for optimal results.

## Emergent Abilities

At a certain scale (usually > 10B parameters), LLMs develop abilities they didn't have before:
- Mathematical reasoning
- Logical deduction
- Understanding sarcasm
- Zero-shot task performance

This is why scaling up is so powerful - it doesn't just make the model better at grammar, it gives it new kinds of intelligence.`
  }
];

export default PHASE_5_LESSONS;
