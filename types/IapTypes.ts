export type Entitlement = {
  active: boolean; // same
  appAccountToken: string;
  productId: string; // CHANGED: was 'sku'
  expiresAtISO?: string; // same
  platform: 'ios'; // NEW: match server
  environment?: 'Production' | 'Sandbox'; // NEW: optional
};

export type ValidateIOSPayload = {
  transactionId: string; // REQUIRED
  originalTransactionId?: string; // optional, good for subs
  productId?: string; // optional (for logs/UI)
  appAccountToken?: string; // optional but recommended
};

export type ValidateResponse = {
  ok: boolean;
  entitlement?: Entitlement;
  error?: string;
};
