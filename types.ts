
export interface ComplianceScore {
  overall: number;
  privacy: number;
  accessibility: number;
  safety: number;
  policies: number;
}

export interface SyncStatus {
  lastSync: string;
  currentVersion: string;
  isAutoSyncEnabled: boolean;
  status: 'optimal' | 'syncing' | 'update_available';
}

export interface RiskItem {
  id: string;
  category: 'Privacy' | 'Accessibility' | 'Product Safety' | 'Policies' | 'Security';
  severity: 'high' | 'medium' | 'low';
  message: string;
  recommendation: string;
}

export enum SubscriptionPlan {
  STANDARD = 'STANDARD',
  CUSTOM = 'CUSTOM'
}

export enum BillingInterval {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY'
}

export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  storeUrl: string;
  storeName: string;
  onboarded: boolean;
  isPaid: boolean;
  plan?: SubscriptionPlan;
  interval?: BillingInterval;
}
