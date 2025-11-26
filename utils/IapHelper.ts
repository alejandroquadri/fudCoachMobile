import * as SecureStore from 'expo-secure-store';
import type { PurchaseIOS } from 'expo-iap';
import { differenceInHours } from 'date-fns';

const STORAGE_KEY = 'fc_processed_lineages_v2';

const LAST_CHECK_KEY = 'fc_last_sub_check_iso';
// const MIN_HOURS_BETWEEN_CHECKS = 0;
const MIN_HOURS_BETWEEN_CHECKS = 12;

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
      processedLineages.forEach(lineage => console.log(lineage));
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
const getLineageOriginalId = (p: PurchaseIOS) =>
  p.originalTransactionIdentifierIOS as string;

/** Determine if a purchase is new or changed */
export const isNewTransaction = (p: PurchaseIOS) => {
  const lineageOriginalId = getLineageOriginalId(p);
  // chequeo si ya existe la txOriginal
  const existing = processedLineages.get(lineageOriginalId);

  // Si la txOriginal es nueva, entonces definitivamente es nueva la tx
  if (!existing) {
    console.log('[IAP] tx Original nueva');
    return true;
  }
  // Si pertenece a la misma txOriginal pero es distinta a la ultima tx es nueva
  if (existing.lastTxnId !== p.transactionId) {
    console.log('[IAP] misma tx original, pero tx con numero distinto');
    return true;
  }

  // Si el producto es distinto entonces tambien tiene que ser nueva
  if (existing.lastProduct !== p.productId) {
    console.log('[IAP] misma tx original, misma tx, pero suscripcion distinta');
    return true;
  }

  // La fecha es nueva, puede ser una renovacion
  if (p.transactionDate > existing.lastDate) {
    console.log(
      '[IAP] unica dif es que es otra fecha, tiene que ser una renovacion'
    );
    return true;
  }

  // si no es nada de esto, tiene que ser duplicada
  return false;
};

/** Mark this transaction as processed and persist */
export const markTransactionProcessed = async (p: PurchaseIOS) => {
  const lineageId = getLineageOriginalId(p);
  processedLineages.set(lineageId, {
    lastDate: p.transactionDate,
    lastTxnId: p.transactionId,
    lastProduct: p.productId,
  });
  await saveProcessedLineages();
};

/** Small helper for console clarity */
export const logPurchaseSummary = (p: PurchaseIOS) => {
  const lineageId = getLineageOriginalId(p);
  const date = new Date(p.transactionDate).toLocaleString();
  console.log(
    `[IAP] ${p.productId} - txn ${p.transactionId} (${lineageId}) - otx ${p.originalTransactionIdentifierIOS} - reason ${p.reasonIOS}  @ ${date}`
  );
};

/**
 * Methods regulating check frequence
 */

export const markChecked = async () => {
  try {
    await SecureStore.setItemAsync(LAST_CHECK_KEY, new Date().toISOString());
  } catch {
    console.log('failed markChecked SubscriptionWatcher');
  }
};

export const shouldCheckNow = async () => {
  try {
    const lastISO = await SecureStore.getItemAsync(LAST_CHECK_KEY);
    if (!lastISO) return true;
    const hours = differenceInHours(new Date(), new Date(lastISO));
    return hours >= MIN_HOURS_BETWEEN_CHECKS;
  } catch {
    return true;
  }
};
