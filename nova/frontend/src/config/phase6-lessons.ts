import { Lesson } from '@/types';

// Phase 6: PyTorch & Deep Learning Framework - Complete Lessons
// All 6 lessons with theory, code examples, exercises, and quizzes

export const PHASE_6_LESSONS: Lesson[] = [
  {
    id: 'phase6-lesson1',
    phaseId: 6,
    title: 'Tensors, Autograd & PyTorch Fundamentals',
    description: 'Master PyTorch tensors and automatic differentiation',
    estimatedMinutes: 60,
    xpReward: 120,
    visualization: 'tensor',
    content: `# Lesson 1: Tensors, Autograd & PyTorch Fundamentals

## What is PyTorch?

PyTorch is a deep learning framework built by Meta (Facebook) that lets you build neural networks in Python. Think of it as NumPy on steroids - it has all the array operations you know from NumPy, but with automatic differentiation (computing gradients automatically) and GPU acceleration built in.

Why PyTorch?
- **Pythonic**: Code feels like regular Python, not a special language
- **Dynamic**: You can use regular Python loops and if statements inside your model
- **Research-friendly**: Used by most AI research labs (OpenAI, DeepMind, etc.)
- **Production-ready**: Used by Meta, Tesla, Uber in production systems

## What is a Tensor?

A tensor is just a multi-dimensional array of numbers. Think of it like this:
- 0D tensor: a single number (scalar) → 5
- 1D tensor: a list of numbers (vector) → [1, 2, 3, 4, 5]
- 2D tensor: a grid of numbers (matrix) → [[1, 2], [3, 4]]
- 3D tensor: a cube of numbers → [[[1, 2], [3, 4]], [[5, 6], [7, 8]]]
- 4D tensor: a batch of images → shape (batch_size, channels, height, width)

In PyTorch, everything is a tensor. Your images are tensors. Your model weights are tensors. Your gradients are tensors.

## What is Autograd?

Autograd is PyTorch's automatic differentiation system. It automatically computes gradients (derivatives) for you.

Why do we need gradients? Because training a neural network means:
1. Make a prediction
2. Compute how wrong we were (loss)
3. Compute the gradient of the loss with respect to each weight
4. Update weights in the direction that reduces loss

Step 3 is where autograd comes in. Without it you'd have to manually compute derivatives for every operation, which is tedious and error-prone.

## How Autograd Works

When you create a tensor with requires_grad=True, PyTorch starts recording every operation you do with it. This creates a computational graph - a record of how the final result depends on the input.

When you call .backward() on the final result, PyTorch traverses this graph backwards and computes gradients using the chain rule.

Example: If you compute y = x^2 + 2x + 1, then:
- dy/dx = 2x + 2
- At x=3: dy/dx = 8

PyTorch computes this automatically without you writing any derivative code.

## Key Concepts

**Computational Graph**: A directed acyclic graph (DAG) where nodes are operations and edges are tensors. PyTorch builds this automatically as you run code.

**Backward Pass**: The process of computing gradients by traversing the graph backwards from the output to the inputs using the chain rule.

**Gradient Accumulation**: By default, gradients accumulate (add up) when you call .backward() multiple times. You must call .zero_grad() to reset them.

**no_grad() Context**: When making predictions (inference), you don't need gradients. Wrapping code in torch.no_grad() disables gradient tracking for speed and memory savings.

**Detach**: Breaks the computational graph. Useful when you want to use a tensor's values but don't want gradients to flow through it.`
  },
  {
    id: 'phase6-lesson2',
    phaseId: 6,
    title: 'Neural Networks with nn.Module',
    description: 'Build reusable neural network architectures',
    estimatedMinutes: 60,
    xpReward: 140,
    visualization: 'neural_network',
    content: `# Lesson 2: Neural Networks with nn.Module

## What is nn.Module?

nn.Module is PyTorch's base class for all neural network components. It's like a blueprint for building models.

Think of it like LEGO blocks:
- Each block (nn.Linear, nn.Conv2d, nn.ReLU) is a module
- You combine blocks to build a model
- The model itself is also a module
- You can nest modules inside modules

## Why Use nn.Module?

Without nn.Module you'd have to manually:
- Track all your weights and biases
- Move them to GPU/CPU
- Save and load them
- Compute gradients for each one

nn.Module handles all of this automatically.

## How to Build a Model

Every model has two methods:
1. **__init__()**: Define the layers
2. **forward()**: Define how data flows through the layers

Example:
\`\`\`python
class SimpleNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(784, 128)  # 784 inputs, 128 outputs
        self.fc2 = nn.Linear(128, 10)   # 128 inputs, 10 outputs
    
    def forward(self, x):
        x = self.fc1(x)
        x = torch.relu(x)
        x = self.fc2(x)
        return x
\`\`\`

## Common Layers

- **nn.Linear**: Fully connected layer (matrix multiplication + bias)
- **nn.Conv2d**: Convolutional layer (for images)
- **nn.ReLU**: Activation function (introduces non-linearity)
- **nn.Sigmoid**: Activation function (squashes to 0-1)
- **nn.Dropout**: Regularization (randomly zeros neurons during training)
- **nn.BatchNorm2d**: Normalizes layer inputs (stabilizes training)
- **nn.Embedding**: Converts integers to dense vectors (for text)

## Parameter Tracking

nn.Module automatically tracks all parameters (weights and biases). You can access them:
- model.parameters() - all parameters
- model.named_parameters() - parameters with names
- model.state_dict() - dictionary of all parameters

This is crucial for:
- Saving and loading models
- Passing parameters to optimizers
- Moving models to GPU

## Sequential vs Custom

**nn.Sequential**: For simple stacked layers
\`\`\`python
model = nn.Sequential(
    nn.Linear(784, 128),
    nn.ReLU(),
    nn.Linear(128, 10)
)
\`\`\`

**Custom Module**: For complex architectures with branches or skip connections
\`\`\`python
class ComplexNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.branch1 = nn.Linear(784, 64)
        self.branch2 = nn.Linear(784, 64)
        self.merge = nn.Linear(128, 10)
    
    def forward(self, x):
        b1 = self.branch1(x)
        b2 = self.branch2(x)
        merged = torch.cat([b1, b2], dim=1)
        return self.merge(merged)
\`\`\`

## Device Management

Move your model to GPU with .to(device):
\`\`\`python
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = model.to(device)
\`\`\`

Important: Your data must also be on the same device!
\`\`\`python
x = x.to(device)
y = y.to(device)
\`\`\`

## Saving and Loading

Save:
\`\`\`python
torch.save(model.state_dict(), 'model.pth')
\`\`\`

Load:
\`\`\`python
model = SimpleNet()
model.load_state_dict(torch.load('model.pth'))
\`\`\`

Always create the model architecture first, then load the weights into it.`
  },
  {
    id: 'phase6-lesson3',
    phaseId: 6,
    title: 'Convolutional Neural Networks (CNNs)',
    description: 'Master CNNs for image recognition',
    estimatedMinutes: 65,
    xpReward: 150,
    visualization: 'cnn_architecture',
    content: `# Lesson 3: Convolutional Neural Networks (CNNs)

## Why CNNs for Images?

Fully connected layers treat every pixel independently. For images this is wasteful because:
- Pixels close together are related (edges, textures)
- The same pattern (like a cat's ear) appears in different places
- Images have spatial structure

CNNs exploit this structure using convolution - a sliding window that looks at local neighborhoods.

## How Convolution Works

Imagine a 3×3 filter sliding over an image:
1. Place the filter on a 3×3 patch of the image
2. Multiply each filter weight by the corresponding pixel
3. Sum all the products
4. Move the filter one pixel to the right
5. Repeat until you've covered the whole image

This produces a feature map - a new image where each pixel represents "how much does this patch match the filter?"

## Key CNN Concepts

**Filters/Kernels**: Small matrices (3×3, 5×5) that detect patterns. A CNN learns what filters to use.

**Feature Maps**: The output of applying a filter to an image. Early filters detect edges, later filters detect shapes, even later filters detect objects.

**Pooling**: Reduces spatial dimensions by taking the max (or average) of a neighborhood. Reduces computation and makes the model more robust to small shifts.

**Stride**: How many pixels the filter moves each step. Stride=2 means skip every other pixel (reduces output size).

**Padding**: Add zeros around the image edges to preserve size. Without padding, the output is smaller than the input.

## CNN Architecture Pattern

1. **Convolutional blocks**: Conv2d → BatchNorm → ReLU → MaxPool
2. **Repeat**: Stack multiple blocks, each learning more complex features
3. **Flatten**: Convert 2D feature maps to 1D vector
4. **Fully connected**: Linear layers for classification

Example:
\`\`\`python
class SimpleCNN(nn.Module):
    def __init__(self):
        super().__init__()
        # Block 1: 1 channel → 32 channels
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3, padding=1)
        self.pool1 = nn.MaxPool2d(2)
        
        # Block 2: 32 channels → 64 channels
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.pool2 = nn.MaxPool2d(2)
        
        # Classifier
        self.fc1 = nn.Linear(64 * 7 * 7, 128)
        self.fc2 = nn.Linear(128, 10)
    
    def forward(self, x):
        x = self.pool1(torch.relu(self.conv1(x)))
        x = self.pool2(torch.relu(self.conv2(x)))
        x = x.view(x.size(0), -1)  # Flatten
        x = torch.relu(self.fc1(x))
        x = self.fc2(x)
        return x
\`\`\`

## Why CNNs Work

1. **Local connectivity**: Each neuron only looks at a small neighborhood
2. **Weight sharing**: The same filter is used across the entire image
3. **Hierarchical features**: Early layers learn simple patterns, later layers combine them into complex patterns

This is why CNNs are so efficient for images - they have far fewer parameters than fully connected networks.

## Batch Normalization

Normalizes layer inputs to have mean=0 and std=1. Benefits:
- Stabilizes training (allows higher learning rates)
- Reduces internal covariate shift
- Acts as regularization

Always use it in modern CNNs.

## Dropout

Randomly zeros out neurons during training (but not during inference). Benefits:
- Prevents co-adaptation (neurons learning to rely on each other)
- Acts as ensemble of models
- Reduces overfitting

Use it after fully connected layers, not after convolutions.`
  },
  {
    id: 'phase6-lesson4',
    phaseId: 6,
    title: 'Transfer Learning & Fine-Tuning',
    description: 'Leverage pre-trained models for new tasks',
    estimatedMinutes: 60,
    xpReward: 150,
    visualization: 'transfer_learning',
    content: `# Lesson 4: Transfer Learning & Fine-Tuning

## The Transfer Learning Revolution

Training a model from scratch requires:
- Massive amounts of data (millions of images)
- Massive compute (weeks on GPUs)
- Massive expertise (tuning hyperparameters)

Transfer learning changes this: Use a model trained on a huge dataset (ImageNet: 1.2M images) and adapt it to your task.

Why does this work? Because the early layers learn universal features:
- Layer 1: Edges (useful for any image task)
- Layer 2: Textures (useful for any image task)
- Layer 3: Shapes (useful for any image task)
- Layer 4: Object parts (useful for similar tasks)
- Layer 5: Specific objects (task-specific)

## Three Transfer Learning Strategies

### Strategy 1: Feature Extraction (Frozen Backbone)
Keep all pre-trained weights frozen. Only train the final classification layer.

Best for: Small datasets, very different from ImageNet

\`\`\`python
model = torchvision.models.resnet50(pretrained=True)

# Freeze all layers
for param in model.parameters():
    param.requires_grad = False

# Replace final layer
model.fc = nn.Linear(2048, num_classes)

# Only train the new layer
optimizer = optim.Adam(model.fc.parameters(), lr=0.001)
\`\`\`

### Strategy 2: Fine-tuning (Unfreeze Later Layers)
Freeze early layers, unfreeze later layers. Train with low learning rate.

Best for: Medium datasets, similar to ImageNet

\`\`\`python
model = torchvision.models.resnet50(pretrained=True)

# Freeze early layers
for param in model.layer1.parameters():
    param.requires_grad = False
for param in model.layer2.parameters():
    param.requires_grad = False

# Unfreeze later layers and final layer
# (layer3, layer4, fc are trainable)

# Use lower learning rate for pre-trained layers
optimizer = optim.Adam([
    {'params': model.layer3.parameters(), 'lr': 0.0001},
    {'params': model.layer4.parameters(), 'lr': 0.0001},
    {'params': model.fc.parameters(), 'lr': 0.001},
])
\`\`\`

### Strategy 3: Full Fine-tuning (Unfreeze Everything)
Train all layers with low learning rate.

Best for: Large datasets, very different from ImageNet

\`\`\`python
model = torchvision.models.resnet50(pretrained=True)

# All layers are trainable by default
optimizer = optim.Adam(model.parameters(), lr=0.0001)  # Low LR!
\`\`\`

## Popular Pre-trained Models

- **ResNet**: Residual networks, very popular, good accuracy/speed tradeoff
- **VGG**: Simple, interpretable, but slow
- **EfficientNet**: State-of-the-art accuracy/efficiency
- **MobileNet**: Designed for mobile devices, very fast
- **Vision Transformer (ViT)**: Transformer architecture for images, very powerful

All available in torchvision.models with pretrained=True.

## Differential Learning Rates

Different layers learn at different speeds. Use different learning rates:
- Early layers: Very low LR (0.00001) - preserve learned features
- Middle layers: Low LR (0.0001) - gentle adaptation
- Final layers: Higher LR (0.001) - learn task-specific features

This is called discriminative fine-tuning.

## When to Use Transfer Learning

✅ Use transfer learning when:
- You have limited data (< 10,000 images)
- Your task is similar to ImageNet (object recognition)
- You want to train quickly

❌ Don't use transfer learning when:
- You have massive data (> 1M images)
- Your task is very different (medical imaging, satellite imagery)
- You need maximum accuracy and have compute budget

## Key Insight

Transfer learning works because:
1. Early layers learn universal features (edges, textures)
2. These features are useful for almost any image task
3. You only need to adapt the final layers to your specific task
4. This requires far less data and compute than training from scratch

This is one of the most important techniques in modern deep learning.`
  },
  {
    id: 'phase6-lesson5',
    phaseId: 6,
    title: 'Regularization & Preventing Overfitting',
    description: 'Master techniques to prevent overfitting',
    estimatedMinutes: 55,
    xpReward: 130,
    visualization: 'overfitting_curves',
    content: `# Lesson 5: Regularization & Preventing Overfitting

## What is Overfitting?

Overfitting happens when your model memorizes the training data instead of learning general patterns.

Signs of overfitting:
- Training accuracy: 99%
- Validation accuracy: 70%
- Large gap between training and validation loss

The model is like a student who memorizes answers instead of understanding concepts. It does great on the training exam but fails on a different exam.

## Why Does Overfitting Happen?

1. **Model is too complex**: Too many parameters relative to data
2. **Training for too long**: Model keeps fitting to noise in training data
3. **Not enough data**: Model can memorize instead of generalize
4. **No regularization**: Nothing penalizes complex models

## Regularization Techniques

### 1. L1 and L2 Regularization

Add a penalty term to the loss function that penalizes large weights.

**L2 Regularization** (weight decay):
- Penalty = λ × (sum of squared weights)
- Encourages weights to be small
- Most common

**L1 Regularization**:
- Penalty = λ × (sum of absolute weights)
- Encourages weights to be exactly zero
- Creates sparse models

In PyTorch:
\`\`\`python
optimizer = optim.Adam(model.parameters(), lr=0.001, weight_decay=0.0001)
# weight_decay is L2 regularization
\`\`\`

### 2. Dropout

Randomly zeros out neurons during training (but not during inference).

How it works:
- During training: Randomly drop 50% of neurons
- During inference: Use all neurons (but scale by 0.5)
- Effect: Prevents co-adaptation, acts as ensemble

\`\`\`python
class Net(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(784, 256)
        self.dropout = nn.Dropout(0.5)  # Drop 50%
        self.fc2 = nn.Linear(256, 10)
    
    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = self.dropout(x)  # Only active during training
        x = self.fc2(x)
        return x
\`\`\`

### 3. Batch Normalization

Normalizes layer inputs to have mean=0 and std=1.

Benefits:
- Stabilizes training
- Allows higher learning rates
- Acts as regularization
- Reduces internal covariate shift

\`\`\`python
self.bn = nn.BatchNorm2d(64)
x = self.bn(x)
\`\`\`

### 4. Data Augmentation

Artificially increase training data by applying random transformations.

Examples:
- Random rotation
- Random crop
- Random flip
- Random brightness/contrast
- Random zoom

\`\`\`python
transform = transforms.Compose([
    transforms.RandomRotation(10),
    transforms.RandomCrop(28, padding=4),
    transforms.RandomHorizontalFlip(),
    transforms.ToTensor(),
])
\`\`\`

### 5. Early Stopping

Stop training when validation loss stops improving.

\`\`\`python
best_val_loss = float('inf')
patience = 10
patience_counter = 0

for epoch in range(100):
    train_loss = train_one_epoch()
    val_loss = validate()
    
    if val_loss < best_val_loss:
        best_val_loss = val_loss
        patience_counter = 0
        torch.save(model.state_dict(), 'best_model.pth')
    else:
        patience_counter += 1
    
    if patience_counter >= patience:
        print(f'Early stopping at epoch {epoch}')
        break
\`\`\`

### 6. Learning Rate Scheduling

Reduce learning rate as training progresses.

\`\`\`python
scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=10, gamma=0.1)

for epoch in range(100):
    train_one_epoch()
    scheduler.step()  # Reduce LR every 10 epochs
\`\`\`

## Diagnosing Overfitting

Plot training vs validation loss:

- **Both decreasing**: Good, model is learning
- **Training decreasing, validation increasing**: Overfitting, use regularization
- **Both increasing**: Underfitting, model is too simple or LR too high
- **Both flat**: Learning rate too low or model stuck

## Practical Strategy

1. Start simple: Small model, no regularization
2. If underfitting: Increase model size or training time
3. If overfitting: Add regularization (dropout, L2, data augmentation)
4. Use early stopping to find the sweet spot
5. Monitor both training and validation metrics`
  },
  {
    id: 'phase6-lesson6',
    phaseId: 6,
    title: 'Model Deployment & Production',
    description: 'Deploy models to production with FastAPI and Docker',
    estimatedMinutes: 60,
    xpReward: 150,
    visualization: 'deployment_pipeline',
    content: `# Lesson 6: Model Deployment & Production

## Why Deployment is Different

Training a model in a Jupyter notebook is one thing. Deploying it to production is completely different.

In production your model must:
- Handle thousands of requests per second
- Respond in milliseconds
- Never crash
- Be updated without downtime
- Be monitored for accuracy degradation

## The Deployment Pipeline

### Step 1: Export the Model

Save your trained model in a portable format:

\`\`\`python
# Save checkpoint
torch.save({
    'model_state_dict': model.state_dict(),
    'epoch': 10,
    'accuracy': 0.95,
}, 'model_checkpoint.pth')

# Export to TorchScript (portable, no Python needed)
scripted = torch.jit.script(model)
scripted.save('model.pt')
\`\`\`

### Step 2: Optimize for Inference

Reduce model size and latency:

\`\`\`python
# Quantization: Convert float32 to int8 (4x smaller, 2-4x faster)
quantized = torch.quantization.quantize_dynamic(
    model,
    qconfig_spec={nn.Linear},
    dtype=torch.qint8
)
\`\`\`

### Step 3: Wrap in an API

Use FastAPI to expose your model as a REST API:

\`\`\`python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()
model = torch.jit.load('model.pt')

class PredictRequest(BaseModel):
    pixels: list[float]  # 784 values for 28x28 image

@app.post('/predict')
def predict(req: PredictRequest):
    tensor = torch.tensor(req.pixels).view(1, 1, 28, 28)
    with torch.no_grad():
        output = model(tensor)
    class_id = output.argmax().item()
    return {'class_id': class_id}

@app.get('/health')
def health():
    return {'status': 'ok'}
\`\`\`

### Step 4: Containerize with Docker

Package everything (code, model, dependencies) into a container:

\`\`\`dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app.py .
COPY model.pt .

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`

### Step 5: Monitor in Production

Track model performance and data drift:

\`\`\`python
# Log every prediction
import logging
logger = logging.getLogger('predictions')

@app.post('/predict')
def predict(req: PredictRequest):
    # ... inference code ...
    logger.info(f'class={class_id}, confidence={confidence:.2f}')
    return result

# Analyze logs weekly to detect accuracy degradation
\`\`\`

## Key Concepts

**TorchScript**: Compiles your model to an intermediate representation that doesn't need Python. Portable and fast.

**Quantization**: Converts weights from float32 (4 bytes) to int8 (1 byte). Reduces size 4x and speeds up inference 2-4x with minimal accuracy loss.

**FastAPI**: Modern Python web framework. Automatically validates inputs, generates documentation, handles async requests.

**Docker**: Packages your code, model, and dependencies into a portable container. Runs the same on your laptop, a colleague's machine, and cloud servers.

**Data Drift**: The real-world input distribution changes after deployment, causing model accuracy to degrade silently. Must be monitored.

## Deployment Checklist

Before going live:
- ✅ Model is exported and tested
- ✅ API endpoints are validated
- ✅ Error handling works
- ✅ Docker image builds and runs
- ✅ Health check endpoint works
- ✅ Logging is set up
- ✅ Monitoring is configured`
  }
];

export default PHASE_6_LESSONS;
