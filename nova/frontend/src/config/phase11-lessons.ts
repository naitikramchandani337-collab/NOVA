// Phase 11: ML Engineering & Production
import { Lesson } from '../types';

export const PHASE_11_LESSONS: Lesson[] = [
  {
    id: 'eng-001',
    phaseId: 11,
    title: 'Deployment with FastAPI',
    description: 'Turn your model into a real-world API',
    estimatedMinutes: 50,
    xpReward: 200,
    content: `In the journey of an AI Engineer, building a high-performance model is only the first step. The true challenge lies in 'Deployment'—the critical process of taking a static model file and transforming it into a living, breathing service that can interact with the global internet. Without deployment, your most sophisticated neural networks are merely isolated research projects, unable to provide value to users or drive real-world applications.

The modern standard for this transformation is FastAPI. It is a high-performance, asynchronous framework that allows you to wrap your Python logic in a professional-grade API layer. By using FastAPI, you are ensuring that your model can handle thousands of simultaneous requests with minimal latency, providing the speed and reliability required for production-level Artificial Intelligence.

The life of a request in a production environment follows a carefully choreographed sequence known as the Inference Pipeline:
- **The Entry Point**: A user or application sends raw data—such as a sentence, an image, or a collection of sensor readings—to your server via a secure HTTP request.
- **Preprocessing & Validation**: Before the model can act, the incoming data must be cleaned, validated, and converted into the precise mathematical tensors that your neural network expects.
- **The Moment of Inference**: This is where the magic happens. Your model processes the input in 'Forward-Only' mode, calculating a prediction with maximum efficiency.
- **Postprocessing & Delivery**: Finally, the model's raw numerical output is translated back into a human-readable format—usually JSON—and sent back across the wire to the user.

By mastering deployment, you are bridging the gap between theory and reality. You are learning to build systems that don't just 'think' in a laboratory, but actually 'work' in the wild, powering the next generation of intelligent web and mobile experiences.`,
    codeExample: `from fastapi import FastAPI
import torch

app = FastAPI()

# Imagine this is your trained model
model = torch.nn.Linear(10, 1)

@app.post("/predict")
async def predict(data: list[float]):
    # 1. Preprocess
    input_tensor = torch.tensor([data])
    
    # 2. Inference (no gradients needed for deployment)
    with torch.no_grad():
        prediction = model(input_tensor)
    
    # 3. Postprocess and Respond
    return {"prediction": prediction.item()}`,
    keyTakeaways: [
      'Deployment makes AI accessible via APIs.',
      'FastAPI is a popular choice for high-performance ML serving.',
      'Inference requires careful preprocessing and postprocessing.'
    ]
  },
  {
    id: 'eng-002',
    phaseId: 11,
    title: 'MLOps & Monitoring',
    description: 'Keeping your model healthy in the wild',
    estimatedMinutes: 45,
    xpReward: 150,
    content: `Models in production can "rot" over time. **MLOps** (Machine Learning Operations) is the set of practices used to reliably deploy and maintain ML models.

### Key MLOps Challenges
1.  **Data Drift:** The data the model sees in the real world starts to look different from the data it was trained on (e.g., fashion trends change).
2.  **Model Decay:** Accuracy drops over time as the world changes.
3.  **Scalability:** Handling 1,000 requests per second requires load balancers and multiple servers.

### Monitoring
You must track:
*   **Latency:** How long does a prediction take?
*   **Throughput:** How many requests per minute?
*   **Prediction Distribution:** Is the model starting to predict "cat" for everything?`,
    keyTakeaways: [
      'MLOps ensures models stay accurate and reliable.',
      'Monitoring is critical to detect data drift.',
      'CI/CD for ML involves automated testing and retraining.'
    ],
    realWorldConnections: [
      'Netflix updating recommendations daily.',
      'Fraud detection systems adapting to new types of scams.',
      'ChatGPT receiving continuous updates and monitoring.'
    ]
  }
];

export default PHASE_11_LESSONS;
