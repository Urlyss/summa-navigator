import { systemMessages } from '@/ai_config';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';
import { headers } from 'next/headers'

export const maxDuration = 30;

const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
    // Additional security checks
    const headersList = headers()
    const contentType = headersList.get('content-type')
    
    if (!contentType?.includes('application/json')) {
        return new Response('Invalid content type', { status: 415 })
    }

    try {
        const {messages, model, aiMode, articleContext} = await req.json()
        
        if (!messages || !Array.isArray(messages)) {
            return new Response('Invalid message format', { status: 400 })
        }

        const selectedModel = model || 'meta-llama/llama-3.3-70b-instruct:free'
        const selectedSystem = systemMessages[aiMode as keyof typeof systemMessages || 'default']
        
        const result = streamText({
            model: openrouter.chat(selectedModel),
            system: `${selectedSystem}\n${articleContext}`,
            messages
        });
        
        return result.toDataStreamResponse({sendReasoning: true});
    } catch (error) {
        return new Response('Internal Server Error', { status: 500 })
    }
}