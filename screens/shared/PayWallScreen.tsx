import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { StepProgressBar } from '@components';
import { Button, Icon } from '@rneui/themed';
import {
  getOrCreateAppAccountToken,
  validateIOSPurchaseClient,
} from '@services';
import { COLORS, SharedStyles } from '@theme';
import { Entitlement } from '@types';
import {
  Purchase,
  fetchProducts,
  finishTransaction,
  requestPurchase,
  useIAP,
} from 'expo-iap';

type PaywallProps = {
  onSuccess: (entitlement: Entitlement) => void;
  onBack: () => void;
  showProgressBar?: boolean;
  step?: number;
  totalSteps?: number;
};

// 1) Put your real subscription product IDs here
const IAP_PRODUCT_IDS = {
  subs: ['weekly_plan', 'anual_plan'] as const,
};

export const PaywallScreen = ({
  onSuccess,
  onBack,
  showProgressBar = false,
  step = 0,
  totalSteps = 0,
}: PaywallProps) => {
  const styles = SharedStyles();

  const [loading, setLoading] = useState(true);
  const [canRetryValidation, setCanRetryValidation] = useState(false); // NEW
  const lastPurchaseRef = useRef<Purchase | null>(null); // new
  const [purchasing, setPurchasing] = useState(false);
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [appAccountToken, setAppAccountToken] = useState<string | null>(null); // NEW

  // Make a mutable copy so TS is happy where a `string[]` is required
  const productIds = useMemo(() => [...IAP_PRODUCT_IDS.subs], []);

  // 2) Handle purchase success with the hook's callbacks
  const onPurchaseSuccess = useCallback(
    async (purchase: Purchase) => {
      setPurchasing(true);
      lastPurchaseRef.current = purchase;
      try {
        // server validation
        const res = await validateIOSPurchaseClient({
          purchase,
          appAccountToken: appAccountToken || undefined,
        });
        console.log('validation response: ', res);

        if (!res.ok) {
          setCanRetryValidation(true);
          Alert.alert(
            'Validation failed',
            res.error ?? 'Could not validate purchase.'
          );
          return; // IMPORTANT: do NOT finish the transaction if validation fails
        }

        // IMPORTANT: only finish after your server says "ok"
        await finishTransaction({ purchase, isConsumable: false });
        setCanRetryValidation(false);
        lastPurchaseRef.current = null;

        onSuccess(res.entitlement!);
      } catch (err: any) {
        Alert.alert(
          'Finalize error',
          err?.message ?? 'Could not finalize purchase.'
        );
      } finally {
        setPurchasing(false);
      }
    },
    [onSuccess, appAccountToken]
  );

  const onPurchaseError = useCallback((error: any) => {
    setPurchasing(false);
    if (typeof error?.message === 'string' && /already/i.test(error.message)) {
      setCanRetryValidation(true); // NEW: offer retry
    }
    if (error?.code === 'E_USER_CANCELLED') return;
    Alert.alert('Purchase error', error?.message ?? 'Unknown purchase error');
  }, []);

  const { connected } = useIAP({
    onPurchaseSuccess,
    onPurchaseError,
  });

  useEffect(() => {
    (async () => {
      try {
        const token = await getOrCreateAppAccountToken(); // per-install UUID
        setAppAccountToken(token);
      } catch {
        setAppAccountToken(null);
      }
    })();
  }, []);

  // 4) Load subscription products when the store is connected
  useEffect(() => {
    if (!connected) return;
    (async () => {
      try {
        setLoading(true);
        const products = await fetchProducts({
          skus: productIds,
          type: 'subs',
        });
        if (products) {
          setPlans(products);
        }
      } catch (error) {
        Alert.alert('Store error', 'Unable to load products.');
      } finally {
        setLoading(false);
      }
    })();
  }, [connected, productIds]);

  // 5) Pick a default option once products arrive
  useEffect(() => {
    if (!selectedSku && plans?.length) {
      const firstId =
        plans[0]?.id ?? (plans[0] as any)?.productId ?? productIds[0];
      if (firstId) setSelectedSku(firstId);
    }
  }, [plans, selectedSku, productIds]);

  const displayPrice = (p: any) => p?.price ?? '';

  // 6) Buy using the new platform-specific API
  const buy = async () => {
    if (canRetryValidation) {
      // NEW: do not re-purchase while waiting to retry
      return;
    }
    if (!selectedSku) return;
    if (!connected) {
      Alert.alert('Store unavailable', 'Please try again in a moment.');
      return;
    }
    try {
      setPurchasing(true);
      await requestPurchase({
        request: {
          ios: {
            sku: selectedSku,
            appAccountToken: appAccountToken || undefined,
          },
          android: {
            // When you ship Android: provide offerTokens for subs
            skus: [selectedSku],
            subscriptionOffers: [],
          },
        },
        type: 'subs',
      });
      // Result is delivered via onPurchaseSuccess/onPurchaseError
    } catch (e: any) {
      setPurchasing(false);
      const msg = e?.message ?? 'Purchase failed.';
      if (!/cancel/i.test(msg)) Alert.alert('Purchase error', msg);
    }
  };

  const retryValidation = async () => {
    // NEW
    const p = lastPurchaseRef.current;
    if (!p) {
      setCanRetryValidation(false);
      return;
    }

    setPurchasing(true);
    try {
      const res = await validateIOSPurchaseClient({
        purchase: p,
        appAccountToken: appAccountToken || undefined,
      });

      if (!res.ok) {
        Alert.alert(
          'Still not validated',
          res.error ?? 'Please try again in a moment or use Restore.'
        );
        setCanRetryValidation(true); // stay in retry mode
        return;
      }

      await finishTransaction({ purchase: p, isConsumable: false });
      setCanRetryValidation(false);
      lastPurchaseRef.current = null;
      onSuccess(res.entitlement!);
    } catch (e: any) {
      Alert.alert('Retry error', e?.message ?? 'Could not retry validation.');
      setCanRetryValidation(true);
    } finally {
      setPurchasing(false);
    }
  };

  const renderOption = (product: any) => {
    const id = product?.id ?? product?.productId;
    const selected = id && selectedSku === id;

    return (
      <TouchableOpacity
        key={id ?? Math.random().toString(36)}
        style={[styles.optionButton, selected && styles.optionSelectedButton]}
        onPress={() => setSelectedSku(id)}
        disabled={purchasing}>
        <Text
          style={[styles.optionText, selected && styles.optionTextSelected]}>
          {product?.title ?? id ?? 'Subscription'}
        </Text>
        <Text
          style={[styles.optionText, selected && styles.optionTextSelected]}>
          {displayPrice(product)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={onBack} disabled={purchasing}>
            <Icon
              name="chevron-left"
              type="feather"
              size={28}
              color={COLORS.primaryColor}
            />
          </TouchableOpacity>
        </View>

        {showProgressBar && (
          <View style={styles.progressBar}>
            <StepProgressBar step={step} totalSteps={totalSteps} />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.titleNoSub}>Unlock FudCoach Pro</Text>
        <Text style={styles.subtitle}>
          Get your AI Dietitian, personalized plans, and accountability
          messages.
        </Text>

        <View style={styles.optionsContainer}>
          {plans?.length ? (
            plans.map(renderOption)
          ) : (
            <View style={styles.optionButton}>
              <Text style={styles.optionText}>Loading options…</Text>
            </View>
          )}
        </View>
      </View>

      <Button
        title={
          canRetryValidation
            ? purchasing
              ? 'Validating…'
              : 'Retry validation' // NEW
            : purchasing
              ? 'Processing…'
              : 'Continue'
        }
        loading={loading || purchasing}
        onPress={canRetryValidation ? retryValidation : buy} // NEW
        disabled={!selectedSku || loading || purchasing}
        buttonStyle={styles.nextButton}
        titleStyle={styles.nextButtonText}
      />
    </ScrollView>
  );
};
