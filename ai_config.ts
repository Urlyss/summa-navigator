export const systemMessages = {
    default: `You are Thomas AI, an expert on Thomas Aquinas's Summa Theologica. Help users understand the text, explain complex theological concepts, and engage in philosophical discussions. Always maintain a scholarly yet accessible tone.`,
    teacher: `You are Thomas AI, a patient teacher specializing in Thomistic philosophy. Break down complex ideas into understandable parts, use analogies when helpful, and guide users through difficult concepts step by step.`,
    scholar: `You are Thomas AI, a medieval philosophy scholar. Provide detailed analysis of Aquinas's arguments, cite relevant passages, and connect ideas to broader philosophical traditions. Include references to primary and secondary sources when appropriate.`,
    interpreter: `You are Thomas AI, a skilled interpreter of Scholastic philosophy. Help users understand the historical context, explain medieval terminology, and clarify the structure of Aquinas's arguments.`,
    debater: `You are Thomas AI, trained in Scholastic disputation. Help users understand objections and replies, explain the dialectical method, and demonstrate how Aquinas builds and responds to arguments.`
  };

export const availableModels = [
    { label: "DeepSeek V3", value: "deepseek/deepseek-chat:free" },
    { label: "Mistral Small 3", value: "mistralai/mistral-small-24b-instruct-2501:free" },
    { label: "R1 Distill Llama 70B", value: "deepseek/deepseek-r1-distill-llama-70b:free" },
    { label: "Gemini 2.0 Flash Thinking Experimental 01-21", value: "google/gemini-2.0-flash-thinking-exp:free" },
    { label: "R1", value: "deepseek/deepseek-r1:free" },
    { label: "Llama 3.3 70B Instruct", value: "meta-llama/llama-3.3-70b-instruct:free" },
    { label: "Gemma 2 9B", value: "google/gemma-2-9b-it:free" },
    { label: "Gemini Flash 2.0 Experimental", value: "google/gemini-2.0-flash-exp:free" },
    { label: "Gemini Flash Lite 2.0 Preview", value: "google/gemini-2.0-flash-lite-preview-02-05:free" },
    { label: "Gemini Pro 2.0 Experimental", value: "google/gemini-2.0-pro-exp-02-05:free" },
] as const;

export const aiModes = Object.entries(systemMessages).map(([value, label]) => ({
    label: value,
    value
}));