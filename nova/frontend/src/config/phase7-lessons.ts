// Phase 7: Convolutional Neural Networks (CNNs) & Computer Vision
import { Lesson } from '../types';

export const PHASE_7_LESSONS: Lesson[] = [
  {
    id: 'cnn-001',
    phaseId: 7,
    title: 'How CNNs See Images',
    description: 'Understand the intuition behind convolutional layers',
    estimatedMinutes: 45,
    xpReward: 150,
    content: `Traditional neural networks often falter when tasked with processing visual information because they treat every individual pixel as an independent feature. This approach is highly inefficient; if an object shifts by just a single pixel, the entire input vector changes, forcing the network to relearn the object from scratch. Convolutional Neural Networks (CNNs) revolutionized computer vision by mimicking the human visual cortex—focusing on local patterns and spatial hierarchies rather than isolated data points.

At its core, a CNN does not 'look' at an image all at once. Instead, it scans the image using a series of sophisticated mathematical filters that detect specific features. This allows the network to understand that an eye is still an eye, regardless of whether it appears in the top-left or bottom-right of the frame. This property, known as translation invariance, is the secret behind the human-like accuracy of modern vision systems.

In this exploration of machine vision, we will uncover:
- **The Convolution Operation**: How kernels slide across images to extract meaningful feature maps.
- **Hierarchical Learning**: Why early layers see edges and lines, while deeper layers recognize complex objects like faces and vehicles.
- **Parameter Efficiency**: How CNNs use 'Weight Sharing' to process massive images with a fraction of the memory required by traditional networks.
- **Spatial Awareness**: Understanding how local receptive fields allow computers to grasp the 'Context' of a scene.

By mastering CNNs, you are learning how to give machines the gift of sight—allowing them to navigate the physical world, diagnose medical conditions from scans, and identify objects with superhuman precision.`,
    codeExample: `import torch
import torch.nn as nn

# A simple convolution layer
# in_channels=3 (RGB), out_channels=16 (16 filters), kernel_size=3
conv_layer = nn.Conv2d(in_channels=3, out_channels=16, kernel_size=3, stride=1, padding=1)

# Create a dummy image: (batch_size, channels, height, width)
input_image = torch.randn(1, 3, 64, 64)

# Apply convolution
output = conv_layer(input_image)

print(f"Input shape: {input_image.shape}")  # [1, 3, 64, 64]
print(f"Output shape: {output.shape}")      # [1, 16, 64, 64]`,
    practiceExercises: [
      {
        id: 'ex-cnn-1',
        title: 'Calculate Output Dimensions',
        description: 'Given an input size of 32x32, a 3x3 filter, stride 1, and no padding, what is the output size?',
        starterCode: `# The formula for output size is: O = (I - K + 2P) / S + 1
# I = Input size
# K = Kernel size
# P = Padding
# S = Stride

input_size = 32
kernel_size = 3
padding = 0
stride = 1

output_size = # TODO: Calculate this
print(output_size)`,
        solution: `input_size = 32
kernel_size = 3
padding = 0
stride = 1

output_size = (input_size - kernel_size + 2*padding) // stride + 1
print(output_size) # Should be 30`,
        hints: [
          'Substitute the numbers into the formula: (32 - 3 + 0) / 1 + 1',
          '32 - 3 is 29. 29 + 1 is 30.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q-cnn-1',
        question: 'What is the main benefit of "Parameter Sharing" in CNNs?',
        options: [
          'It makes the network deeper.',
          'It allows the same feature detector to be used across the whole image, reducing total weights.',
          'It prevents the model from using any memory.',
          'It makes the model only work on grayscale images.'
        ],
        correctIndex: 1,
        explanation: 'By using the same filter weights across the entire image, we significantly reduce the number of parameters compared to a fully connected network.'
      }
    ],
    keyTakeaways: [
      'CNNs use filters to extract local features from images.',
      'Convolutions provide translation invariance.',
      'Feature maps represent the presence of specific patterns in the input.'
    ],
    realWorldConnections: [
      'Facial recognition in your phone.',
      'Self-driving cars detecting pedestrians.',
      'Medical imaging for tumor detection.'
    ]
  },
  {
    id: 'cnn-002',
    phaseId: 7,
    title: 'Pooling & Strides',
    description: 'Learn how to downsample and simplify feature maps',
    estimatedMinutes: 30,
    xpReward: 100,
    content: `After extracting features with convolutions, we often want to make the representations smaller and more robust. This is where **Pooling** and **Strides** come in.

### Max Pooling

The most common pooling method. It slides a window (usually 2x2) over the feature map and keeps only the *maximum* value in that window.

*   **Reduces Resolution:** A 2x2 max pool with stride 2 cuts the height and width in half (reducing total pixels by 75%).
*   **Feature Robustness:** It keeps the most "intense" signal of a feature, making the model less sensitive to small distortions.

### Strides

Stride is the "step size" of the filter.
*   **Stride 1:** Move the window 1 pixel at a time.
*   **Stride 2:** Move the window 2 pixels at a time, effectively skipping pixels and reducing output size.

### Padding

Since filters have width, they "shrink" the image at the edges. **Padding** adds extra zero-pixels around the border so the output size matches the input size.`,
    codeExample: `import torch.nn as nn
import torch

# Max pooling layer with 2x2 window and stride 2
pool = nn.MaxPool2d(kernel_size=2, stride=2)

# Input feature map (1 channel, 4x4)
input_map = torch.tensor([[[
    [1.0, 2.0, 3.0, 4.0],
    [5.0, 6.0, 7.0, 8.0],
    [9.0, 1.0, 2.0, 3.0],
    [4.0, 5.0, 6.0, 7.0]
]]])

output = pool(input_map)
print("Pooled Output:\\n", output)
# The 6.0, 8.0, 9.0, 7.0 are the maximums of each 2x2 quadrant.`,
    quiz: [
      {
        id: 'q-pool-1',
        question: 'What is the primary effect of Max Pooling?',
        options: [
          'It increases the number of channels.',
          'It reduces the spatial dimensions (width/height) of the feature map.',
          'It reverses the colors of the image.',
          'It trains the weights of the filters.'
        ],
        correctIndex: 1,
        explanation: 'Max pooling downsamples the image, making it smaller and focusing on the most important features.'
      }
    ],
    keyTakeaways: [
      'Pooling reduces computational load by downsampling.',
      'Max pooling provides some invariance to small translations.',
      'Strides control how much the filter window jumps.'
    ]
  },
  {
    id: 'cnn-003',
    phaseId: 7,
    title: 'Famous CNN Architectures',
    description: 'Study the evolution from LeNet to ResNet',
    estimatedMinutes: 50,
    xpReward: 200,
    content: `CNNs have evolved rapidly since the late 90s. Understanding these architectures helps you choose the right model for your project.

### 1. LeNet-5 (1998)
The "grandfather" of CNNs. Used for digit recognition (MNIST).
*   Simple structure: Conv -> Pool -> Conv -> Pool -> Fully Connected.

### 2. AlexNet (2012)
The model that started the Deep Learning revolution.
*   Much deeper and wider than LeNet.
*   Introduced **ReLU** activation and **Dropout** to prevent overfitting.
*   Trained on GPUs (ImageNet competition).

### 3. VGGNet (2014)
Famous for its simplicity and uniform structure.
*   Used only 3x3 filters throughout the whole network.
*   Proved that depth (more layers) is key to performance.

### 4. ResNet (2015) - Residual Networks
The current standard.
*   Introduced **Skip Connections** (or Residual Connections).
*   Solved the "Vanishing Gradient" problem, allowing networks to be hundreds of layers deep (e.g., ResNet-152).
*   Instead of learning a direct mapping, it learns the "residual" (the difference).`,
    codeExample: `import torchvision.models as models

# Loading a pre-trained ResNet-18 model
resnet = models.resnet18(pretrained=True)

# Look at the first few layers
print(resnet.conv1)
print(resnet.layer1[0])`,
    keyTakeaways: [
      'AlexNet proved that deep CNNs on GPUs win at image recognition.',
      'VGG emphasized the power of uniform, repeated blocks.',
      'ResNet skip connections are essential for very deep networks.'
    ]
  }
];

export default PHASE_7_LESSONS;
