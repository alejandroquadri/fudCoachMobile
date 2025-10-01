import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { StepProgressBar } from '@components';
import { Button, Icon } from '@rneui/themed';
import { COLORS, SharedStyles } from '@theme';
import {
  fetchProducts,
  finishTransaction,
  getAvailablePurchases,
  requestPurchase,
  useIAP,
} from 'expo-iap';
import { validateIOS } from '@services';

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
  // subs: ['fudCoach_yearly', 'fudCoach_weekly'] as const,
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

        // TODO: lo de abajo lo comento porque seria para validar desde backend
        //
        // const productId = purchase?.id ?? purchase?.productId ?? 'unknown.sku';
        // const transactionId =
        //   purchase?.transactionId ??
        //   purchase?.purchaseToken ??
        //   String(Date.now());
        //
        // // --- NEW: ask expo-iap to validate on-device and give us the iOS receipt object
        // // validateReceipt requires 1 arg (sku) and returns an object, not a string
        // let receiptData = '';
        // if (Platform.OS === 'ios') {
        //   const vr = await validateReceipt(productId).catch(error =>
        //     console.log('el error viene aca ', error)
        //   ); // <-- pass SKU
        //
        //   // Shapes vary by version/env; pick anything that looks like base64
        //   // Common keys seen in v3: receiptData, receipt, rawReceipt
        //   const anyVr = vr as any;
        //   receiptData =
        //     anyVr?.receiptData || anyVr?.receipt || anyVr?.rawReceipt || '';
        //
        //   // When using a local .storekit file, there usually isn't a real Apple receipt
        //   // In that case, skip server validation and let your mock handle it
        //   if (!receiptData) {
        //     console.log(
        //       '[IAP] No iOS receipt data (likely local StoreKit). Using mock validation.'
        //     );
        //   }
        // }
        //
        // // --- call your service (it now expects receiptData)
        // const result = await validateIOS({
        //   productId,
        //   transactionId,
        //   receiptData,
        // });
        //
        // if (!result.ok) {
        //   Alert.alert(
        //     'Validation error',
        //     result.error ?? 'Could not validate purchase'
        //   );
        //   return;
        // }

        // IMPORTANT: only finish after your server says "ok"
        await finishTransaction({ purchase, isConsumable: false });
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

  const { connected, validateReceipt } = useIAP({
    onPurchaseSuccess,
    onPurchaseError,
  });

  // 4) Load subscription products when the store is connected
  useEffect(() => {
    console.log('use effect n4');
    if (!connected) return;
    (async () => {
      try {
        setLoading(true);
        const products = await fetchProducts({
          skus: productIds,
          type: 'subs',
        });
        console.log('tengo products', products);
        if (products) {
          setPlans(products);
        }
      } catch (error) {
        console.log(error);
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

  const displayPrice = p =>
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
