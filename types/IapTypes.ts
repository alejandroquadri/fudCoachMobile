export type Entitlement = {
  active: boolean;
  productId: string;
  originalTransactionId: string;
  expiresAtISO?: string;
  platform: 'ios';
  environment?: 'Production' | 'Sandbox'; // NEW
  grant?: {
    type: 'staff' | 'promo' | 'test'; // reason for the bypass
    untilISO?: string; // optional expiry for the bypass
  };
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
