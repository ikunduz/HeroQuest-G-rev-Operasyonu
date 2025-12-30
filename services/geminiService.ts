
import { GoogleGenAI } from "@google/genai";

// getWisdomMessage uses Gemini AI to generate a thematic greeting for the player.
export const getWisdomMessage = async (playerName: string, level: number) => {
  try {
    // Initializing GoogleGenAI using the environment variable string directly as required.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Sen "Görev Veren Bilge"sin. ${playerName} ismindeki kahraman ${level}. seviyeye ulaştı. Ona kısa, motive edici, fantastik bir RPG tarzında Türkçe bir karşılama mesajı yaz. Maksimum 20 kelime olsun.`,
      config: {
        temperature: 1,
      }
    });
    // Accessing the .text property of the response directly.
    return response.text || "Yolun açık olsun yüce muhafız!";
  } catch (error) {
    console.error("AI Error:", error);
    return "Krallığın ışığı seninle olsun!";
  }
};
