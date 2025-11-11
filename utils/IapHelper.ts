import * as SecureStore from 'expo-secure-store';
import type { PurchaseIOS } from 'expo-iap';

const STORAGE_KEY = 'fc_processed_lineages_v2';

/** In-memory lineage checkpoints */
type LineageCheckpoint = {
  lastDate: number;
  lastTxnId: string;
  lastProduct: string;
};
const processedLineages = new Map<string, LineageCheckpoint>();

/** Load persisted map from SecureStore */
export const loadProcessedLineages = async () => {
  try {
    const json = await SecureStore.getItemAsync(STORAGE_KEY);
    if (json) {
      const obj: Record<string, LineageCheckpoint> = JSON.parse(json);
      for (const [id, data] of Object.entries(obj)) {
        processedLineages.set(id, data);
      }
      console.log('[IAP] loaded lineage checkpoints:', processedLineages.size);
    }
  } catch (err) {
    console.warn('[IAP] failed to load lineage checkpoints', err);
  }
};

/** Persist map to SecureStore */
const saveProcessedLineages = async () => {
  try {
    const obj: Record<string, LineageCheckpoint> = {};
    processedLineages.forEach((v, k) => (obj[k] = v));
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(obj));
  } catch (err) {
    console.warn('[IAP] failed to save lineage checkpoints', err);
  }
};

/** Compute lineage ID (shared across renewals) */
const getLineageId = (p: PurchaseIOS) =>
  p.originalTransactionIdentifierIOS as string;

/** Determine if a purchase is new or changed */
export const isNewTransaction = (p: PurchaseIOS) => {
  const lineageId = getLineageId(p);
  const existing = processedLineages.get(lineageId);

  // Never seen before → definitely new
  if (!existing) return true;

  // New transaction ID (renewal, upgrade, restore, etc.)
  if (existing.lastTxnId !== p.transactionId) return true;

  // Product switched (upgrade/downgrade)
  if (existing.lastProduct !== p.productId) return true;

  // Date is newer (normal renewal)
  if (p.transactionDate > existing.lastDate) return true;

  // Otherwise, it's a duplicate replay
  return false;
};

/** Mark this transaction as processed and persist */
export const markTransactionProcessed = async (p: PurchaseIOS) => {
  const lineageId = getLineageId(p);
  processedLineages.set(lineageId, {
    lastDate: p.transactionDate,
    lastTxnId: p.transactionId,
    lastProduct: p.productId,
  });
  await saveProcessedLineages();
};

/** Small helper for console clarity */
export const logPurchaseSummary = (p: PurchaseIOS) => {
  const lineageId = getLineageId(p);
  const date = new Date(p.transactionDate).toLocaleString();
  console.log(
    `[IAP] ${p.productId} - txn ${p.transactionId} (${lineageId}) @ ${date}`
  );
};

// import * as SecureStore from 'expo-secure-store';
// import type { Purchase, PurchaseIOS } from 'expo-iap';
//
// // Storage key for persistence
// const STORAGE_KEY = 'fc_processed_lineages_v1';
//
// /** In-memory map used during runtime */
// const processedLineages = new Map<string, number>();
//
// /** Load persisted map from SecureStore */
// export const loadProcessedLineages = async () => {
//   try {
//     const json = await SecureStore.getItemAsync(STORAGE_KEY);
//     if (json) {
//       const obj = JSON.parse(json);
//       for (const [id, date] of Object.entries(obj)) {
//         processedLineages.set(id, date as number);
//       }
//       console.log('[IAP] loaded lineage checkpoints:', processedLineages.size);
//     }
//   } catch (err) {
//     console.warn('[IAP] failed to load lineage checkpoints', err);
//   }
// };
//
// /** Persist map to SecureStore */
// const saveProcessedLineages = async () => {
//   try {
//     const obj: Record<string, number> = {};
//     processedLineages.forEach((v, k) => (obj[k] = v));
//     await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(obj));
//   } catch (err) {
//     console.warn('[IAP] failed to save lineage checkpoints', err);
//   }
// };
//
// /** Compute lineage ID (shared across renewals) */
// const getLineageId = (p: PurchaseIOS) =>
//   p.originalTransactionIdentifierIOS as string;
//
// /** Determine if a purchase is newer than what we’ve already handled */
// export const isNewTransaction = (p: PurchaseIOS) => {
//   const lineageId = getLineageId(p);
//   const lastDate = processedLineages.get(lineageId);
//   return !lastDate || p.transactionDate > lastDate;
// };
//
// /** Mark this transaction as processed and persist */
// export const markTransactionProcessed = async (p: PurchaseIOS) => {
//   const lineageId = getLineageId(p);
//   processedLineages.set(lineageId, p.transactionDate);
//   await saveProcessedLineages();
// };
//
// /** Optional small helper for console clarity */
// export const logPurchaseSummary = (p: PurchaseIOS) => {
//   const lineageId = getLineageId(p);
//   const date = new Date(p.transactionDate).toLocaleString();
//   console.log(
//     `[IAP] ${p.productId} - txn ${p.transactionId} (${lineageId}) @ ${date}`
//   );
// };
