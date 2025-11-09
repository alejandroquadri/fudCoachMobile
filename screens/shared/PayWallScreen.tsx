import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

import { StepProgressBar } from '@components';
import { Button, Icon } from '@rneui/themed';
import {
  getOrCreateAppAccountToken,
  validateIOSPurchaseClient,
} from '@services';
import { ErrorCode, Purchase, useIAP } from 'expo-iap'; // 3.1: only import Purchase + useIAP

import { COLORS, SharedStyles } from '@theme';
import { Entitlement } from '@types';

type PaywallProps = {
  onSuccess: (entitlement: Entitlement) => void;
  onBack?: () => void;
  showProgressBar?: boolean;
  step?: number;
  totalSteps?: number;
  modal: boolean;
};

// Keep your same product ids

export const PaywallScreen = ({
  onSuccess,
  onBack,
  showProgressBar = false,
  step = 0,
  totalSteps = 0,
  modal = false,
}: PaywallProps) => {
  const styles = SharedStyles();

  const [loading, setLoading] = useState(true);
  const [canRetryValidation, setCanRetryValidation] = useState(false);
  const lastPurchaseRef = useRef<Purchase | null>(null);
  const hasUnlockedRef = useRef(false);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [appAccountToken, setAppAccountToken] = useState<string | null>(null);

  const FEATURES: { text: string; icon: { name: string; type: string } }[] = [
    {
      text: 'Your AI dietitian, available 24/7',
      icon: { name: 'check-circle', type: 'feather' },
    },
    {
      text: 'Personalized plan that adapts to you',
      icon: { name: 'tune-variant', type: 'material-community' },
    },
    {
      text: 'Quick meal logging, zero friction',
      icon: { name: 'clipboard-text-outline', type: 'material-community' },
    },
    {
      text: 'Gentle accountability nudges',
      icon: { name: 'bell-check-outline', type: 'material-community' },
    },
  ];

  const productsIds = ['weekly_plan', 'anual_plan'];
  // 3.1: these now come from the hook
  const {
    connected,
    subscriptions,
    fetchProducts,
    requestPurchase,
    finishTransaction,
  } = useIAP({
    onPurchaseSuccess: async (purchase: Purchase) => {
      // esto es para que no haga el call constantemente, especialmente en sandbox
      if (hasUnlockedRef.current) {
        try {
          await finishTransaction({ purchase, isConsumable: false });
        } catch (e) {
          console.warn('finishTransaction on repeat/renewal failed', e);
        }
        return;
      }
      console.log('purchase succesful', purchase);
      setPurchasing(true);
      lastPurchaseRef.current = purchase;
      try {
        // server-side validation (unchanged)
        const res = await validateIOSPurchaseClient({
          purchase,
          appAccountToken: appAccountToken || undefined,
        });

        console.log('este es el obj del verified', res);
        if (res.ok === true) {
          // 3.1: finishTransaction from hook
          await finishTransaction({ purchase, isConsumable: false });
          setCanRetryValidation(false);
          lastPurchaseRef.current = null;

          // mark as unlocked so further renewals on this mount are ignored
          hasUnlockedRef.current = true;
          onSuccess(res.entitlement!);
        } else {
          setCanRetryValidation(true);
          Alert.alert(
            'Validation failed',
            'Purchase could not be validated. Please contact support.'
          );
          console.log('error de validacion', res.error);
        }
      } catch (error) {
        console.error('Error handling purchase:', error);
        Alert.alert('Error', 'Failed to process purchase.');
      } finally {
        setPurchasing(false);
      }
    },
    onPurchaseError: error => {
      setPurchasing(false);
      // Don't show error for user cancellation
      if (error.code === ErrorCode.UserCancelled) {
        return;
      }
      setCanRetryValidation(true);
      Alert.alert(
        'Purchase Error',
        'Failed to complete purchase. Please try again.'
      );
      console.error('Purchase error:', error);
    },
  });

  useEffect(() => {
    console.log('effect de create token');
    (async () => {
      try {
        const token = await getOrCreateAppAccountToken(); // per-install UUID
        setAppAccountToken(token);
      } catch {
        setAppAccountToken(null);
      }
    })();
  }, []);

  // 3.1: fetch via hook function when connected
  useEffect(() => {
    console.log('chequeo si esta conectado');
    if (!connected) return;
    console.log('esta conectado');
    const initIAP = async () => {
      try {
        setLoading(true);
        console.log('busco productos');
        await fetchProducts({
          skus: productsIds,
          type: 'subs', // still supported to filter to subscriptions
        });
        console.log('tengo productos sin error aparentemente');
      } catch {
        Alert.alert('Store error', 'Unable to load products.');
      } finally {
        setLoading(false);
      }
    };
    initIAP();
  }, [connected, fetchProducts]);

  // Pick default option when products arrive
  useEffect(() => {
    if (!selectedSku && subscriptions?.length) {
      const firstId = subscriptions[0]?.id;
      if (firstId) setSelectedSku(firstId);
    }
  }, [subscriptions, selectedSku]);

  // 3.1: use displayPrice from product
  const displayPrice = (p: any) => p?.displayPrice ?? '';

  const buy = async () => {
    if (canRetryValidation) return;
    if (!selectedSku) return;
    if (!connected) {
      Alert.alert('Store unavailable', 'Please try again in a moment.');
      return;
    }
    try {
      setPurchasing(true);
      // 3.1: requestPurchase signature does NOT take "type"
      await requestPurchase({
        request: { ios: { sku: selectedSku } },
        type: 'subs',
      });
      // Result comes via onPurchaseSuccess/onPurchaseError
    } catch (e: any) {
      setPurchasing(false);
      const msg = e?.message ?? 'Purchase failed.';
      if (!/cancel/i.test(msg)) Alert.alert('Purchase error', msg);
    }
  };

  const retryValidation = async () => {
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

      if (res.ok === true) {
        // 3.1: finishTransaction from hook
        await finishTransaction({ purchase: p, isConsumable: false });
        setCanRetryValidation(false);
        lastPurchaseRef.current = null;

        onSuccess(res.entitlement!);
      } else {
        setCanRetryValidation(true);
        Alert.alert(
          'Validation failed',
          'Purchase could not be validated. Please contact support.'
        );
        console.log('error de validacion', res.error);
      }
    } catch (error) {
      console.error('Error handling purchase:', error);
      Alert.alert('Error', 'Failed to process purchase.');
    } finally {
      setPurchasing(false);
    }
  };

  const renderOption = (product: any) => {
    const id = product?.id;
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
        {modal === false && (
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
        )}

        {showProgressBar && (
          <View style={styles.progressBar}>
            <StepProgressBar step={step} totalSteps={totalSteps} />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Image
          source={require('../../assets/food_coach_black.png')} // Update the path to your actual chart asset
          style={payWallStyles.logoImg}
          resizeMode="contain"
        />
        <Text style={payWallStyles.title}>Unlock Food Coach</Text>
        <View style={payWallStyles.container}>
          {FEATURES.map((f, idx) => (
            <View key={idx} style={payWallStyles.item}>
              <Icon
                name={f.icon.name}
                type={f.icon.type as any}
                size={20}
                color={COLORS.primaryColor}
              />
              <Text style={payWallStyles.itemText}>{f.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.optionsContainer}>
          {subscriptions ? (
            subscriptions.map(renderOption)
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
              : 'Retry validation'
            : purchasing
              ? 'Processing…'
              : 'Continue'
        }
        loading={loading || purchasing}
        onPress={canRetryValidation ? retryValidation : buy}
        disabled={!selectedSku || loading || purchasing}
        buttonStyle={styles.nextButton}
        titleStyle={styles.nextButtonText}
      />
    </ScrollView>
  );
};

const payWallStyles = StyleSheet.create({
  logoImg: {
    width: '60%',
    height: 130,
    borderRadius: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 20,
    textAlign: 'center',
    width: '80%',
  },
  container: {
    marginTop: 10,
    marginBottom: 30,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemText: {
    marginLeft: 10,
    fontSize: 16,
    lineHeight: 22,
    color: '#111',
    flexShrink: 1,
  },
});
