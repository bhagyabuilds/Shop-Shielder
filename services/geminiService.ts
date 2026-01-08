import { GoogleGenAI, Type } from "@google/genai";
import { isConfigured, API_KEY_VAL } from './supabase.ts';

/**
 * Gemini AI initialization.
 * We use a proxy or a dummy key if the real one isn't present to prevent build-time crashes,
 * but real API calls are gated by the `isConfigured` check.
 */
const safeApiKey = API_KEY_VAL || 'REPLACE_IN_NETLIFY_UI';
const ai = new GoogleGenAI({ apiKey: safeApiKey });

const MOCK_PRODUCT_RISKS = {
  score: 64,
  risks: [
    { category: 'Medical Claims', severity: 'Critical', message: 'Product implies FDA approval for "healing" properties without clinical citations.', recommendation: 'Revise labeling to use cosmetic "improves appearance" language instead.' },
    { category: 'Safety Warnings', severity: 'Moderate', message: 'Small parts detected for age group 0-3 without mandatory choking hazard icons.', recommendation: 'Add standard CPSC choking hazard warning to product page.' }
  ]
};

const MOCK_ACCESSIBILITY_ISSUES = {
  score: 71,
  issues: [
    { element: '<img class="hero">', level: 'AA', severity: 'Critical', violation: 'Missing alt-text for primary visual asset.', fix: 'Add alt="A merchant checking their store analytics" to the image tag.' },
    { element: '<button id="pay">', level: 'AA', severity: 'Moderate', violation: 'Button text has insufficient contrast ratio (2.1:1).', fix: 'Change text color to #FFFFFF and background to #059669.' }
  ]
};

const MOCK_POLICY = `PRIVACY POLICY (PREVIEW)

This is a simulated privacy policy generated in Developer Preview Mode. 

1. DATA COLLECTION
We collect your name, email, and store URL to provide compliance monitoring services.

2. USAGE
Your data is strictly used for compliance auditing.

3. YOUR RIGHTS
Under CCPA/GDPR, you have the right to request access to your data or its deletion.`;

export const analyzeProductCompliance = async (productInfo: string) => {
  if (!isConfigured || !API_KEY_VAL || API_KEY_VAL === 'REPLACE_IN_NETLIFY_UI') return MOCK_PRODUCT_RISKS;
  
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

  return JSON.parse(response.text || '{}');
};

export const analyzeAccessibilitySource = async (htmlSource: string) => {
  if (!isConfigured || !API_KEY_VAL || API_KEY_VAL === 'REPLACE_IN_NETLIFY_UI') return MOCK_ACCESSIBILITY_ISSUES;

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

  return JSON.parse(response.text || '{}');
};

export const generatePrivacyPolicy = async (storeDetails: string) => {
  if (!isConfigured || !API_KEY_VAL || API_KEY_VAL === 'REPLACE_IN_NETLIFY_UI') return MOCK_POLICY;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a high-fidelity, legally-aligned Privacy Policy for a US E-commerce store. Focus on CCPA, CPRA, and GDPR reciprocity. Context: ${storeDetails}`,
    config: {
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });

  return response.text || '';
};

export { ai };