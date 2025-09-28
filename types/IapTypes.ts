export type Entitlement = {
  active: boolean;
  sku: string;
  expiresAtISO?: string;
  environment: 'StoreKit' | 'Sandbox' | 'Production';
};

export type ValidateIOSPayload = {
  productId: string;
  transactionId: string;
  receiptData: string; // NEW: base64 app receipt
};

export type ValidateResponse = {
  ok: boolean;
  entitlement?: Entitlement;
  error?: string;
};
