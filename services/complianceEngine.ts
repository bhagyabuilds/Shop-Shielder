
/**
 * Shop Shielder Compliance Engine
 * Handles deterministic score generation and unique identification
 */

/**
 * Normalizes a URL to a standard format (domain only)
 * Removes protocols, www, trailing slashes, and paths.
 */
export const normalizeStoreUrl = (url: string): string => {
  if (!url) return '';
  return url
    .toLowerCase()
    .trim()
    .replace(/^(https?:\/\/)?(www\.)?/, '')
    .split('/')[0]
    .split('?')[0];
};

/**
 * Generates a pseudo-random value between 0 and 1 based on a numeric seed
 */
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

/**
 * Produces a compliance score.
 * If isShielded is true, it returns a "Protected" score (98-100).
 * Otherwise, it returns the raw industry risk (50-95).
 */
export const generateStoreRiskScore = (url: string, isShielded: boolean = false): number => {
  if (!url) return 72;
  
  const cleanUrl = normalizeStoreUrl(url);
  
  if (isShielded) {
    let shieldSeed = 0;
    for (let i = 0; i < cleanUrl.length; i++) shieldSeed += cleanUrl.charCodeAt(i);
    return 98 + Math.floor(seededRandom(shieldSeed) * 3);
  }

  const highRiskKeywords = ['cbd', 'supplement', 'health', 'medical', 'tobacco', 'toy'];
  const isHighRiskVertical = highRiskKeywords.some(keyword => cleanUrl.includes(keyword));

  let seed = 0;
  for (let i = 0; i < cleanUrl.length; i++) {
    seed = ((seed << 5) - seed) + cleanUrl.charCodeAt(i);
    seed |= 0;
  }

  const f1 = seededRandom(seed + 1.33);
  const f2 = seededRandom(seed + 2.66);
  const f3 = seededRandom(seed + 3.99);
  const combinedFactor = (f1 * 0.5) + (f2 * 0.3) + (f3 * 0.2);
  
  const minScore = 50;
  const maxScore = 95;
  const range = maxScore - minScore;
  
  let score = minScore + Math.floor(combinedFactor * (range + 1));
  
  if (isHighRiskVertical) {
    score = Math.floor(score * 1.2);
  }
  
  return Math.min(95, Math.max(minScore, score));
};

/**
 * Generates a unique trust badge serial number based on the store URL
 */
export const generateBadgeSerial = (url: string): string => {
  if (!url) return `SS-2026-OFFLINE`;
  const cleanUrl = normalizeStoreUrl(url);
  const currentYear = new Date().getFullYear();
  let hash = 0;
  for (let i = 0; i < cleanUrl.length; i++) {
    hash = ((hash << 5) - hash) + cleanUrl.charCodeAt(i);
    hash |= 0;
  }
  const suffix = Math.abs(hash).toString(16).toUpperCase().substring(0, 8);
  return `SS-${currentYear}-${suffix}`;
};
