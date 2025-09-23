// PaywallScreen.tsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';

import { Button, Icon } from '@rneui/themed';
import { StepProgressBar } from '@components';
import { COLORS, SharedStyles } from '@theme';
import {
  useIAP,
  fetchProducts,
  requestPurchase,
  finishTransaction,
  getAvailablePurchases,
} from 'expo-iap';

type PaywallProps = {
  onSuccess: () => void;
  onBack: () => void;
  showProgressBar?: boolean;
  step?: number;
  totalSteps?: number;
};

// 1) Put your real subscription product IDs here
const IAP_PRODUCT_IDS = {
  subs: ['weekly', 'anual'] as const,
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
  const [purchasing, setPurchasing] = useState(false);
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [plans, setPlans] = useState<any[]>([]);

  // Make a mutable copy so TS is happy where a `string[]` is required
  const productIds = useMemo(() => [...IAP_PRODUCT_IDS.subs], []);

  // 2) Handle purchase success with the hook's callbacks (v3 way)
  const onPurchaseSuccess = useCallback(
    async (purchase: any) => {
      try {
        setPurchasing(false);

        // ——————————————————————————————————————————————
        // DEV-ONLY: lightweight validation on device.
        // In production: send purchase metadata to your Node API
        // and validate server-side with Apple.
        // ——————————————————————————————————————————————
        // Example client-side check stub:
        // const receiptResult = await validateReceipt(purchase.productId);
        // if (!receiptResult?.isValid) { Alert.alert('Validation failed'); return; }

        // Finish the transaction so iOS does not replay it on every launch
        await finishTransaction({ purchase, isConsumable: false });

        // Unlock your premium features (server should persist entitlement)
        onSuccess();
      } catch (err: any) {
        Alert.alert(
          'Finalize error',
          err?.message ?? 'Could not finalize purchase.'
        );
      }
    },
    [onSuccess]
  );

  const onPurchaseError = useCallback((error: any) => {
    setPurchasing(false);
    if (error?.code === 'E_USER_CANCELLED') return; // silent cancel
    Alert.alert('Purchase error', error?.message ?? 'Unknown purchase error');
  }, []);

  // 3) useIAP in v3: pass callbacks; do NOT read currentPurchase/currentPurchaseError
  const { connected, subscriptions, validateReceipt } = useIAP({
    onPurchaseSuccess,
    onPurchaseError,
  });

  // 4) Load subscription products when the store is connected
  useEffect(() => {
    if (!connected) return;
    (async () => {
      try {
        setLoading(true);
        console.log('[IAP] fetching subs for', productIds);
        const products = await fetchProducts({
          skus: productIds,
          type: 'subs',
        });
        console.log('estos son los productos', products);
        if (products) {
          setPlans(products);
        }
      } catch (e: any) {
        Alert.alert('Store error', e?.message ?? 'Unable to load products.');
      } finally {
        setLoading(false);
      }
    })();
  }, [connected, productIds]);

  // 5) Pick a default option once products arrive
  useEffect(() => {
    console.log('[IAP] subscriptions length =', subscriptions?.length);

    // if (!selectedSku && subscriptions?.length) {
    //   // In v3, product id is usually `id`. Some builds expose `productId` as well.
    //   const firstId =
    //     subscriptions[0]?.id ??
    //     (subscriptions[0] as any)?.productId ??
    //     productIds[0];
    console.log('[IAP] plans length =', plans?.length);
    if (!selectedSku && plans?.length) {
      const firstId =
        plans[0]?.id ?? (plans[0] as any)?.productId ?? productIds[0];
      if (firstId) setSelectedSku(firstId);
    }
    // }, [subscriptions, selectedSku, productIds]);
  }, [plans, selectedSku, productIds]);

  const displayPrice = (p: any) =>
    p?.displayPrice ?? p?.localizedPrice ?? p?.priceString ?? p?.price ?? '';

  // 6) Buy using the new platform-specific API
  const buy = async () => {
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
            // Leave finishing to our success handler after validation
            andDangerouslyFinishTransactionAutomatically: false,
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

  // 7) Restore for non-consumables & subscriptions
  const restore = async () => {
    try {
      setLoading(true);
      await getAvailablePurchases(); // updates internal state
      Alert.alert(
        'Restore',
        'If you had an active purchase, it will be restored after validation.'
      );
    } catch (e: any) {
      Alert.alert(
        'Restore error',
        e?.message ?? 'Could not restore purchases.'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderOption = (product: any) => {
    console.log(product);
    const id = product?.id ?? product?.productId;
    const selected = id && selectedSku === id;

    return (
      <TouchableOpacity
        key={id ?? Math.random().toString(36)}
        style={[styles.optionButton, selected && styles.optionSelectedButton]}
        // style={
        //   selected
        //     ? [styles.optionButton, styles.optionSelectedButton]
        //     : styles.optionButton
        // }
        onPress={() => setSelectedSku(id)}
        disabled={purchasing}>
        <Text
          style={[styles.optionText, selected && styles.optionTextSelected]}>
          {/* style={styles.optionText}> */}
          {product?.title ?? id ?? 'Subscription'}
        </Text>
        <Text
          style={[styles.optionText, selected && styles.optionTextSelected]}>
          {/* style={styles.optionText}> */}
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
          {/* {subscriptions?.length ? ( */}
          {/*   subscriptions.map(renderOption) */}
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
        title={purchasing ? 'Processing…' : 'Continue'}
        loading={loading || purchasing}
        onPress={buy}
        disabled={!selectedSku || loading || purchasing}
        buttonStyle={styles.nextButton}
        titleStyle={styles.nextButtonText}
      />

      <Button
        type="clear"
        title="Restore purchases"
        onPress={restore}
        disabled={loading || purchasing}
        containerStyle={{ marginTop: 8 }}
      />
    </ScrollView>
  );
};
