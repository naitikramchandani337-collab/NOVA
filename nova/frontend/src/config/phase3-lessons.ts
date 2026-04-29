// Phase 3 ML Basics - Complete Lessons
// This file contains all 5 complete lessons for Phase 3

export const PHASE_3_LESSONS = [
  {
    id: 'ml-001',
    phaseId: 3,
    title: 'What is Machine Learning?',
    description: 'Understanding the ML revolution',
    estimatedMinutes: 50,
    xpReward: 125,
    content: `Machine Learning represents a profound shift in how we interact with technology. For decades, traditional programming required humans to laboriously write every single rule and condition for a computer to follow. This approach worked for simple tasks, but it failed when faced with the messy, unpredictable complexity of the real world—tasks like identifying a human face in a crowd or understanding the nuance of spoken language.

The Machine Learning revolution flipped this paradigm on its head. Instead of providing the rules, we now provide the data and the desired outcomes, allowing the computer to discover the underlying patterns for itself. In this new era, the machine is no longer just a calculator; it is a student that learns from experience, refining its internal logic with every new piece of information it processes.

In this introductory module, we will explore the three primary pillars of the ML universe:
- **Supervised Learning**: The most common form of ML, where a model is trained on labeled examples—much like a student learning from a textbook with an answer key.
- **Unsupervised Learning**: The art of discovery, where a model searches for hidden structures and clusters within raw, unlabeled data without any guidance.
- **Reinforcement Learning**: The path of trial and error, where an intelligent agent learns to navigate an environment by maximizing rewards and minimizing penalties, much like a pilot mastering a flight simulator.

By mastering Machine Learning, you are not just learning a new way to code; you are gaining the ability to build systems that can see, hear, and reason. You are moving from being a mere programmer to becoming a 'Digital Mentor,' guiding machines as they learn to solve problems that were previously thought to be impossible for silicon.`,
    codeExample: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score

# Create dataset
X = np.array([[1000, 2, 10], [1500, 3, 5], [2000, 3, 2], [2500, 4, 1], [3000, 4, 0]])
y = np.array([150, 200, 280, 350, 420])

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train
model = LinearRegression()
model.fit(X_train, y_train)

# Evaluate
r2 = r2_score(y_test, model.predict(X_test))
print(f"R² Score: {r2:.4f}")

# Predict new house
new_house = np.array([[1700, 3, 5]])
price = model.predict(new_house)
print(f"Predicted price: \${price[0]:.1f}k")`,
    practiceExercises: [
      {
        id: 'ml-001-ex1',
        title: 'Build Your First Model',
        description: 'Create and train a simple regression model',
        starterCode: `import numpy as np
from sklearn.linear_model import LinearRegression

X = np.array([[1, 2], [2, 4], [3, 6], [4, 8]])
y = np.array([3, 6, 9, 12])

# TODO: Create and train model
model = 

# TODO: Make prediction for [5, 10]
prediction = 

print("Prediction:", prediction)`,
        solution: `import numpy as np
from sklearn.linear_model import LinearRegression

X = np.array([[1, 2], [2, 4], [3, 6], [4, 8]])
y = np.array([3, 6, 9, 12])

model = LinearRegression()
model.fit(X, y)

prediction = model.predict([[5, 10]])
print("Prediction:", prediction)`,
        hints: ['Create LinearRegression()', 'Use fit() to train', 'Use predict() for new data']
      }
    ],
    quiz: [
      {
        id: 'ml-001-q1',
        question: 'What is Machine Learning?',
        options: ['Computers learning from data', 'Programming language', 'Type of AI', 'All of above'],
        correctIndex: 0,
        explanation: 'ML is computers learning patterns from data without explicit programming.',
        points: 20
      }
    ],
    keyTakeaways: ['ML learns from data', 'Supervised learning uses labeled examples', 'Always split train/test data'],
    realWorldConnections: ['Gmail spam filter', 'Netflix recommendations', 'Medical diagnosis'],
    resources: [{ title: 'Scikit-learn', url: 'https://scikit-learn.org/' }]
  },
  {
    id: 'ml-002',
    phaseId: 3,
    title: 'Loss Functions & Optimization',
    description: 'How models measure error and improve',
    estimatedMinutes: 55,
    xpReward: 125,
    visualization: 'loss_curve',
    content: `# Loss Functions: Teaching Machines to Measure Their Mistakes

Loss function = How we measure how wrong the model is

## Mean Squared Error (MSE)

Used for regression (predicting numbers):

\`\`\`
MSE = (1/n) × Σ(actual - predicted)²
\`\`\`

Why square the error?
1. Makes all errors positive
2. Penalizes large errors heavily
3. Mathematically smooth for optimization

## Cross-Entropy Loss

Used for classification (predicting categories):

\`\`\`
BCE = -(1/n) × Σ[y×log(p) + (1-y)×log(1-p)]
\`\`\`

Where y = actual label, p = predicted probability

## Choosing the Right Loss

- **Regression**: Mean Squared Error (MSE)
- **Binary Classification**: Binary Cross-Entropy
- **Multi-class**: Categorical Cross-Entropy

## Loss During Training

Loss should decrease as model learns. If it increases, learning rate might be too high.

## Key Takeaways

✓ Loss measures prediction error
✓ MSE for regression
✓ Cross-entropy for classification
✓ Lower loss = better model
✓ Loss drives the learning process`,
    codeExample: `import numpy as np

# MSE Example
actual = np.array([100, 200, 300])
predicted = np.array([110, 190, 320])

mse = np.mean((actual - predicted) ** 2)
print(f"MSE: {mse:.2f}")

# Binary Cross-Entropy Example
def binary_cross_entropy(y_true, y_pred):
    epsilon = 1e-7
    y_pred = np.clip(y_pred, epsilon, 1 - epsilon)
    return -np.mean(y_true * np.log(y_pred) + (1 - y_true) * np.log(1 - y_pred))

y_true = np.array([1, 0, 1, 0])
y_pred = np.array([0.9, 0.1, 0.85, 0.05])
bce = binary_cross_entropy(y_true, y_pred)
print(f"BCE: {bce:.4f}")`,
    practiceExercises: [
      {
        id: 'ml-002-ex1',
        title: 'Calculate MSE',
        description: 'Calculate Mean Squared Error for predictions',
        starterCode: `import numpy as np

actual = np.array([10, 20, 30, 40])
predicted = np.array([12, 18, 32, 38])

# TODO: Calculate MSE
mse = 

print(f"MSE: {mse:.2f}")`,
        solution: `import numpy as np

actual = np.array([10, 20, 30, 40])
predicted = np.array([12, 18, 32, 38])

mse = np.mean((actual - predicted) ** 2)
print(f"MSE: {mse:.2f}")`,
        hints: ['MSE = mean of squared errors', 'Use (actual - predicted) ** 2', 'Use np.mean()']
      }
    ],
    quiz: [
      {
        id: 'ml-002-q1',
        question: 'What loss function for regression?',
        options: ['Cross-Entropy', 'MSE', 'Hinge Loss', 'KL Divergence'],
        correctIndex: 1,
        explanation: 'MSE (Mean Squared Error) is standard for regression problems.',
        points: 20
      }
    ],
    keyTakeaways: ['Loss measures error', 'MSE for regression', 'Cross-entropy for classification'],
    realWorldConnections: ['Every ML model uses loss functions', 'Optimization minimizes loss'],
    resources: [{ title: 'Loss Functions', url: 'https://en.wikipedia.org/wiki/Loss_function' }]
  },
  {
    id: 'ml-003',
    phaseId: 3,
    title: 'Gradient Descent — The Learning Algorithm',
    description: 'Watch models optimize and improve in real-time',
    estimatedMinutes: 60,
    xpReward: 150,
    visualization: 'gradient_descent_3d',
    content: `Gradient Descent is the universal algorithm that powers nearly every achievement in modern Artificial Intelligence. It is the mathematical engine of learning, the process by which a model iteratively refines its understanding until it reaches a state of optimal performance. Without this algorithm, a neural network would be nothing more than a static collection of random numbers, unable to improve or adapt.

To understand the intuition behind this process, imagine you are standing on the peak of a mountain shrouded in thick, impenetrable fog. Your goal is to reach the valley floor—the point of minimum elevation. Since you cannot see the path ahead, you must rely on the feeling of the ground beneath your feet. You sense the slope, identify the direction of steepest descent, and take a small, careful step in that direction. By repeating this process thousands of times, you slowly but surely navigate your way to the bottom.

This 'Mountain Descent' is a perfect mirror for how AI learns:
- **The Loss Landscape**: The mountainous terrain represents the 'Error' of the model. High peaks correspond to large mistakes, while deep valleys represent precision.
- **The Gradient**: This is the 'Slope' of the terrain. By calculating the gradient, the model determines which direction will reduce its error most effectively.
- **The Learning Rate**: This is your 'Step Size.' Take steps that are too large, and you might overshoot the valley entirely; take steps that are too small, and the journey will take forever.
- **Convergence**: The moment you reach the valley floor and your error can no longer be reduced—this is when the model has truly 'Learned' its task.

By mastering Gradient Descent, you are learning the secret language of optimization. You are gaining the power to take any mathematical problem and force a computer to find the absolute best solution through sheer iterative persistence. This is the heartbeat of the AI revolution, the simple yet profound logic that allows machines to master games, translate languages, and even create art.`,
    codeExample: `import numpy as np

# Simple gradient descent example
X = np.array([1, 2, 3, 4, 5])
y = 2 * X + 1  # True: y = 2x + 1

# Initialize parameters
weight = 0.5
bias = 0.0
learning_rate = 0.01
epochs = 50

print("Training...")
for epoch in range(epochs):
    # Forward pass
    predictions = weight * X + bias
    
    # Calculate loss
    loss = np.mean((y - predictions) ** 2)
    
    # Calculate gradients
    errors = y - predictions
    weight_grad = -2 * np.mean(errors * X)
    bias_grad = -2 * np.mean(errors)
    
    # Update parameters
    weight -= learning_rate * weight_grad
    bias -= learning_rate * bias_grad
    
    if (epoch + 1) % 10 == 0:
        print(f"Epoch {epoch+1}: Loss = {loss:.6f}")

print(f"\\nLearned: weight={weight:.4f}, bias={bias:.4f}")
print(f"Target:  weight=2.0000, bias=1.0000")`,
    practiceExercises: [
      {
        id: 'ml-003-ex1',
        title: 'Implement Gradient Descent',
        description: 'Implement simple gradient descent from scratch',
        starterCode: `import numpy as np

X = np.array([1, 2, 3, 4])
y = np.array([2, 4, 6, 8])

weight = 0.1
learning_rate = 0.01

for epoch in range(20):
    # TODO: Calculate predictions
    predictions = 
    
    # TODO: Calculate loss
    loss = 
    
    # TODO: Calculate gradient
    gradient = 
    
    # TODO: Update weight
    weight = 
    
    if (epoch + 1) % 5 == 0:
        print(f"Epoch {epoch+1}: Loss = {loss:.4f}, Weight = {weight:.4f}")`,
        solution: `import numpy as np

X = np.array([1, 2, 3, 4])
y = np.array([2, 4, 6, 8])

weight = 0.1
learning_rate = 0.01

for epoch in range(20):
    predictions = weight * X
    loss = np.mean((y - predictions) ** 2)
    errors = y - predictions
    gradient = -2 * np.mean(errors * X)
    weight -= learning_rate * gradient
    
    if (epoch + 1) % 5 == 0:
        print(f"Epoch {epoch+1}: Loss = {loss:.4f}, Weight = {weight:.4f}")`,
        hints: ['predictions = weight * X', 'loss = mean squared error', 'gradient = -2 * mean(errors * X)', 'weight -= learning_rate * gradient']
      }
    ],
    quiz: [
      {
        id: 'ml-003-q1',
        question: 'What does gradient descent do?',
        options: ['Increases loss', 'Minimizes loss iteratively', 'Calculates accuracy', 'Splits data'],
        correctIndex: 1,
        explanation: 'Gradient descent minimizes loss by taking steps in the direction of steepest descent.',
        points: 20
      }
    ],
    keyTakeaways: ['Gradient descent minimizes loss', 'Learning rate controls step size', 'Mini-batch GD is most common'],
    realWorldConnections: ['Powers all neural network training', 'Used in every deep learning model'],
    resources: [{ title: 'Gradient Descent', url: 'https://en.wikipedia.org/wiki/Gradient_descent' }]
  },
  {
    id: 'ml-004',
    phaseId: 3,
    title: 'Training, Validation & Testing',
    description: 'The right way to evaluate machine learning models',
    estimatedMinutes: 50,
    xpReward: 125,
    content: `# Training, Validation & Testing: Avoiding the Biggest Mistake in ML

## The Three-Way Split

\`\`\`
TOTAL DATA (100%)
├─ TRAINING SET (60-70%)
│  └─ Model learns from this
├─ VALIDATION SET (15-20%)
│  └─ Tune hyperparameters, check for overfitting
└─ TEST SET (15-20%)
   └─ Final evaluation ONLY
\`\`\`

## Why THREE Splits?

**Just Train/Test (WRONG):**
- Train model on training set
- Test multiple models on test set
- Pick best performer
- Problem: You "learned" from test set!

**Train/Val/Test (CORRECT):**
- Train models on training set
- Evaluate on validation set
- Pick best model based on validation
- Test on test set ONCE
- Test set remains truly unseen!

## Overfitting: The #1 Problem

**Overfitting** = Model memorizes training data instead of learning patterns

Signs:
- Training error: VERY LOW
- Test error: HIGH (much worse than training)
- Model performs great on training, terrible on new data

## Detecting Overfitting

Compare train vs test error:
- **Underfitting**: Both high
- **Good fit**: Both low and similar
- **Overfitting**: Train low, test high

## Early Stopping

Stop training when validation performance plateaus:

\`\`\`python
best_loss = float('inf')
patience = 10
no_improvement = 0

for epoch in range(1000):
    train()
    if val_loss < best_loss:
        best_loss = val_loss
        no_improvement = 0
    else:
        no_improvement += 1
    
    if no_improvement >= patience:
        break  # Stop training
\`\`\`

## Key Takeaways

✓ Always split data 3 ways: train/val/test
✓ Training set for learning
✓ Validation set for tuning
✓ Test set for final evaluation ONCE
✓ Overfitting = great training, poor test
✓ Use validation to detect overfitting early
✓ Never make decisions based on test set!`,
    codeExample: `import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import Ridge

# Data
X = np.random.randn(1000, 10)
y = np.random.randn(1000)

# First split: remove test set (20%)
X_temp, X_test, y_temp, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Second split: create train (60%) and validation (20%)
X_train, X_val, y_train, y_val = train_test_split(X_temp, y_temp, test_size=0.25, random_state=42)

print(f"Training: {len(X_train)} ({len(X_train)/len(X)*100:.0f}%)")
print(f"Validation: {len(X_val)} ({len(X_val)/len(X)*100:.0f}%)")
print(f"Test: {len(X_test)} ({len(X_test)/len(X)*100:.0f}%)")

# Tune hyperparameters using validation set
best_alpha = None
best_val_score = -float('inf')

for alpha in [0.01, 0.1, 1.0, 10.0]:
    model = Ridge(alpha=alpha)
    model.fit(X_train, y_train)
    val_score = model.score(X_val, y_val)
    
    if val_score > best_val_score:
        best_val_score = val_score
        best_alpha = alpha

# Train final model and test ONCE
final_model = Ridge(alpha=best_alpha)
final_model.fit(X_train, y_train)
test_score = final_model.score(X_test, y_test)

print(f"\\nFinal test score: {test_score:.4f}")`,
    practiceExercises: [
      {
        id: 'ml-004-ex1',
        title: 'Proper Data Splitting',
        description: 'Split data correctly into train/val/test',
        starterCode: `import numpy as np
from sklearn.model_selection import train_test_split

X = np.random.randn(1000, 5)
y = np.random.randn(1000)

# TODO: First split - remove test set (20%)
X_temp, X_test, y_temp, y_test = 

# TODO: Second split - create train (60%) and val (20%)
X_train, X_val, y_train, y_val = 

print(f"Train: {len(X_train)}, Val: {len(X_val)}, Test: {len(X_test)}")`,
        solution: `import numpy as np
from sklearn.model_selection import train_test_split

X = np.random.randn(1000, 5)
y = np.random.randn(1000)

X_temp, X_test, y_temp, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
X_train, X_val, y_train, y_val = train_test_split(X_temp, y_temp, test_size=0.25, random_state=42)

print(f"Train: {len(X_train)}, Val: {len(X_val)}, Test: {len(X_test)}")`,
        hints: ['Use train_test_split twice', 'First split: 80/20', 'Second split: 75/25 of remaining']
      }
    ],
    quiz: [
      {
        id: 'ml-004-q1',
        question: 'Why split data three ways?',
        options: ['To save memory', 'Train learns, val tunes, test evaluates', 'No particular reason', 'To make code faster'],
        correctIndex: 1,
        explanation: 'Training set for learning, validation for tuning, test for final honest evaluation.',
        points: 20
      }
    ],
    keyTakeaways: ['Split 60/20/20', 'Never use test set for decisions', 'Validation detects overfitting'],
    realWorldConnections: ['Every production ML system uses this', 'Prevents overfitting disasters'],
    resources: [{ title: 'Cross-validation', url: 'https://scikit-learn.org/stable/modules/cross_validation.html' }]
  },
  {
    id: 'ml-005',
    phaseId: 3,
    title: 'Complete ML Project — Titanic Survival',
    description: 'Build, train, evaluate, and deploy a real ML system',
    estimatedMinutes: 70,
    xpReward: 175,
    project: true,
    content: `# Your First Complete Machine Learning Project

## Project: Titanic Survival Prediction

**Goal**: Predict who survived the Titanic disaster

**Dataset**: 891 passengers with features like age, sex, class, fare

**What You'll Learn**:
- Complete ML pipeline from start to finish
- Real data cleaning and preprocessing
- Feature engineering
- Model training and evaluation
- Making predictions
- Deploying a model

## The ML Pipeline

1. **Load & Explore**: Understand the data
2. **Analyze**: Find survival factors
3. **Engineer**: Create new features
4. **Preprocess**: Clean and normalize
5. **Split**: Train/val/test
6. **Train**: Multiple models
7. **Select**: Choose best model
8. **Evaluate**: Final test set evaluation
9. **Predict**: Make predictions on new data
10. **Deploy**: Save model for production

## Key Insights

**Survival Factors**:
- Gender: Women had 74% survival rate
- Class: 1st class 63%, 3rd class 24%
- Age: Children had higher survival
- Family: Being alone reduced survival

## Model Performance

- **Logistic Regression**: ~80% accuracy
- **Random Forest**: ~82% accuracy
- **Final Model**: Random Forest

## Deployment

Save model with joblib:

\`\`\`python
import joblib
joblib.dump(model, 'titanic_model.pkl')
joblib.dump(scaler, 'titanic_scaler.pkl')
\`\`\`

Load and use later:

\`\`\`python
model = joblib.load('titanic_model.pkl')
scaler = joblib.load('titanic_scaler.pkl')
predictions = model.predict(scaler.transform(new_data))
\`\`\`

## Key Takeaways

✓ Complete ML workflow from start to deployment
✓ Real data handling (messy, missing values)
✓ Feature engineering creates better models
✓ Proper evaluation prevents overfitting
✓ Model selection using validation data
✓ Production deployment with saved models
✓ Reproducibility through proper processes

## Congratulations!

You've completed Phase 3 — Machine Learning Basics!

**You can now**:
- Understand what ML is and when to use it
- Calculate and interpret loss functions
- Implement gradient descent from scratch
- Properly split and evaluate models
- Build complete end-to-end ML projects

**Your rocket just got its ENGINE! 🚀**`,
    codeExample: `import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# Create sample Titanic-like data
np.random.seed(42)
n = 891
data = pd.DataFrame({
    'Pclass': np.random.choice([1, 2, 3], n, p=[0.24, 0.21, 0.55]),
    'Sex': np.random.choice(['male', 'female'], n, p=[0.65, 0.35]),
    'Age': np.random.normal(29.7, 14.5, n).clip(0.42, 80),
    'Fare': np.random.lognormal(3.5, 1.0, n).clip(0, 512),
})

# Create survival based on realistic patterns
survival_prob = (
    (data['Sex'] == 'female').astype(int) * 0.7 +
    (data['Pclass'] == 1).astype(int) * 0.3 +
    np.random.randn(n) * 0.15
)
data['Survived'] = (survival_prob > 0.6).astype(int)

print("Dataset shape:", data.shape)
print("Survival rate:", data['Survived'].mean())

# Preprocessing
data['Sex_encoded'] = (data['Sex'] == 'male').astype(int)
X = data[['Pclass', 'Sex_encoded', 'Age', 'Fare']]
y = data['Survived']

# Split
X_temp, X_test, y_temp, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
X_train, X_val, y_train, y_val = train_test_split(X_temp, y_temp, test_size=0.25, random_state=42)

# Scale
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_val_scaled = scaler.transform(X_val)
X_test_scaled = scaler.transform(X_test)

# Train
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate
val_acc = model.score(X_val, y_val)
test_acc = model.score(X_test, y_test)

print(f"Validation accuracy: {val_acc:.2%}")
print(f"Test accuracy: {test_acc:.2%}")

# Predictions
y_pred = model.predict(X_test)
print("\\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=['Died', 'Survived']))

# Save model
import joblib
joblib.dump(model, 'titanic_model.pkl')
print("\\nModel saved!")`,
    practiceExercises: [
      {
        id: 'ml-005-ex1',
        title: 'Complete ML Pipeline',
        description: 'Build a complete ML pipeline from data to predictions',
        starterCode: `import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# Data
X = np.random.randn(200, 5)
y = np.random.randint(0, 2, 200)

# TODO: Split into train/val/test
X_train, X_test, y_train, y_test = 

# TODO: Train model
model = 

# TODO: Evaluate
accuracy = 

print(f"Accuracy: {accuracy:.2%}")`,
        solution: `import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

X = np.random.randn(200, 5)
y = np.random.randint(0, 2, 200)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = LogisticRegression()
model.fit(X_train, y_train)
accuracy = model.score(X_test, y_test)

print(f"Accuracy: {accuracy:.2%}")`,
        hints: ['Use train_test_split', 'Create LogisticRegression()', 'Use fit() and score()']
      }
    ],
    quiz: [
      {
        id: 'ml-005-q1',
        question: 'What is the complete ML pipeline?',
        options: [
          'Just train and test',
          'Load, explore, engineer, preprocess, split, train, evaluate, deploy',
          'Only prediction',
          'Data collection only'
        ],
        correctIndex: 1,
        explanation: 'Complete ML pipeline includes all steps from data loading to deployment.',
        points: 20
      }
    ],
    keyTakeaways: [
      'Complete ML workflow from start to deployment',
      'Feature engineering matters',
      'Proper evaluation prevents overfitting',
      'Save models for production use'
    ],
    realWorldConnections: [
      'Every production ML system follows this pipeline',
      'Kaggle competitions use this approach',
      'Industry standard practice'
    ],
    resources: [
      { title: 'Kaggle Titanic', url: 'https://www.kaggle.com/c/titanic' },
      { title: 'ML Best Practices', url: 'https://developers.google.com/machine-learning/guides/rules-of-ml' }
    ]
  }
];
