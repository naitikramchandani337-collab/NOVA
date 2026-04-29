// src/config/phases.ts
import { Phase } from '@/types';
import { PHASE_3_LESSONS } from './phase3-lessons';
import { PHASE_4_LESSONS } from './phase4-lessons';
import { PHASE_5_LESSONS } from './phase5-lessons';
import { PHASE_6_LESSONS } from './phase6-lessons';
import { PHASE_7_LESSONS } from './phase7-lessons';
import { PHASE_8_LESSONS } from './phase8-lessons';
import { PHASE_9_LESSONS } from './phase9-lessons';
import { PHASE_10_LESSONS } from './phase10-lessons';
import { PHASE_11_LESSONS } from './phase11-lessons';
import { PHASE_12_LESSONS } from './phase12-lessons';

export const PHASES: Phase[] = [
  {
    id: 1,
    name: 'Python',
    title: 'Programming Foundation',
    description: 'Master Python basics and build your foundation',
    environment: 'ground',
    color: '#f59e0b',
    position: 0,
    rocketPart: 'body',
    unlockXP: 0,
    lessons: [
      {
        id: 'python-01',
        phaseId: 1,
        title: 'What is Programming?',
        description: 'Understand the fundamentals of programming and why it matters',
        content: `Programming is the ultimate art of communication between human intelligence and machine precision. Imagine you are the architect of a digital universe, where every command you write serves as a fundamental law of physics. Just as a chef follows a recipe or an engineer follows a blueprint, you will provide step-by-step instructions that the computer will execute with absolute loyalty and speed.

Every application you have ever used, every website you have ever navigated, and every sophisticated Artificial Intelligence system you have ever interacted with was forged through the power of programming. It is the language of creation in the modern era, allowing us to automate complex tasks and build tools that extend the capabilities of the human mind.

In this foundational module, you will embark on a journey to:
- Master the core philosophy of algorithmic thinking.
- Discover how silicon-based systems interpret human logic.
- Understand the critical role of clean code in developing Artificial General Intelligence.
- Experience firsthand why Python has become the 'Royal Language' of the AI revolution.

As you write your first lines of code, remember that you are not just typing characters on a screen; you are constructing the synaptic connections of a future digital mind. Programming is ubiquitous—from the smartphone in your pocket to the Mars Rovers exploring distant worlds. By learning this skill, you are gaining the power to command the most versatile tools ever created by humanity.`,
        codeExample: `# Your first Python program
print("Hello, NOVA!")
print("Welcome to AI Learning")

# Python reads and executes line by line
# This is a comment - Python ignores it
name = "Astronaut"
print(f"Welcome, {name}!")`,
        xpReward: 100,
        estimatedMinutes: 12,
        practiceExercises: [
          {
            id: 'ex-1-1',
            title: 'Print Your Name',
            description: 'Write a program that prints your name to the console',
            starterCode: `# Write your code here
print(`,
            solution: `print("Your Name Here")`,
            hints: [
              'Use the print() function',
              'Put your name inside quotes',
              'Don\'t forget the closing parenthesis'
            ]
          }
        ],
        quiz: [
          {
            id: 'q-1-1',
            question: 'What is programming?',
            options: [
              'Writing instructions for computers to follow',
              'Playing video games',
              'Using social media',
              'Watching tutorials'
            ],
            correctIndex: 0,
            explanation: 'Programming is the process of writing instructions (code) that computers execute. It\'s how we build software, apps, and AI systems.'
          },
          {
            id: 'q-1-2',
            question: 'Why is Python good for learning AI?',
            options: [
              'It\'s the easiest language to learn',
              'It has powerful AI libraries and readable syntax',
              'It\'s the only language that works',
              'It\'s the fastest language'
            ],
            correctIndex: 1,
            explanation: 'Python is popular for AI because it has excellent libraries like TensorFlow and PyTorch, and its syntax is readable and beginner-friendly.'
          }
        ],
        resources: [
          {
            title: 'Python Official Documentation',
            url: 'https://docs.python.org/3/'
          },
          {
            title: 'Why Python for AI?',
            url: 'https://www.python.org/'
          }
        ],
        keyTakeaways: [
          'Programming is giving step-by-step instructions to computers',
          'Python is ideal for AI and machine learning',
          'Code is read line by line, top to bottom',
          'Comments help explain what code does'
        ],
        realWorldConnections: [
          'Every app on your phone was built by programmers',
          'AI assistants like ChatGPT are built with Python',
          'Netflix recommendations use AI built with Python',
          'Self-driving cars use AI programmed in Python'
        ]
      },
      {
        id: 'python-02',
        phaseId: 1,
        title: 'Variables and Data Types',
        description: 'Learn how to store and work with different types of data',
        content: `In the world of programming, information is the most precious resource. Variables are the elegant containers that allow us to capture, store, and manipulate this information with precision. Think of a variable as a masterfully crafted box with a unique label; you can store anything from a simple number to a complex dataset inside, and retrieve it simply by calling its name.

In Python, the process of assigning data to a variable is fluid and intuitive. You do not need to explicitly declare the type of data—Python’s intelligent engine automatically detects whether you are handling a sequence of text, a precise mathematical decimal, or a simple True/False state. This flexibility is what makes Python the premier choice for rapidly prototyping advanced AI models.

To master data management, you must understand the primary 'Species' of data:
- **Integers (int)**: The backbone of logic, representing whole numbers without decimals.
- **Floating Point (float)**: The language of precision, used for complex calculations and decimal values.
- **Strings (str)**: The medium of communication, used to store text and character sequences.
- **Booleans (bool)**: The binary pulse of logic, representing either True or False.
- **Lists (list)**: The high-capacity vaults used to store collections of multiple items in a specific order.

Variables are not static entities; they are dynamic. A variable that holds a score in one moment can be updated to reflect a new achievement in the next. By mastering variables, you are learning how to build a dynamic memory for your digital systems, allowing them to remember user preferences, calculate rocket trajectories, or process neural network weights.`,
        codeExample: `# Creating variables with different data types
name = "NOVA"           # String (text)
level = 42              # Integer (whole number)
power = 99.5            # Float (decimal number)
is_active = True        # Boolean (True/False)
skills = ["Python", "Math", "AI"]  # List

# Using variables
print(f"Name: {name}")
print(f"Level: {level}")
print(f"Power: {power}")
print(f"Active: {is_active}")
print(f"Skills: {skills}")

# Changing variables
level = 43
power = 100.0
print(f"New level: {level}")`,
        xpReward: 150,
        estimatedMinutes: 18,
        practiceExercises: [
          {
            id: 'ex-2-1',
            title: 'Create Your Profile',
            description: 'Create variables for your name, age, and favorite programming language',
            starterCode: `# Create your profile variables
name = 
age = 
favorite_language = 

# Print them out
print(f"Name: {name}")`,
            solution: `name = "Your Name"
age = 25
favorite_language = "Python"

print(f"Name: {name}")
print(f"Age: {age}")
print(f"Favorite Language: {favorite_language}")`,
            hints: [
              'Use quotes for text (strings)',
              'Use numbers without quotes for integers',
              'Use f-strings to print variables'
            ]
          },
          {
            id: 'ex-2-2',
            title: 'Calculate XP',
            description: 'Create variables for base XP and bonus XP, then calculate total',
            starterCode: `# Calculate total XP
base_xp = 100
bonus_xp = 50

# Calculate and print total
total_xp = `,
            solution: `base_xp = 100
bonus_xp = 50
total_xp = base_xp + bonus_xp
print(f"Total XP: {total_xp}")`,
            hints: [
              'Use the + operator to add',
              'Store the result in a new variable',
              'Print the result'
            ]
          }
        ],
        quiz: [
          {
            id: 'q-2-1',
            question: 'What is a variable?',
            options: [
              'A container that stores data',
              'A type of computer',
              'A programming language',
              'A mathematical equation'
            ],
            correctIndex: 0,
            explanation: 'A variable is a named container that stores data. You can use the variable name to access the data later.'
          },
          {
            id: 'q-2-2',
            question: 'Which is a string data type?',
            options: [
              '42',
              '3.14',
              '"Hello"',
              'True'
            ],
            correctIndex: 2,
            explanation: 'Strings are text data enclosed in quotes. "Hello" is a string, while 42 is an integer and 3.14 is a float.'
          },
          {
            id: 'q-2-3',
            question: 'What does this code do? x = 10; y = 20; z = x + y',
            options: [
              'Creates three variables and adds x and y, storing result in z',
              'Creates three variables but doesn\'t do anything',
              'Prints the variables',
              'Deletes the variables'
            ],
            correctIndex: 0,
            explanation: 'This code creates three variables: x=10, y=20, and z=30 (the sum of x and y).'
          }
        ],
        resources: [
          {
            title: 'Python Data Types',
            url: 'https://docs.python.org/3/tutorial/introduction.html'
          },
          {
            title: 'Variables in Python',
            url: 'https://www.w3schools.com/python/python_variables.asp'
          }
        ],
        keyTakeaways: [
          'Variables store data with meaningful names',
          'Python has multiple data types: int, float, str, bool, list',
          'You can change variable values anytime',
          'Use f-strings to print variables in text'
        ],
        realWorldConnections: [
          'Game scores are stored in variables',
          'User profiles use variables for name, age, email',
          'AI models store weights and biases in variables',
          'Websites use variables to store user data'
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Math',
    title: 'Mathematical Foundation for AI',
    description: 'Master the mathematics that powers every AI system',
    environment: 'atmosphere',
    color: '#3b82f6',
    position: 1000,
    rocketPart: 'fuel_tank',
    visualization: 'gradient_descent',
    unlockXP: 500,
    lessons: [
      {
        id: 'math-001',
        phaseId: 2,
        title: 'Vectors: The Building Blocks of AI Data',
        description: 'Learn how vectors represent data and power AI systems',
        content: `In the grand architecture of Artificial Intelligence, vectors serve as the fundamental scaffolding. A vector is not merely a sequence of numbers; it is a precise mathematical representation of a point in space, a direction of movement, or a concentrated packet of information. Whether you are processing the pixels of a high-resolution image, the semantic meaning of a sentence, or the spectral frequencies of a sound, you are fundamentally interacting with vectors.

Imagine each piece of data as a coordinate in a multi-dimensional universe. A 2D vector [3, 4] defines a point on a flat plane, while a 3D vector [1, 2, 3] adds depth. In the realm of advanced AI, we often work in 'Hyperspaces' with hundreds or even thousands of dimensions—where a single word might be represented by a 512-dimensional vector capturing every nuance of its meaning.

The true power of vectors lies in our ability to perform mathematical operations that mirror human intuition. By converting raw data into this mathematical form, we can calculate the similarity between different concepts, combine multiple inputs into a single thought, and transform information as it flows through the layers of a neural network.

To command this digital universe, you must master the core operations:
- **Vector Addition**: The process of synthesizing two distinct data points into a single, unified representation.
- **Scalar Scaling**: Adjusting the intensity or importance of a data point by multiplying it by a constant factor.
- **Magnitude & Normalization**: Determining the 'Strength' of a signal and ensuring all data points are compared on a balanced, unit-length scale.
- **The Dot Product**: The heart of neural computation, measuring the alignment and interaction between two vectors. This is how neurons 'decide' which signals to pass forward.
- **Cosine Similarity**: The ultimate measure of conceptual proximity, allowing us to find similar movies, songs, or ideas by measuring the angle between their vector representations.

By the end of this module, you will not just understand vectors—you will learn to see the world through the lens of linear algebra, the foundational language of the AI age.`,
        codeExample: `import numpy as np

# Creating vectors
v1 = np.array([1, 2, 3])
v2 = np.array([4, 5, 6])

print("Vector 1:", v1)
print("Vector 2:", v2)

# Vector addition
v_sum = v1 + v2
print("Sum:", v_sum)  # [5, 7, 9]

# Scalar multiplication
v_scaled = v1 * 2
print("Scaled:", v_scaled)  # [2, 4, 6]

# Magnitude (length)
magnitude = np.linalg.norm(v1)
print("Magnitude of v1:", magnitude)

# Dot product
dot_product = np.dot(v1, v2)
print("Dot product:", dot_product)  # 1*4 + 2*5 + 3*6 = 32

# Cosine similarity
def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

similarity = cosine_similarity(v1, v2)
print("Cosine similarity:", similarity)

# Normalizing a vector (making it unit length)
v_normalized = v1 / np.linalg.norm(v1)
print("Normalized v1:", v_normalized)
print("Magnitude of normalized:", np.linalg.norm(v_normalized))`,
        visualization: 'tensor',
        xpReward: 100,
        estimatedMinutes: 45,
        practiceExercises: [
          {
            id: 'math-001-ex1',
            title: 'Create and Manipulate Vectors',
            description: 'Create vectors and perform basic operations using NumPy',
            starterCode: `import numpy as np

# Create two vectors
v1 = np.array([2, 3, 4])
v2 = np.array([1, 0, 2])

# TODO: Add the vectors
result_add = 

# TODO: Multiply v1 by 3
result_scale = 

# TODO: Calculate the dot product
result_dot = 

print("Addition:", result_add)
print("Scaling:", result_scale)
print("Dot product:", result_dot)`,
            solution: `import numpy as np

# Create two vectors
v1 = np.array([2, 3, 4])
v2 = np.array([1, 0, 2])

# Add the vectors
result_add = v1 + v2

# Multiply v1 by 3
result_scale = v1 * 3

# Calculate the dot product
result_dot = np.dot(v1, v2)

print("Addition:", result_add)  # [3, 3, 6]
print("Scaling:", result_scale)  # [6, 9, 12]
print("Dot product:", result_dot)  # 2*1 + 3*0 + 4*2 = 10`,
            hints: [
              'Use + operator for vector addition',
              'Use * operator for scalar multiplication',
              'Use np.dot() for dot product'
            ]
          },
          {
            id: 'math-001-ex2',
            title: 'Calculate Vector Magnitude',
            description: 'Calculate the magnitude (length) of vectors',
            starterCode: `import numpy as np

# Create a vector
v = np.array([3, 4])

# TODO: Calculate the magnitude using np.linalg.norm()
magnitude = 

# TODO: Create a normalized version (unit vector)
normalized = 

print("Vector:", v)
print("Magnitude:", magnitude)
print("Normalized:", normalized)
print("Magnitude of normalized:", np.linalg.norm(normalized))`,
            solution: `import numpy as np

# Create a vector
v = np.array([3, 4])

# Calculate the magnitude using np.linalg.norm()
magnitude = np.linalg.norm(v)

# Create a normalized version (unit vector)
normalized = v / magnitude

print("Vector:", v)
print("Magnitude:", magnitude)  # 5.0
print("Normalized:", normalized)  # [0.6, 0.8]
print("Magnitude of normalized:", np.linalg.norm(normalized))  # 1.0`,
            hints: [
              'np.linalg.norm() calculates the magnitude',
              'Divide the vector by its magnitude to normalize',
              'A normalized vector always has magnitude 1'
            ]
          },
          {
            id: 'math-001-ex3',
            title: 'Cosine Similarity for Recommendations',
            description: 'Use cosine similarity to find similar items',
            starterCode: `import numpy as np

# User preferences as vectors
user1 = np.array([5, 4, 2, 1])  # Ratings for 4 movies
user2 = np.array([5, 3, 2, 1])
user3 = np.array([1, 2, 4, 5])

def cosine_similarity(a, b):
    # TODO: Implement cosine similarity
    # Formula: dot(a,b) / (norm(a) * norm(b))
    pass

# TODO: Calculate similarity between user1 and user2
sim_1_2 = 

# TODO: Calculate similarity between user1 and user3
sim_1_3 = 

print(f"Similarity between user1 and user2: {sim_1_2:.3f}")
print(f"Similarity between user1 and user3: {sim_1_3:.3f}")
print("Which user has more similar preferences to user1?")`,
            solution: `import numpy as np

# User preferences as vectors
user1 = np.array([5, 4, 2, 1])  # Ratings for 4 movies
user2 = np.array([5, 3, 2, 1])
user3 = np.array([1, 2, 4, 5])

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# Calculate similarity between user1 and user2
sim_1_2 = cosine_similarity(user1, user2)

# Calculate similarity between user1 and user3
sim_1_3 = cosine_similarity(user1, user3)

print(f"Similarity between user1 and user2: {sim_1_2:.3f}")
print(f"Similarity between user1 and user3: {sim_1_3:.3f}")
print("User2 has more similar preferences to user1!")`,
            hints: [
              'Cosine similarity = dot product / (magnitude1 * magnitude2)',
              'Use np.dot() for dot product',
              'Use np.linalg.norm() for magnitude',
              'Higher similarity means more similar preferences'
            ]
          }
        ],
        quiz: [
          {
            id: 'math-001-q1',
            question: 'What is a vector in the context of AI?',
            options: [
              'A single number',
              'An ordered list of numbers representing data',
              'A type of neural network',
              'A programming language'
            ],
            correctIndex: 1,
            explanation: 'A vector is an ordered list of numbers. In AI, vectors represent data like images, text, and user preferences.'
          },
          {
            id: 'math-001-q2',
            question: 'What does the dot product of two vectors measure?',
            options: [
              'The length of a vector',
              'How similar two vectors are (their alignment)',
              'The angle between vectors in degrees',
              'The sum of all components'
            ],
            correctIndex: 1,
            explanation: 'The dot product measures how aligned two vectors are. A high dot product means vectors point in similar directions. This is fundamental to neural networks!'
          },
          {
            id: 'math-001-q3',
            question: 'What is cosine similarity used for?',
            options: [
              'Calculating vector length',
              'Adding vectors together',
              'Measuring similarity between vectors (values -1 to 1)',
              'Multiplying vectors'
            ],
            correctIndex: 2,
            explanation: 'Cosine similarity measures the angle between vectors, giving a value between -1 and 1. It\'s used in recommendation systems and text similarity.'
          },
          {
            id: 'math-001-q4',
            question: 'If you have vector [3, 4], what is its magnitude?',
            options: [
              '7',
              '5',
              '12',
              '1'
            ],
            correctIndex: 1,
            explanation: 'Magnitude = √(3² + 4²) = √(9 + 16) = √25 = 5. This is the Pythagorean theorem!'
          },
          {
            id: 'math-001-q5',
            question: 'What is a normalized vector?',
            options: [
              'A vector with all positive numbers',
              'A vector with magnitude 1 (unit vector)',
              'A vector with all equal components',
              'A vector with no zeros'
            ],
            correctIndex: 1,
            explanation: 'A normalized vector has magnitude 1. You create it by dividing a vector by its magnitude. Normalized vectors are useful for comparing directions without considering magnitude.'
          }
        ],
        resources: [
          {
            title: 'NumPy Documentation',
            url: 'https://numpy.org/doc/'
          },
          {
            title: 'Vector Math for Graphics',
            url: 'https://www.khanacademy.org/math/linear-algebra/vectors-and-spaces'
          },
          {
            title: 'Cosine Similarity Explained',
            url: 'https://en.wikipedia.org/wiki/Cosine_similarity'
          }
        ],
        keyTakeaways: [
          'Vectors are ordered lists of numbers representing data',
          'Vector operations (addition, scaling, dot product) are fundamental to AI',
          'Dot product measures vector alignment and is used in neural networks',
          'Cosine similarity measures angle between vectors for recommendations',
          'NumPy makes vector operations fast and efficient',
          'Normalized vectors have magnitude 1 and are useful for comparisons'
        ],
        realWorldConnections: [
          'Netflix uses vector similarity to recommend movies',
          'Google uses vectors to understand search queries',
          'Spotify uses vectors to find similar songs',
          'Image recognition converts images to vectors for comparison',
          'Language models convert words to vectors (embeddings)',
          'Recommendation systems use cosine similarity between user and item vectors'
        ]
      },
      {
        id: 'math-002',
        phaseId: 2,
        title: 'Matrices: The Powerhouse of AI Transformations',
        description: 'Master matrix operations that power neural networks',
        content: `If vectors are the individual signals of intelligence, then matrices are the powerful engines that transform and organize them into complex thoughts. A matrix is much more than a simple grid of numbers; it is a mathematical operator that can rotate, scale, and project information across different dimensions. In the architecture of a neural network, every layer is essentially a large-scale matrix operation, where incoming data is synthesized and passed forward to the next level of abstraction.

Imagine a single high-resolution image. It is not just a random collection of colors; it is a massive 2D matrix where each element represents the intensity of a pixel. When an AI system 'recognizes' an object, it is performing millions of matrix multiplications to extract patterns—lines, shapes, and textures—that eventually coalesce into a recognizable concept.

Mastering matrices allows you to command the true scale of AI computation:
- **Matrix Multiplication**: The fundamental act of transformation. This is how a neural network layer takes an input vector and projects it into a new space of features.
- **Batch Processing**: The ability to process hundreds of different inputs simultaneously. By stacking vectors into a single matrix, we can use the parallel power of modern GPUs to train models at superhuman speeds.
- **Transposition & Symmetry**: Understanding how to flip and reorient data to reveal hidden relationships and simplify complex calculations.
- **Identity & Inversion**: The mathematical 'resets' and 'reversals' that allow us to maintain data integrity and solve systems of equations that underpin modern machine learning.

Beyond the math, matrices represent the 'Memory' of a model. The weights of a neural network—the very things that are 'learned' during training—are stored within massive matrices. When you interact with a Large Language Model, you are effectively watching it perform a series of masterfully choreographed matrix operations to predict the next word in a sequence. By mastering this powerhouse of AI, you are gaining the ability to manipulate data at its most powerful scale.`,
        codeExample: `import numpy as np

# Creating matrices
A = np.array([[1, 2, 3],
              [4, 5, 6]])
B = np.array([[7, 8],
              [9, 10],
              [11, 12]])

print("Matrix A shape:", A.shape)  # (2, 3)
print("Matrix B shape:", B.shape)  # (3, 2)

# Matrix addition (same shape required)
C = np.array([[1, 2],
              [3, 4]])
D = np.array([[5, 6],
              [7, 8]])
sum_result = C + D
print("\\nMatrix addition:\\n", sum_result)

# Matrix multiplication
product = A @ B  # or np.dot(A, B)
print("\\nMatrix multiplication (A @ B):\\n", product)
print("Result shape:", product.shape)  # (2, 2)

# Transpose
A_transpose = A.T
print("\\nTranspose of A:\\n", A_transpose)
print("Transpose shape:", A_transpose.shape)  # (3, 2)

# Identity matrix
I = np.eye(3)
print("\\nIdentity matrix:\\n", I)

# Matrix with vector (neural network layer)
weights = np.array([[0.5, -0.3],
                    [0.2, 0.8],
                    [-0.1, 0.4]])
input_data = np.array([1, 2, 3])
output = input_data @ weights
print("\\nNeural network layer output:", output)

# Batch processing (multiple samples)
batch = np.array([[1, 2, 3],
                  [4, 5, 6],
                  [7, 8, 9]])
batch_output = batch @ weights
print("\\nBatch processing output:\\n", batch_output)`,
        visualization: 'neural_network',
        xpReward: 125,
        estimatedMinutes: 60,
        practiceExercises: [
          {
            id: 'math-002-ex1',
            title: 'Matrix Operations Basics',
            description: 'Perform basic matrix operations: addition, scaling, and multiplication',
            starterCode: `import numpy as np

# Create matrices
A = np.array([[1, 2],
              [3, 4]])
B = np.array([[5, 6],
              [7, 8]])

# TODO: Add matrices A and B
result_add = 

# TODO: Multiply matrix A by 2
result_scale = 

# TODO: Multiply A @ B (matrix multiplication)
result_mult = 

print("Addition:\\n", result_add)
print("\\nScaling:\\n", result_scale)
print("\\nMultiplication:\\n", result_mult)`,
            solution: `import numpy as np

# Create matrices
A = np.array([[1, 2],
              [3, 4]])
B = np.array([[5, 6],
              [7, 8]])

# Add matrices A and B
result_add = A + B

# Multiply matrix A by 2
result_scale = A * 2

# Multiply A @ B (matrix multiplication)
result_mult = A @ B

print("Addition:\\n", result_add)
print("\\nScaling:\\n", result_scale)
print("\\nMultiplication:\\n", result_mult)`,
            hints: [
              'Use + for matrix addition',
              'Use * for scalar multiplication',
              'Use @ for matrix multiplication',
              'Matrix multiplication requires compatible dimensions'
            ]
          },
          {
            id: 'math-002-ex2',
            title: 'Neural Network Layer',
            description: 'Implement a simple neural network layer using matrix multiplication',
            starterCode: `import numpy as np

# Input data (3 features)
input_data = np.array([1.0, 2.0, 3.0])

# Weight matrix (3 input features -> 2 output neurons)
weights = np.array([[0.5, -0.3],
                    [0.2, 0.8],
                    [-0.1, 0.4]])

# Bias vector (one bias per output neuron)
bias = np.array([0.1, -0.2])

# TODO: Calculate output = input @ weights + bias
output = 

print("Input shape:", input_data.shape)
print("Weights shape:", weights.shape)
print("Output shape:", output.shape)
print("Output:", output)`,
            solution: `import numpy as np

# Input data (3 features)
input_data = np.array([1.0, 2.0, 3.0])

# Weight matrix (3 input features -> 2 output neurons)
weights = np.array([[0.5, -0.3],
                    [0.2, 0.8],
                    [-0.1, 0.4]])

# Bias vector (one bias per output neuron)
bias = np.array([0.1, -0.2])

# Calculate output = input @ weights + bias
output = input_data @ weights + bias

print("Input shape:", input_data.shape)
print("Weights shape:", weights.shape)
print("Output shape:", output.shape)
print("Output:", output)`,
            hints: [
              'Use @ for matrix multiplication',
              'Add bias after matrix multiplication',
              'This is how neural network layers work!',
              'The output has shape (2,) - one value per output neuron'
            ]
          },
          {
            id: 'math-002-ex3',
            title: 'Batch Processing in Neural Networks',
            description: 'Process multiple samples at once using batch matrix multiplication',
            starterCode: `import numpy as np

# Batch of input data (4 samples, 3 features each)
batch_input = np.array([[1.0, 2.0, 3.0],
                        [2.0, 3.0, 4.0],
                        [3.0, 4.0, 5.0],
                        [4.0, 5.0, 6.0]])

# Weight matrix (3 input features -> 2 output neurons)
weights = np.array([[0.5, -0.3],
                    [0.2, 0.8],
                    [-0.1, 0.4]])

# Bias vector
bias = np.array([0.1, -0.2])

# TODO: Calculate batch output = batch_input @ weights + bias
batch_output = 

print("Batch input shape:", batch_input.shape)
print("Weights shape:", weights.shape)
print("Batch output shape:", batch_output.shape)
print("\\nBatch output:\\n", batch_output)`,
            solution: `import numpy as np

# Batch of input data (4 samples, 3 features each)
batch_input = np.array([[1.0, 2.0, 3.0],
                        [2.0, 3.0, 4.0],
                        [3.0, 4.0, 5.0],
                        [4.0, 5.0, 6.0]])

# Weight matrix (3 input features -> 2 output neurons)
weights = np.array([[0.5, -0.3],
                    [0.2, 0.8],
                    [-0.1, 0.4]])

# Bias vector
bias = np.array([0.1, -0.2])

# Calculate batch output = batch_input @ weights + bias
batch_output = batch_input @ weights + bias

print("Batch input shape:", batch_input.shape)
print("Weights shape:", weights.shape)
print("Batch output shape:", batch_output.shape)
print("\\nBatch output:\\n", batch_output)`,
            hints: [
              'Batch input shape is (4, 3) - 4 samples, 3 features',
              'Weights shape is (3, 2) - 3 inputs, 2 outputs',
              'Result shape is (4, 2) - 4 samples, 2 outputs',
              'This is how neural networks process multiple samples efficiently!'
            ]
          }
        ],
        quiz: [
          {
            id: 'math-002-q1',
            question: 'What is a matrix?',
            options: [
              'A single number',
              'A 2D grid of numbers arranged in rows and columns',
              'A type of neural network',
              'A vector with one element'
            ],
            correctIndex: 1,
            explanation: 'A matrix is a 2D grid of numbers. Matrices are fundamental to neural networks and data processing.'
          },
          {
            id: 'math-002-q2',
            question: 'What is the shape of the result when multiplying a (3×4) matrix by a (4×2) matrix?',
            options: [
              '(3×2)',
              '(4×4)',
              '(3×4)',
              'Cannot multiply'
            ],
            correctIndex: 0,
            explanation: 'When multiplying (m×n) × (n×p), the result is (m×p). So (3×4) × (4×2) = (3×2). The inner dimensions must match!'
          },
          {
            id: 'math-002-q3',
            question: 'How do neural networks use matrices?',
            options: [
              'They don\'t use matrices',
              'Each layer multiplies input by a weight matrix and adds bias',
              'Matrices are only used for visualization',
              'Matrices store the training data only'
            ],
            correctIndex: 1,
            explanation: 'Neural networks use matrix multiplication in every layer: output = input @ weights + bias. This is the core computation!'
          },
          {
            id: 'math-002-q4',
            question: 'What is the transpose of a matrix?',
            options: [
              'Multiplying all elements by -1',
              'Flipping rows and columns',
              'Adding all elements together',
              'Dividing by the number of elements'
            ],
            correctIndex: 1,
            explanation: 'The transpose flips rows and columns. If A is (m×n), then A^T is (n×m). It\'s useful for reshaping data and calculations.'
          },
          {
            id: 'math-002-q5',
            question: 'Why are GPUs important for neural networks?',
            options: [
              'They make code run faster in general',
              'They\'re optimized for matrix operations, which are the core of neural networks',
              'They\'re required to run Python',
              'They only work with certain programming languages'
            ],
            correctIndex: 1,
            explanation: 'GPUs are specialized for matrix operations. Since neural networks are built on matrix multiplication, GPUs can process them much faster than CPUs.'
          }
        ],
        resources: [
          {
            title: 'NumPy Matrix Operations',
            url: 'https://numpy.org/doc/stable/reference/routines.linalg.html'
          },
          {
            title: 'Linear Algebra Essentials',
            url: 'https://www.khanacademy.org/math/linear-algebra'
          },
          {
            title: 'Matrix Multiplication Explained',
            url: 'https://en.wikipedia.org/wiki/Matrix_multiplication'
          },
          {
            title: 'Neural Networks and Matrices',
            url: 'https://www.deeplearningbook.org/'
          }
        ],
        keyTakeaways: [
          'Matrices are 2D grids of numbers fundamental to AI',
          'Matrix multiplication is the core operation in neural networks',
          'Each neural network layer performs: output = input @ weights + bias',
          'Batch processing uses matrix multiplication to handle multiple samples efficiently',
          'Matrix dimensions must be compatible for multiplication',
          'GPUs are optimized for matrix operations, making them essential for deep learning',
          'Transpose flips rows and columns, useful for data reshaping'
        ],
        realWorldConnections: [
          'Every neural network layer uses matrix multiplication',
          'Images are matrices of pixel values processed by CNNs',
          'Transformers use matrix operations for attention mechanisms',
          'GPT and other language models rely on matrix operations',
          'Computer graphics use matrices for 3D transformations',
          'Recommendation systems use matrix factorization',
          'Data science uses matrices to store and process datasets'
        ]
      }
    ]
  },
  {
    id: 3,
    name: 'ML Basics',
    title: 'Machine Learning Fundamentals',
    description: 'Learn how machines learn from data',
    environment: 'clouds',
    color: '#10b981',
    position: 2000,
    rocketPart: 'engine',
    visualization: 'loss_curve',
    unlockXP: 1500,
    lessons: PHASE_3_LESSONS
  },
  {
    id: 4,
    name: 'Model Evaluation',
    title: 'Evaluation & Improvement',
    description: 'Master model evaluation and optimization',
    environment: 'high_sky',
    color: '#8b5cf6',
    position: 3000,
    rocketPart: 'brain_core',
    visualization: 'loss_curve',
    unlockXP: 3000,
    lessons: PHASE_4_LESSONS
  },
  {
    id: 5,
    name: 'Neural Networks',
    title: 'Neural Networks Fundamentals',
    description: 'Build and understand artificial neural networks',
    environment: 'moon',
    color: '#ec4899',
    position: 4000,
    rocketPart: 'power_systems',
    visualization: 'neural_network',
    unlockXP: 5000,
    lessons: PHASE_5_LESSONS
  },
  {
    id: 6,
    name: 'PyTorch',
    title: 'PyTorch & Deep Learning Framework',
    description: 'Master PyTorch for building AI systems',
    environment: 'asteroid',
    color: '#06b6d4',
    position: 5000,
    rocketPart: 'navigation_system',
    visualization: 'tensor',
    unlockXP: 7000,
    lessons: PHASE_6_LESSONS
  },
  {
    id: 7,
    name: 'CNNs',
    title: 'Convolutional Neural Networks',
    description: 'Master computer vision and image recognition',
    environment: 'planets',
    color: '#f97316',
    position: 6000,
    rocketPart: 'consciousness',
    visualization: 'cnn',
    unlockXP: 9000,
    lessons: PHASE_7_LESSONS
  },
  {
    id: 8,
    name: 'RNNs',
    title: 'Recurrent Networks & Sequences',
    description: 'Process sequential data and time series',
    environment: 'star',
    color: '#a855f7',
    position: 7000,
    rocketPart: 'payload',
    visualization: 'sequence',
    unlockXP: 11000,
    lessons: PHASE_8_LESSONS
  },
  {
    id: 9,
    name: 'Transformers',
    title: 'Transformers & Attention',
    description: 'Master the architecture powering modern Large Language Models',
    environment: 'nebula',
    color: '#14b8a6',
    position: 8000,
    rocketPart: 'boosters',
    visualization: 'attention',
    unlockXP: 13000,
    lessons: PHASE_9_LESSONS
  },
  {
    id: 10,
    name: 'Advanced Architectures',
    title: 'Generative AI & Beyond',
    description: 'Explore GANs, Diffusion models, and cutting-edge research',
    environment: 'galaxy',
    color: '#fbbf24',
    position: 9000,
    rocketPart: 'full_assembly',
    visualization: 'generative',
    unlockXP: 15000,
    lessons: PHASE_10_LESSONS
  },
  {
    id: 11,
    name: 'ML Engineering',
    title: 'Production & Deployment',
    description: 'Bridge the gap between models and real-world systems',
    environment: 'galaxy',
    color: '#ec4899',
    position: 10000,
    rocketPart: 'production_engine',
    visualization: 'deployment',
    unlockXP: 17000,
    lessons: PHASE_11_LESSONS
  },
  {
    id: 12,
    name: 'Capstone',
    title: 'Mission Launch',
    description: 'Build your final system and launch your AI rocket',
    environment: 'galaxy',
    color: '#8b5cf6',
    position: 11000,
    rocketPart: 'launch_systems',
    unlockXP: 19000,
    lessons: PHASE_12_LESSONS
  }
];
