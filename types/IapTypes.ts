export type Entitlement = {
  active: boolean;
  productId: string;
  originalTransactionId: string;
  expiresAtISO?: string;
  platform: 'ios';
  environment?: 'Production' | 'Sandbox'; // NEW
};

export type ValidateIOSPayload = {
  transactionId: string; // REQUIRED
  originalTransactionId?: string; // optional, good for subs
  productId?: string; // optional (for logs/UI)
};

export type ValidateResponse = {
  ok: boolean;
  entitlement?: Entitlement;
  error?: string;
};

export type SubscriptionStatus = {
  active: boolean;
  environment: 'PRODUCTION' | 'SANDBOX';
};
