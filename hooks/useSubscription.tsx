import {
  getIOSSubscriptionEntitlement,
  validateIOSPurchaseSubscription,
} from '@services';
import { Entitlement } from '@types';
import {
  ensureProcessedLineagesLoaded,
  isNewTransaction,
  logPurchaseSummary,
  markTransactionProcessed,
  shouldCheckNow,
  markChecked,
} from '@utils';

import {
  useIAP,
  Purchase,
  ErrorCode,
  getAvailablePurchases,
  PurchaseIOS,
  ProductSubscription,
} from 'expo-iap';
import React, {
  ReactElement,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useAuth } from './useAuth';

type SubscriptionStatus = 'unknown' | 'checking' | 'active' | 'inactive';
type SubscriptionErrorType = 'validation' | 'processing' | 'purchase' | 'init';

type SubscriptionError = {
  type: SubscriptionErrorType;
  message: string;
};

type SubscriptionContextType = {
  connected: boolean;
  status: SubscriptionStatus;
  purchasing: boolean;
  loadingProducts: boolean;
  subscriptions: ProductSubscription[];
  lastError: SubscriptionError | null;
  clearError: () => void;
  requestPurchase: (subscriptionId: string) => Promise<void>;
  entitlement: Entitlement | undefined;
  checkSubscription: (considerLastCheck?: boolean) => Promise<void>;
  restorePurchases: () => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx)
    throw new Error('useSubscription must be used inside SubscriptionProvider');
  return ctx;
};

export const PRODUCTS_IDS = ['weekly_plan', 'anual_plan'];

export const SubscriptionProvider = (props: {
  children: ReactNode;
}): ReactElement => {
  const [status, setStatus] = useState<SubscriptionStatus>('unknown');
  const [purchasing, setPurchasing] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [entitlement, setEntitlement] = useState<Entitlement | undefined>();
  const [lastError, setLastError] = useState<SubscriptionError | null>(null);
  const checkingRef = useRef(false);
  const processingTransactionIdsRef = useRef(new Set<string>());

  const clearError = () => setLastError(null);

  const { user, loading: authLoading, refreshUser } = useAuth();

  // proceso todas las compras que vienen de Store Kit (del telefono)
  const handlePurchaseUpdate = async (
    purchase: PurchaseIOS,
    { finish }: { finish: boolean }
  ) => {
    // Log compact info
    logPurchaseSummary(purchase);
    await ensureProcessedLineagesLoaded();

    const transactionId = purchase.transactionId || purchase.id;
    if (processingTransactionIdsRef.current.has(transactionId)) {
      console.log(
        '[IAP] transaction is already being processed:',
        transactionId
      );
      return;
    }

    // Ignore events that were already validated and finished on this device.
    if (!isNewTransaction(purchase)) {
      console.log('[IAP] duplicate / historical transaction, ignoring');
      return;
    }

    processingTransactionIdsRef.current.add(transactionId);
    console.log('[IAP] new transaction detected, validating new purchase obj');

    try {
      const res = await validateIOSPurchaseSubscription(purchase);

      if (res.ok) {
        if (finish) {
          // Finish only after server validation succeeds.
          await finishTransaction({ purchase });
        }

        // A restored purchase was already completed by StoreKit. For a live
        // purchase, reaching here means finishTransaction succeeded.
        await markTransactionProcessed(purchase);

        setStatus('active');
        setEntitlement(res.entitlement);
        setLastError(null);
        console.log(
          finish
            ? '[IAP] purchase validated & finished successfully'
            : '[IAP] restored purchase validated successfully'
        );
      } else {
        // Leave an unverified transaction unfinished so it can be retried.
        setStatus('inactive');
        setLastError({
          type: 'validation',
          message: 'Purchase could not be validated.',
        });
        console.warn('[IAP] validation error', res.error);
      }
    } catch (error) {
      console.error('Error handling purchase:', error);
      // Alert.alert('Error', 'Failed to process purchase.');
      setLastError({
        type: 'processing',
        message: 'Failed to process purchase. Please try again.',
      });
    } finally {
      processingTransactionIdsRef.current.delete(transactionId);
      setPurchasing(false);
    }
  };

  // metodo que ejecuta una compra. vendra desde el paywall
  const handleRequestPurchase = async (subscriptionId: string) => {
    if (!connected) {
      // Alert.alert('Store unavailable', 'Please try again in a moment.');
      setLastError({
        type: 'init',
        message: 'Store unavailable. Please try again in a moment.',
      });
      return;
    }
    if (!user?.appAccountToken) {
      setLastError({
        type: 'init',
        message:
          'Your account is not ready for purchases. Please sign in again.',
      });
      return;
    }
    try {
      setPurchasing(true);
      await requestPurchase({
        request: {
          ios: {
            sku: subscriptionId,
            appAccountToken: user.appAccountToken,
          },
        },
        type: 'subs',
      });
      // Result comes via onPurchaseSuccess/onPurchaseError
    } catch (error) {
      setPurchasing(false);
      console.error('Subscription request failed:', error);
    }
  };

  const checkSubscriptionStatus = async (considerLastCheck?: boolean) => {
    console.log('[IAP] init check subs status');
    //
    // make sure it doesn't try simultaneous checks
    if (checkingRef.current) {
      console.log('is currently checking');
      return;
    }

    if (considerLastCheck === true) {
      const check = await shouldCheckNow();
      if (!check) {
        console.log('[IAP] should not check yet');
        return;
      } else {
        console.log('[IAP] time to check subscription');
      }
    } else {
      console.log('[IAP] Do not need to consider last check');
    }

    if (authLoading || !user) {
      setStatus('unknown');
      return;
    }

    setPurchasing(true);
    setStatus('checking');
    checkingRef.current = true;
    try {
      const validationRes = await getIOSSubscriptionEntitlement();
      if (
        validationRes.appAccountToken &&
        validationRes.appAccountToken !== user.appAccountToken
      ) {
        await refreshUser({
          ...user,
          appAccountToken: validationRes.appAccountToken,
          entitlement: validationRes.entitlement,
        });
      }
      if (validationRes.ok && validationRes.entitlement?.active) {
        await markChecked();
        setStatus('active');
        setEntitlement(validationRes.entitlement);
        setLastError(null);
      } else {
        setStatus('inactive');
        setEntitlement(validationRes.entitlement);
      }
    } catch (error) {
      console.warn('[SUB] check failed', error);
      setStatus('inactive');
      setLastError({
        type: 'validation',
        message: 'Unable to check your subscription. Please try again.',
      });
    } finally {
      checkingRef.current = false;
      setPurchasing(false);
    }
  };

  const handleRestorePurchases = async () => {
    if (!connected) {
      setLastError({
        type: 'init',
        message: 'Store unavailable. Please try again in a moment.',
      });
      return;
    }

    try {
      setPurchasing(true);
      await restorePurchases();
      const purchases = await getAvailablePurchases({
        alsoPublishToEventListenerIOS: false,
        onlyIncludeActiveItemsIOS: true,
      });

      for (const purchase of purchases) {
        if (
          purchase.platform === 'ios' &&
          PRODUCTS_IDS.includes(purchase.productId)
        ) {
          await handlePurchaseUpdate(purchase as PurchaseIOS, {
            finish: false,
          });
        }
      }

      await checkSubscriptionStatus();
    } catch (error) {
      console.error('Restore purchases failed:', error);
      setLastError({
        type: 'processing',
        message: 'Unable to restore purchases. Please try again.',
      });
    } finally {
      setPurchasing(false);
    }
  };

  const {
    connected,
    subscriptions,
    fetchProducts,
    requestPurchase,
    finishTransaction,
    restorePurchases,
  } = useIAP({
    onPurchaseSuccess: async (purchase: Purchase) => {
      if (!connected) return;
      await handlePurchaseUpdate(purchase as PurchaseIOS, { finish: true });
    },
    onPurchaseError: error => {
      setPurchasing(false);
      // Don't show error for user cancellation
      if (error.code === ErrorCode.UserCancelled) {
        return;
      }
      // Alert.alert(
      //   'Purchase Error',
      //   'Failed to complete purchase. Please try again.'
      // );
      setLastError({
        type: 'purchase',
        message: 'Failed to complete purchase. Please try again.',
      });
      console.error('Purchase error:', error);
    },
  });

  // Esto es lo primero que busco
  // 1. me conecto
  // 2. busco productos
  useEffect(() => {
    console.log('[IAP] init');
    if (!connected) {
      console.log('[IAP] not connected skipping fetchproducts');
      return;
    }
    console.log('[IAP] conectado');

    // Busco skus disponibles
    const fetchSubscriptions = async () => {
      try {
        setLoadingProducts(true);
        await fetchProducts({
          skus: PRODUCTS_IDS,
          type: 'subs',
        });
        console.log('[IAP] tengo SKUS');
      } catch {
        console.warn('[IAP] Unable to load products.');
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchSubscriptions();
  }, [connected, fetchProducts]);

  useEffect(() => {
    setEntitlement(undefined);
    setLastError(null);

    if (authLoading || !user?._id) {
      setStatus('unknown');
      return;
    }

    checkSubscriptionStatus();
  }, [authLoading, user?._id]);

  const value = useMemo(
    () => ({
      connected,
      status,
      purchasing,
      loadingProducts,
      subscriptions,
      entitlement,
      lastError,
      requestPurchase: async (subscriptionId: string) =>
        handleRequestPurchase(subscriptionId),
      checkSubscription: async (considerLastCheck?: boolean) =>
        checkSubscriptionStatus(considerLastCheck),
      restorePurchases: handleRestorePurchases,
      clearError,
    }),
    [
      connected,
      status,
      purchasing,
      loadingProducts,
      subscriptions,
      entitlement,
      lastError,
    ]
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {props.children}
    </SubscriptionContext.Provider>
  );
};
