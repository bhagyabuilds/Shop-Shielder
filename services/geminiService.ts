import { GoogleGenAI, Type } from "@google/genai";
import { API_KEY_VAL } from './supabase.ts';

const ai = new GoogleGenAI({ apiKey: API_KEY_VAL });

export const analyzeProductCompliance = async (productInfo: string) => {
  if (!API_KEY_VAL) throw new Error("Compliance Engine: API_KEY missing from environment.");
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Act as a senior FDA/FTC compliance officer. Analyze this product info for Prop 65, safety labeling, and deceptive marketing claims. Provide a score (0-100) and structured risks. Info: ${productInfo}`,
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
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

export const analyzeAccessibilitySource = async (htmlSource: string) => {
  if (!API_KEY_VAL) throw new Error("Accessibility Engine: API_KEY missing from environment.");

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Act as a certified WCAG 2.1 Accessibility Auditor. Analyze the following HTML for Level A and AA violations. Categorize issues by element, severity, and provide the exact ARIA or HTML fix. HTML: ${htmlSource}`,
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          issues: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                element: { type: Type.STRING, description: "The specific HTML tag or selector" },
                level: { type: Type.STRING, description: "WCAG Level (A, AA, AAA)" },
                severity: { type: Type.STRING, description: "Critical, Moderate, Minor" },
                violation: { type: Type.STRING, description: "Description of the accessibility gap" },
                fix: { type: Type.STRING, description: "Step-by-step remediation instructions" }
              }
            }
          }
        },
        required: ["score", "issues"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generatePrivacyPolicy = async (storeDetails: string) => {
  if (!API_KEY_VAL) throw new Error("Policy Engine: API_KEY missing from environment.");

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a high-fidelity, legally-aligned Privacy Policy for a US E-commerce store. Focus on CCPA, CPRA, and GDPR reciprocity. Context: ${storeDetails}`,
    config: {
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });

  return response.text;
};

export { ai };
