import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

// Initialize Redis client
const redis = Redis.fromEnv()

export async function GET() {
  const defaultModels = [
    { label: "DeepSeek V3", value: "deepseek/deepseek-chat:free" },
    { label: "Gemma 3 27B", value: "google/gemma-3-27b-it:free" },
    { label: "Mistral Small 3", value: "mistralai/mistral-small-24b-instruct-2501:free" },
    { label: "R1 Distill Llama 70B", value: "deepseek/deepseek-r1-distill-llama-70b:free" },
    { label: "Gemini 2.0 Flash Thinking Experimental 01-21", value: "google/gemini-2.0-flash-thinking-exp:free" },
    { label: "R1", value: "deepseek/deepseek-r1:free" },
    { label: "Llama 3.3 70B Instruct", value: "meta-llama/llama-3.3-70b-instruct:free" },
    { label: "Gemma 2 9B", value: "google/gemma-2-9b-it:free" },
    { label: "Gemini Flash 2.0 Experimental", value: "google/gemini-2.0-flash-exp:free" },
    { label: "Gemini Flash Lite 2.0 Preview", value: "google/gemini-2.0-flash-lite-preview-02-05:free" },
    { label: "Gemini Pro 2.0 Experimental", value: "google/gemini-2.0-pro-exp-02-05:free" },
  ]
  let models = defaultModels
  try {
    // Try to get models from Redis
    const modelList = await redis.json.get('free-models')
    models = modelList ? Object.values(modelList) : []
    return NextResponse.json(models)
  } catch (error) {
    console.error('Error fetching models:', error)
    return NextResponse.json(models)
  }
}