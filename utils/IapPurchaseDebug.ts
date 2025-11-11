import type { Purchase } from 'expo-iap';
import { formatISO } from 'date-fns';

const redact = (v?: string | null, keep: number = 6) =>
  v ? `${v.slice(0, keep)}…${v.slice(-keep)}` : undefined;

const msToIso = (ms?: number | null) =>
  typeof ms === 'number' ? formatISO(new Date(ms)) : undefined;

export type SanitizedPurchase = {
  // cross-platform
  id: string;
  productId: string;
  platform: 'ios' | 'android';
  purchaseState: string;
  transactionId?: string;
  transactionDateMs?: number;
  transactionDateIso?: string;
  isAutoRenewing?: boolean;

  // iOS
  environmentIOS?: string;
  expirationDateMsIOS?: number;
  expirationDateIsoIOS?: string;
  originalTransactionIdentifierIOS?: string;
  appAccountTokenRedacted?: string;
  purchaseTokenRedacted?: string;
  reasonIOS?: string;
  renewalInfoIOS?: {
    willAutoRenew?: boolean;
    renewalDateMs?: number;
    renewalDateIso?: string;
    autoRenewPreference?: string;
    priceIncreaseStatus?: string;
    expirationReason?: string;
  };

  // Android (filled when platform === 'android')
  packageNameAndroid?: string;
  autoRenewingAndroid?: boolean;
  purchaseStateAndroid?: number;
  isAcknowledgedAndroid?: boolean;
};

export const toSanitizedPurchase = (p: Purchase): SanitizedPurchase => {
  const base: SanitizedPurchase = {
    id: p.id,
    productId: p.productId,
    platform: p.platform,
    purchaseState: p.purchaseState,
    transactionId: (p as any).transactionId ?? undefined,
    transactionDateMs: p.transactionDate,
    transactionDateIso: msToIso(p.transactionDate),
    isAutoRenewing: p.isAutoRenewing,
  };

  if (p.platform === 'ios') {
    const pi = p as any;
    base.environmentIOS = pi.environmentIOS;
    base.expirationDateMsIOS = pi.expirationDateIOS ?? undefined;
    base.expirationDateIsoIOS = msToIso(pi.expirationDateIOS);
    base.originalTransactionIdentifierIOS =
      pi.originalTransactionIdentifierIOS ?? undefined;
    base.appAccountTokenRedacted = redact(pi.appAccountToken);
    base.purchaseTokenRedacted = redact(p.purchaseToken);
    base.reasonIOS = pi.reasonIOS ?? pi.transactionReasonIOS ?? undefined;

    if (pi.renewalInfoIOS) {
      base.renewalInfoIOS = {
        willAutoRenew: pi.renewalInfoIOS.willAutoRenew,
        renewalDateMs: pi.renewalInfoIOS.renewalDate,
        renewalDateIso: msToIso(pi.renewalInfoIOS.renewalDate),
        autoRenewPreference: pi.renewalInfoIOS.autoRenewPreference,
        priceIncreaseStatus: pi.renewalInfoIOS.priceIncreaseStatus,
        expirationReason: pi.renewalInfoIOS.expirationReason,
      };
    }
  } else {
    const pa = p as any;
    base.packageNameAndroid = pa.packageNameAndroid ?? undefined;
    base.autoRenewingAndroid = pa.autoRenewingAndroid ?? undefined;
    base.purchaseStateAndroid = pa.purchaseStateAndroid ?? undefined;
    base.isAcknowledgedAndroid = pa.isAcknowledgedAndroid ?? undefined;
    base.purchaseTokenRedacted = redact(p.purchaseToken);
  }

  return base;
};
