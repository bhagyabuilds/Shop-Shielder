
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeProductCompliance = async (productInfo: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following product information for compliance with US regulations (Prop 65, FTC labeling, CPSC safety). Provide a list of risks and recommendations. Product info: ${productInfo}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          risks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                severity: { type: Type.STRING },
                message: { type: Type.STRING },
                recommendation: { type: Type.STRING }
              }
            }
          }
        },
        required: ["score", "risks"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generatePrivacyPolicy = async (storeDetails: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a professional, legal-compliant Privacy Policy for a US-based online store with the following details: ${storeDetails}. Ensure it covers CCPA and general US consumer privacy laws.`,
  });

  return response.text;
};
