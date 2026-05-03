import { Lesson } from '@/types';

// Phase 4: Model Evaluation & Improvement - Complete Lessons
export const PHASE_4_INFO = {
  id: 4,
  title: 'Model Evaluation & Improvement',
  subtitle: 'From Training to Validation',
  description: 'Master model evaluation, validation, and hyperparameter tuning',
  icon: '📊',
  color: '#8b5cf6',
  estimatedHours: 5,
  totalXP: 700,
  difficulty: 'Intermediate',
  prerequisites: ['Phase 3: Machine Learning Basics'],
  lessons: 5,
};

export const PHASE_4_LESSONS: Lesson[] = [
  {
    id: 'eval-001',
    phaseId: 4,
    title: 'Overfitting & Underfitting',
    description: 'Understand the bias-variance tradeoff',
    estimatedMinutes: 50,
    xpReward: 125,
    visualization: 'bias_variance',
    content: `# Overfitting & Underfitting: The Bias-Variance Tradeoff

## What You'll Learn
- Understand overfitting and underfitting
- Learn the bias-variance tradeoff
- Recognize signs of each problem
- Know when to add/remove complexity

## The Core Problem

Every model makes two types of errors:

**BIAS**: Error from wrong assumptions
- Model is too simple
- Can't capture the true pattern
- Underfitting

**VARIANCE**: Error from sensitivity to training data
- Model is too complex
- Memorizes noise in training data
- Overfitting

## Underfitting (High Bias)

Model is too simple to learn the pattern.

Signs:
- Low training accuracy
- Low validation accuracy
- Training and validation curves both flat and high error
- Model doesn't improve with more data

Example: Using linear regression for non-linear data

Solutions:
- Use more complex model
- Add more features
- Train longer
- Reduce regularization

## Overfitting (High Variance)

Model memorizes training data instead of learning the pattern.

Signs:
- High training accuracy
- Low validation accuracy
- Large gap between training and validation curves
- Model performs well on training but poorly on new data

Example: Decision tree with unlimited depth

Solutions:
- Use simpler model
- Get more training data
- Use regularization (L1, L2, dropout)
- Early stopping
- Cross-validation

## The Bias-Variance Tradeoff

As model complexity increases:
- Bias decreases (model can fit more patterns)
- Variance increases (model becomes more sensitive to noise)

The sweet spot is where total error is minimized.

## Detecting the Problem

Compare training vs validation performance:

**Underfitting**: Both high error
- Training error: 20%
- Validation error: 22%
- Gap: Small

**Good fit**: Both low error, small gap
- Training error: 5%
- Validation error: 6%
- Gap: Small

**Overfitting**: Large gap
- Training error: 2%
- Validation error: 15%
- Gap: Large

## Learning Curves

Plot error vs training set size:

**Underfitting**: Both curves high and flat
**Overfitting**: Training curve low, validation curve high
**Good fit**: Both curves low and close together

## Key Takeaways
✓ Bias = underfitting (model too simple)
✓ Variance = overfitting (model too complex)
✓ Goal: Find the sweet spot
✓ Use validation set to detect overfitting
✓ Learning curves reveal the problem
✓ More data helps with overfitting
✓ Regularization reduces overfitting

## What's Next?
Next lesson: REGULARIZATION TECHNIQUES — Control model complexity! 🎯`
  },
  {
    id: 'eval-002',
    phaseId: 4,
    title: 'Regularization Techniques',
    description: 'Control model complexity and prevent overfitting',
    estimatedMinutes: 55,
    xpReward: 125,
    visualization: 'regularization_effect',
    content: `# Regularization Techniques: Controlling Model Complexity

## What You'll Learn
- L1 and L2 regularization
- Dropout for neural networks
- Early stopping
- Data augmentation
- When to use each technique

## Why Regularization?

Regularization adds a penalty for model complexity to the loss function.

Instead of minimizing just error:
Loss = Error

We minimize:
Loss = Error + λ × Complexity

Where λ (lambda) controls the regularization strength.

## L2 Regularization (Ridge)

Penalizes large weights.

Loss = MSE + λ × (sum of squared weights)

Effect:
- Shrinks weights toward zero
- Keeps all features but with smaller weights
- Smooth predictions

When to use:
- When all features might be useful
- Want to keep all features but reduce their impact
- Continuous output (regression)

## L1 Regularization (Lasso)

Penalizes absolute value of weights.

Loss = MSE + λ × (sum of absolute weights)

Effect:
- Forces some weights to exactly zero
- Performs feature selection
- Sparse model (fewer features)

When to use:
- When you want feature selection
- Have many irrelevant features
- Want interpretability

## Elastic Net

Combines L1 and L2.

Loss = MSE + λ1 × (sum of squared weights) + λ2 × (sum of absolute weights)

Best of both worlds:
- Feature selection like L1
- Stability like L2

## Dropout (Neural Networks)

Randomly deactivate neurons during training.

How it works:
1. During training: Randomly drop neurons with probability p
2. During inference: Use all neurons but scale by (1-p)

Effect:
- Prevents co-adaptation of neurons
- Ensemble effect (like training multiple models)
- Reduces overfitting

Typical dropout rates: 0.2 to 0.5

## Early Stopping

Stop training when validation error stops improving.

How it works:
1. Monitor validation error during training
2. If no improvement for N epochs, stop
3. Use best model (lowest validation error)

Effect:
- Prevents overfitting
- Saves training time
- Simple and effective

## Data Augmentation

Create more training data by transforming existing data.

Examples:
- Images: Rotate, flip, crop, zoom
- Text: Paraphrase, synonym replacement
- Audio: Add noise, change speed

Effect:
- More diverse training data
- Model learns robust features
- Reduces overfitting

## Regularization Strength (λ)

Too small λ: Regularization has no effect
Too large λ: Model becomes too simple

Finding the right λ:
- Use cross-validation
- Try different values
- Plot validation error vs λ
- Choose λ with lowest validation error

## Comparison

| Technique | Use Case | Effect |
|-----------|----------|--------|
| L2 | Keep all features | Shrinks weights |
| L1 | Feature selection | Zeros out weights |
| Dropout | Neural networks | Prevents co-adaptation |
| Early Stopping | Any model | Stops at right time |
| Data Aug | Limited data | More training data |

## Key Takeaways
✓ Regularization penalizes complexity
✓ L2 shrinks weights, L1 zeros them out
✓ Dropout randomly deactivates neurons
✓ Early stopping prevents overfitting
✓ Data augmentation creates more data
✓ Choose regularization strength via cross-validation
✓ Combine multiple techniques for best results

## What's Next?
Next lesson: CLASSIFICATION METRICS — Evaluate beyond accuracy! 📈`
  },
  {
    id: 'eval-003',
    phaseId: 4,
    title: 'Classification Metrics',
    description: 'Evaluate classification models beyond accuracy',
    estimatedMinutes: 50,
    xpReward: 125,
    visualization: 'confusion_matrix',
    content: `# Classification Metrics: Beyond Accuracy

## What You'll Learn
- Confusion matrix
- Precision, recall, F1-score
- ROC-AUC curves
- When to use each metric
- Handling imbalanced data

## The Problem with Accuracy

Accuracy = (Correct Predictions) / (Total Predictions)

Problem: Doesn't work well with imbalanced data.

Example: 99% of emails are not spam
- Dumb model: "Always predict not spam"
- Accuracy: 99%
- But it catches 0% of spam!

We need better metrics.

## Confusion Matrix

Shows all four outcomes:

\`\`\`
                Predicted
              Positive  Negative
Actual Pos    TP        FN
       Neg    FP        TN
\`\`\`

- TP (True Positive): Correctly predicted positive
- TN (True Negative): Correctly predicted negative
- FP (False Positive): Incorrectly predicted positive
- FN (False Negative): Incorrectly predicted negative

## Precision

Of all positive predictions, how many were correct?

Precision = TP / (TP + FP)

Use when: False positives are costly
- Email spam filter (don't want to block real emails)
- Medical diagnosis (don't want false alarms)

## Recall (Sensitivity)

Of all actual positives, how many did we catch?

Recall = TP / (TP + FN)

Use when: False negatives are costly
- Disease detection (don't want to miss cases)
- Fraud detection (don't want to miss fraud)

## F1-Score

Harmonic mean of precision and recall.

F1 = 2 × (Precision × Recall) / (Precision + Recall)

Use when: You care about both precision and recall
- Balanced metric
- Single number to optimize

## Specificity

Of all actual negatives, how many did we correctly identify?

Specificity = TN / (TN + FP)

Use when: False positives are costly

## ROC-AUC Curve

ROC = Receiver Operating Characteristic

Plots: True Positive Rate vs False Positive Rate

AUC = Area Under the Curve

Interpretation:
- AUC = 1.0: Perfect classifier
- AUC = 0.5: Random classifier
- AUC = 0.0: Worst classifier

Use when: Comparing models, threshold selection

## Precision-Recall Curve

Alternative to ROC, better for imbalanced data.

Plots: Precision vs Recall

Use when: Data is imbalanced

## Choosing the Right Metric

**Balanced data, equal costs**: Accuracy
**Imbalanced data**: F1-score, ROC-AUC
**False positives costly**: Precision
**False negatives costly**: Recall
**Comparing models**: ROC-AUC
**Imbalanced + need threshold**: Precision-Recall

## Imbalanced Data Strategies

1. **Resampling**
   - Oversample minority class
   - Undersample majority class
   - SMOTE (Synthetic Minority Oversampling)

2. **Class weights**
   - Give higher weight to minority class
   - Model learns to care more about minority

3. **Threshold adjustment**
   - Default threshold is 0.5
   - Adjust based on precision/recall needs

4. **Different metrics**
   - Use F1, ROC-AUC instead of accuracy

## Key Takeaways
✓ Accuracy fails on imbalanced data
✓ Confusion matrix shows all outcomes
✓ Precision: Of predictions, how many correct?
✓ Recall: Of actual positives, how many caught?
✓ F1-score: Balanced metric
✓ ROC-AUC: Good for comparing models
✓ Choose metric based on problem costs

## What's Next?
Next lesson: CROSS-VALIDATION — Robust model evaluation! ✅`
  },
  {
    id: 'eval-004',
    phaseId: 4,
    title: 'Cross-Validation',
    description: 'Robust model evaluation with k-fold cross-validation',
    estimatedMinutes: 50,
    xpReward: 125,
    visualization: 'kfold_split',
    content: `# Cross-Validation: Robust Model Evaluation

## What You'll Learn
- Why cross-validation matters
- K-fold cross-validation
- Stratified k-fold
- Time series cross-validation
- When to use each approach

## The Problem with Single Train-Test Split

One split can be lucky or unlucky:
- Lucky: Test set happens to be easy
- Unlucky: Test set happens to be hard

Result: Unreliable performance estimate

Solution: Use multiple splits and average results

## K-Fold Cross-Validation

Divide data into k equal parts (folds).

Process:
1. Split data into k folds
2. For each fold i:
   - Use fold i as test set
   - Use other k-1 folds as training set
   - Train model and evaluate
3. Average the k results

Result: More reliable performance estimate

Typical k values: 5 or 10

## Advantages

- Uses all data for training and testing
- More stable performance estimate
- Detects overfitting better
- Works with small datasets

## Disadvantages

- Slower (train k models instead of 1)
- More complex to implement
- Not suitable for time series

## Stratified K-Fold

For classification with imbalanced data.

Ensures each fold has similar class distribution.

Example: If data is 90% class A, 10% class B
- Each fold will be ~90% A, ~10% B
- Prevents unlucky splits

Use when: Classification with imbalanced classes

## Time Series Cross-Validation

For time series data, can't shuffle randomly.

Process:
1. Use earlier data for training
2. Use later data for testing
3. Move forward in time

Prevents data leakage from future to past.

## Leave-One-Out Cross-Validation (LOOCV)

Extreme case: k = number of samples

Process:
1. For each sample:
   - Use that sample as test set
   - Use all others as training set
   - Evaluate

Result: Most reliable but very slow

Use when: Very small dataset

## Nested Cross-Validation

For hyperparameter tuning:

Outer loop: Evaluate final model
Inner loop: Tune hyperparameters

Prevents overfitting to validation set.

## Cross-Validation for Regression

Same idea as classification:
- Split data into k folds
- Train k models
- Average metrics (MSE, R², etc.)

## Interpreting Results

After k-fold cross-validation, you get k scores.

Report:
- Mean score
- Standard deviation
- Min and max scores

Example:
- Fold 1: 0.92
- Fold 2: 0.89
- Fold 3: 0.91
- Fold 4: 0.88
- Fold 5: 0.90

Mean: 0.90 ± 0.015

## Key Takeaways
✓ Single split can be unreliable
✓ K-fold uses all data for training and testing
✓ Stratified k-fold for imbalanced data
✓ Time series k-fold for temporal data
✓ Report mean and std dev of scores
✓ More folds = more reliable but slower
✓ Use nested CV for hyperparameter tuning

## What's Next?
Next lesson: HYPERPARAMETER TUNING — Find the best model! 🎯`
  },
  {
    id: 'eval-005',
    phaseId: 4,
    title: 'Hyperparameter Tuning',
    description: 'Grid Search, Random Search, and Bayesian Optimization',
    estimatedMinutes: 55,
    xpReward: 150,
    content: `# Hyperparameter Tuning: Finding the Best Model

## What You'll Learn
- Difference between parameters and hyperparameters
- Grid Search
- Random Search
- Bayesian Optimization
- Avoid common tuning pitfalls

## Parameters vs Hyperparameters

**PARAMETERS**: Learned by the model during training
- Weights in neural networks
- Coefficients in regression

**HYPERPARAMETERS**: Set BEFORE training
- Learning rate
- Number of trees
- Max depth
- We need to TUNE these manually!

## Common Hyperparameters

**RANDOM FOREST**:
- n_estimators (number of trees)
- max_depth (tree depth)
- min_samples_split
- max_features

**NEURAL NETWORKS**:
- learning_rate
- batch_size
- number of layers
- neurons per layer
- dropout rate

**SVM**:
- C (regularization)
- kernel (rbf, linear, poly)
- gamma

## Grid Search

Try every combination in a predefined grid.

Process:
1. Define grid of hyperparameters
2. Try ALL combinations
3. Pick best performer

Example:
\`\`\`
n_estimators: [50, 100, 200]
max_depth:    [3, 5, 10]

Try all 9 combinations:
(50, 3), (50, 5), (50, 10)
(100, 3), (100, 5), (100, 10)
(200, 3), (200, 5), (200, 10)
\`\`\`

Pros:
✓ Exhaustive search
✓ Guaranteed to find best in grid
✓ Easy to parallelize

Cons:
✗ Very slow (exponential growth)
✗ Grid too coarse might miss optimal
✗ Wastes time on bad combinations

## Random Search

Sample random combinations from distributions.

Why it works:
- Not all hyperparameters are equally important
- Grid Search wastes time on unimportant ones
- Random Search explores important ones more

Often finds better solutions faster!

## Bayesian Optimization

Intelligently choose next hyperparameters based on past results.

Process:
1. Try a few random combinations
2. Build probability model of hyperparameter → score
3. Use model to predict promising regions
4. Try those next
5. Update model
6. Repeat

Each trial INFORMS the next!

## Comparison: Grid vs Random vs Bayesian

Grid Search:
- Exhaustive but slow
- Good for small search spaces

Random Search:
- Often more efficient than grid
- Good for high-dimensional spaces

Bayesian Optimization:
- Most efficient
- Learns from past trials
- Best for expensive evaluations

## Practical Tips

### Start Wide, Then Narrow

Stage 1: Wide exploration (Random Search)
- Try many different values
- Find promising region

Stage 2: Narrow focus (Grid Search)
- Fine-tune around best region
- Smaller search space

### Use Proper Pipelines

Prevent data leakage!

\`\`\`
Pipeline:
- Scaler (fit on train only)
- Model (fit on train only)
\`\`\`

### Log Scale for Learning Rate

Learning rates span many orders of magnitude:
- 0.0001, 0.001, 0.01, 0.1, 1.0

Use log scale, not linear!

## Common Pitfalls

❌ PITFALL 1: Over-tuning
- Trying too many combinations
- Overfits to validation set
- Use nested CV

❌ PITFALL 2: Wrong metric
- Using accuracy on imbalanced data
- Tune on F1, AUC, etc.

❌ PITFALL 3: Not using early stopping
- Training all models to completion
- Use early stopping in XGBoost/NN

❌ PITFALL 4: Ignoring computational cost
- Some parameters dramatically slow training
- Budget your search time

## Advanced: Halving Search

Successive halving — faster than traditional search

Process:
1. Start with small resource (few samples)
2. Eliminate poor configurations
3. Increase resource for remaining configs
4. Repeat

Much faster than grid or random search!

## Complete Tuning Workflow

1. **Baseline**: Train with default hyperparameters
2. **Wide Random Search**: Explore broadly
3. **Bayesian Refinement**: Fine-tune near best
4. **Final Evaluation**: Test on held-out set

## Key Takeaways
✓ Parameters learned, hyperparameters set manually
✓ Grid Search exhaustive but slow
✓ Random Search often more efficient
✓ Bayesian Optimization learns from past trials
✓ Start wide, then narrow
✓ Use pipelines to prevent data leakage
✓ Log scale for learning rates
✓ Budget your computation time

## 🎉 Phase 4 Complete!
You've mastered:
- ✅ Overfitting & Underfitting
- ✅ Regularization Techniques
- ✅ Classification Metrics
- ✅ Cross-Validation
- ✅ Hyperparameter Tuning

**You're ready for production ML!** 🚀`
  }
];
