
/**
 * Shop Shielder Compliance Engine
 * Handles deterministic score generation and sync simulation
 */

export const generateStoreRiskScore = (url: string): number => {
  if (!url) return 64;
  // Simple deterministic hash to provide a unique but consistent score for the same URL
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = ((hash << 5) - hash) + url.charCodeAt(i);
    hash |= 0; 
  }
  // Map hash to a range between 42 and 78 (typical high-risk starting scores)
  const score = 42 + (Math.abs(hash) % 36);
  return score;
};

export const generateBadgeSerial = (url: string): string => {
  const currentYear = new Date().getFullYear();
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = ((hash << 5) - hash) + url.charCodeAt(i);
    hash |= 0;
  }
  const suffix = Math.abs(hash).toString(16).toUpperCase().substring(0, 8);
  return `SS-${currentYear}-${suffix}`;
};
