
import { GoogleGenAI, Type } from "@google/genai";
import { isConfigured, API_KEY_VAL } from './supabase.ts';

/**
 * Gemini AI initialization.
 * Real API calls are gated by the `isConfigured` check to prevent crashes in preview.
 */
const ai = new GoogleGenAI({ apiKey: API_KEY_VAL || 'PREVIEW_MODE_KEY' });

const MOCK_PRODUCT_RISKS = {
  score: 64,
  risks: [
    { category: 'Medical Claims', severity: 'Critical', message: 'Product implies FDA approval for "healing" properties without clinical citations.', recommendation: 'Revise labeling to use cosmetic "improves appearance" language instead.' },
    { category: 'Safety Warnings', severity: 'Moderate', message: 'Small parts detected for age group 0-3 without mandatory choking hazard icons.', recommendation: 'Add standard CPSC choking hazard warning to product page.' }
  ]
};

export const analyzeProductCompliance = async (productInfo: string) => {
  if (!isConfigured) return MOCK_PRODUCT_RISKS;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Act as a senior FDA/FTC compliance officer. Analyze this product info for Prop 65, safety labeling, and deceptive marketing claims. Provide a score (0-100) and structured risks. Info: ${productInfo}`,
    config: {
      thinkingConfig: { thinkingBudget: 16384 },
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

  return JSON.parse(response.text || '{}');
};

export const analyzeAccessibilitySource = async (htmlSource: string) => {
  if (!isConfigured) return { score: 71, issues: [] };

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Act as a certified WCAG 2.1 Accessibility Auditor. Analyze the following HTML for Level A and AA violations. HTML: ${htmlSource}`,
    config: {
      thinkingConfig: { thinkingBudget: 16384 },
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
                element: { type: Type.STRING },
                level: { type: Type.STRING },
                severity: { type: Type.STRING },
                violation: { type: Type.STRING },
                fix: { type: Type.STRING }
              }
            }
          }
        },
        required: ["score", "issues"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generatePrivacyPolicy = async (storeDetails: string) => {
  if (!isConfigured) return "Preview Mode: Connect Gemini API to generate legal documents.";

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a high-fidelity, legally-aligned Privacy Policy for a US E-commerce store. Context: ${storeDetails}`,
    config: {
      thinkingConfig: { thinkingBudget: 4096 }
    }
  });

  return response.text || '';
};

export { ai };
