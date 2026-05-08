import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);
  try {
    const models = await genAI.listModels();
    console.log('Available Models:');
    models.forEach(m => console.log(`- ${m.name} (${m.displayName})`));
  } catch (err) {
    console.error('Error listing models:', err.message);
  }
}

listModels();
