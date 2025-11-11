import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { StepProgressBar } from '@components';
import { Button, Icon } from '@rneui/themed';
import { validateIOSPurchaseClient } from '@services';
import {
  ErrorCode,
  Purchase,
  PurchaseIOS,
  getAvailablePurchases,
  useIAP,
} from 'expo-iap';

import { COLORS, SharedStyles } from '@theme';
import { Entitlement } from '@types';
import {
  isNewTransaction,
  loadProcessedLineages,
  logPurchaseSummary,
  markTransactionProcessed,
} from '@utils';

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

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedSku, setSelectedSku] = useState<string | null>(null);

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

  // Defino SKUs de productos. Hay que usar los IDs
  const productsIds = ['weekly_plan', 'anual_plan'];

  const handlePurchaseUpdate = async (purchase: Purchase) => {
    // Log compact info
    logPurchaseSummary(purchase as PurchaseIOS);

    // 1️⃣ Ignore any transaction we've already handled
    if (!isNewTransaction(purchase as PurchaseIOS)) {
      console.log('[IAP] duplicate / historical transaction, finishing only');
      try {
        await finishTransaction({ purchase });
      } catch (err) {
        console.warn('finishTransaction failed for historical txn', err);
      }
      return;
    }

    // 2️⃣ This is the latest transaction for this subscription
    console.log('[IAP] new transaction detected, validating…');

    try {
      const res = await validateIOSPurchaseClient({ purchase });

      if (res.ok === true) {
        // Mark lineage processed so renewals are ignored later
        await markTransactionProcessed(purchase as PurchaseIOS);

        // Finish transaction so StoreKit stops replaying it
        await finishTransaction({ purchase });

        // Notify app logic (unlock access)
        onSuccess(res.entitlement!);
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

  const {
    connected,
    subscriptions,
    fetchProducts,
    requestPurchase,
    finishTransaction,
  } = useIAP({
    onPurchaseSuccess: async (purchase: Purchase) => {
      if (!connected) return;
      await handlePurchaseUpdate(purchase);
    },
    onPurchaseError: error => {
      setPurchasing(false);
      // Don't show error for user cancellation
      if (error.code === ErrorCode.UserCancelled) {
        return;
      }
      // setCanRetryValidation(true);
      Alert.alert(
        'Purchase Error',
        'Failed to complete purchase. Please try again.'
      );
      console.error('Purchase error:', error);
    },
  });

  // Inicio productos cuando estoy seguro que la conexion esta establecida
  useEffect(() => {
    if (!connected) return;
    console.log('esta conectado');

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

    const fetchProds = async () => {
      console.log('init IAP');
      try {
        setLoadingProducts(true);
        console.log('busco productos');
        await fetchProducts({
          skus: productsIds,
          type: 'subs',
        });
        console.log('tengo productos');
      } catch {
        Alert.alert('Store error', 'Unable to load products.');
      } finally {
        setLoadingProducts(false);
      }
    };
    cleanTx();
    fetchProds();
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
    // if (canRetryValidation) return;
    if (!selectedSku) return;
    if (!connected) {
      Alert.alert('Store unavailable', 'Please try again in a moment.');
      return;
    }
    try {
      setPurchasing(true);
      await requestPurchase({
        request: { ios: { sku: selectedSku } },
        type: 'subs',
      });
      // Result comes via onPurchaseSuccess/onPurchaseError
    } catch (error) {
      setPurchasing(false);
      console.error('Subscription request failed:', error);
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
        title={purchasing ? 'Processing…' : 'Continue'}
        loading={loadingProducts || purchasing}
        onPress={buy}
        disabled={!selectedSku || loadingProducts || purchasing}
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
