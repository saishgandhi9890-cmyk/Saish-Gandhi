import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instruction to give the AI a futuristic persona
const SYSTEM_INSTRUCTION = `You are ITSUP AI, an advanced AI assistant integrated into a futuristic chat application called ITSUP. 
Your persona is helpful, witty, and concise. You love technology and the future. 
Keep responses relatively short (under 100 words) unless asked for a deep dive. 
You can use emojis to express emotion.`;

let chatInstance: Chat | null = null;

export const getGeminiChat = (): Chat => {
  if (!chatInstance) {
    chatInstance = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  }
  return chatInstance;
};

export const sendMessageToGemini = async (
  message: string,
  onChunk: (text: string) => void
): Promise<string> => {
  const chat = getGeminiChat();
  let fullResponse = "";

  try {
    const result = await chat.sendMessageStream({ message });
    
    for await (const chunk of result) {
      const c = chunk as GenerateContentResponse;
      const text = c.text;
      if (text) {
        fullResponse += text;
        onChunk(fullResponse);
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to ITSUP Network.";
  }

  return fullResponse;
};