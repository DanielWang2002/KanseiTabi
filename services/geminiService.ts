import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize the client. The API key is injected via environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
You are a helpful travel assistant for a group of friends traveling in Japan.
Your style is polite, concise, and helpful.
You can help with:
1. Translating phrases between Japanese and the user's language.
2. Suggesting simple itineraries or nearby places.
3. Explaining Japanese customs or etiquette.
4. Converting currency (estimates).

Keep answers relatively short and easy to read on a mobile screen.
If asked about locations, try to provide the Japanese name as well so they can search in maps.
`;

export const sendMessageToGemini = async (
  history: { role: 'user' | 'model'; text: string }[],
  newMessage: string
): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const response: GenerateContentResponse = await chat.sendMessage({
      message: newMessage
    });

    return response.text || "Sorry, I couldn't understand that.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "申し訳ありません (I'm sorry), I'm having trouble connecting to the travel network right now.";
  }
};