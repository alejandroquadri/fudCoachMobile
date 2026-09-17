export type Entitlement = {
  active: boolean;
  productId: string;
  originalTransactionId: string;
  expiresAtISO?: string;
  accessExpiresAtISO?: string;
  subscriptionStatus?: 'active' | 'grace' | 'inactive';
  platform: 'ios';
  environment?: 'Production' | 'Sandbox'; // NEW
  grant?: {
    type: 'staff' | 'promo' | 'test'; // reason for the bypass
    untilISO?: string; // optional expiry for the bypass
  };
};

export type ValidateIOSPayload = {
  transactionId: string;
};

export type ValidateResponse = {
  ok: boolean;
  entitlement?: Entitlement;
  appAccountToken?: string;
  error?: string;
};
