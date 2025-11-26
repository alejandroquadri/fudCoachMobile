import {
  validateIOSActiveSubscription,
  validateIOSPurchaseSubscription,
} from '@services';
import { Entitlement } from '@types';
import {
  loadProcessedLineages,
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
  PurchaseIOS,
  getAvailablePurchases,
  ProductSubscription,
  getActiveSubscriptions,
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
import { Alert } from 'react-native';
import { useAuth } from './useAuth';

type SubscriptionStatus = 'unknown' | 'checking' | 'active' | 'inactive';

type SubscriptionContextType = {
  connected: boolean;
  status: SubscriptionStatus;
  purchasing: boolean;
  loadingProducts: boolean;
  subscriptions: ProductSubscription[];
  requestPurchase: (subscriptionId: string) => Promise<void>;
  entitlement: Entitlement | undefined;
  checkSubscription: (considerLastCheck?: boolean) => Promise<void>;
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
  const checkingRef = useRef(false);

  const { user } = useAuth();

  // proceso todas las compras que vienen de Store Kit (del telefono)
  const handlePurchaseUpdate = async (purchase: PurchaseIOS) => {
    // Log compact info
    logPurchaseSummary(purchase);

    // 1️⃣ Ignore any transaction we've already handled
    if (!isNewTransaction(purchase)) {
      console.log('[IAP] duplicate / historical transaction, finishing only');
      try {
        await finishTransaction({ purchase });
      } catch (err) {
        console.warn('finishTransaction failed for historical txn', err);
      }
      return;
    }

    // 2️⃣ This is the latest transaction for this subscription
    console.log('[IAP] new transaction detected, validating new purchase obj');

    try {
      const res = await validateIOSPurchaseSubscription(purchase);

      if (res.ok === true) {
        // Mark lineage processed so renewals are ignored later
        await markTransactionProcessed(purchase);

        // Finish transaction so StoreKit stops replaying it
        await finishTransaction({ purchase });

        // Notify app logic (unlock access)
        setStatus('active');
        setEntitlement(res.entitlement);
        // onSuccess(res.entitlement!);
        console.log('[IAP] purchase validated & finished successfully');
      } else {
        try {
          await finishTransaction({ purchase });
          console.log('[IAP] finished tx ', purchase.id);
        } catch (err) {
          console.warn('[IAP] failed to finish invalid purchase', err);
        }
        Alert.alert('Validation failed', 'Purchase could not be validated.');
        console.warn('[IAP] validation error', res.error);
      }
    } catch (error) {
      console.error('Error handling purchase:', error);
      Alert.alert('Error', 'Failed to process purchase.');
    } finally {
      setPurchasing(false);
    }
  };

  // metodo que ejecuta una compra. vendra desde el paywall
  const handleRequestPurchase = async (subscriptionId: string) => {
    if (!connected) {
      Alert.alert('Store unavailable', 'Please try again in a moment.');
      return;
    }
    try {
      setPurchasing(true);
      await requestPurchase({
        request: { ios: { sku: subscriptionId } },
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

    // entitlement shortcut
    const grant = user?.entitlement?.grant;
    if (grant) {
      const stillValid =
        !grant.untilISO || new Date(grant.untilISO).getTime() > Date.now();
      if (stillValid) {
        console.log('[IAP] tiene grant valido');
        await markChecked();
        setStatus('active');
        return;
      }
    }

    if (!connected) {
      console.log('[IAP] skipping not connected');
      return;
    }

    setPurchasing(true);
    setStatus('checking');
    checkingRef.current = true;
    try {
      const activeSubs = await getActiveSubscriptions();
      console.log('[IAP] tengo estas active subs', activeSubs);
      const activeSub = activeSubs?.find(s => s.isActive);
      if (activeSub) {
        console.log('[IAP] start to validate subscirption');
        const validationRes = await validateIOSActiveSubscription(activeSub);
        if (validationRes?.ok) {
          console.log('[IAP] subscription validated');
          await markChecked();
          setStatus('active');
          setEntitlement(validationRes.entitlement);
          return;
        } else {
          setStatus('inactive');
        }
      } else {
        // No entitlement known
        console.log('[IAP] no tengo active sub, setting to inactive');
        setStatus('inactive');
      }
    } catch (error) {
      console.warn('[SUB] check failed', error);
    } finally {
      checkingRef.current = false;
      setPurchasing(false);
    }
  };

  const {
    connected,
    subscriptions,
    fetchProducts,
    requestPurchase,
    finishTransaction,
  } = useIAP({
    onPurchaseSuccess: async (purchase: Purchase) => {
      if (!connected) return;
      await handlePurchaseUpdate(purchase as PurchaseIOS);
    },
    onPurchaseError: error => {
      setPurchasing(false);
      // Don't show error for user cancellation
      if (error.code === ErrorCode.UserCancelled) {
        return;
      }
      Alert.alert(
        'Purchase Error',
        'Failed to complete purchase. Please try again.'
      );
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

    // NOTE: termino transacciones viejas que hayan quedado
    const cleanTx = async () => {
      // 1️⃣ Load checkpoints first
      await loadProcessedLineages();

      // 2️⃣ Then clean & fetch products
      try {
        const pending = await getAvailablePurchases();
        for (const p of pending) {
          if (!isNewTransaction(p as PurchaseIOS)) {
            console.log('[IAP] cleaning old txn on startup:', p.id);
            await finishTransaction({ purchase: p });
          }
        }
      } catch (err) {
        console.warn('Error cleaning old transactions', err);
      }
    };

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
    cleanTx();
    checkSubscriptionStatus();
    fetchSubscriptions();
  }, [connected, fetchProducts]);

  const value = useMemo(
    () => ({
      connected,
      status,
      purchasing,
      loadingProducts,
      subscriptions,
      requestPurchase: async (subscriptionId: string) =>
        handleRequestPurchase(subscriptionId),
      entitlement,
      checkSubscription: async (considerLastCheck?: boolean) =>
        checkSubscriptionStatus(considerLastCheck),
    }),
    [connected, status, purchasing, loadingProducts, subscriptions, entitlement]
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {props.children}
    </SubscriptionContext.Provider>
  );
};
