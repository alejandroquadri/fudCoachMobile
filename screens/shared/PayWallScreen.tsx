import React, { useEffect, useState } from 'react';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { StepProgressBar } from '@components';
import { URLS } from '@constants';
import { Button, Icon } from '@rneui/themed';
import { ProductSubscription } from 'expo-iap';

import { PRODUCTS_IDS, useAuth, useSubscription } from '@hooks';
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

type SubscirptionMetadaType = Record<
  string,
  { displayTitle: string; displaySubTitle: string }
>;

// Defino SKUs de productos. Hay que usar los IDs
const PRODUCTS_METADATA: SubscirptionMetadaType = {
  weekly_plan: {
    displayTitle: '3-Day Trial',
    displaySubTitle: 'then USD 7.99 per week',
  },
  anual_plan: {
    displayTitle: 'Yearly Plan',
    displaySubTitle: 'USD 39.99 per week',
  },
};

const TERMS_URL = URLS.terms;
const PRIVACY_URL = URLS.privacy;

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

export const PaywallScreen = ({
  onSuccess,
  onBack,
  showProgressBar = false,
  step = 0,
  totalSteps = 0,
  modal = false,
}: PaywallProps) => {
  const styles = SharedStyles();

  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const { signOut } = useAuth();

  const {
    status,
    purchasing,
    loadingProducts,
    subscriptions,
    requestPurchase,
    entitlement,
    checkSubscription,
  } = useSubscription();

  // Esto para que elija la primera opcion por default
  useEffect(() => {
    console.log('[Paywall] tengo SKUS', subscriptions.length);
    if (!selectedSku && subscriptions?.length) {
      const firstId = subscriptions[0]?.id;
      if (firstId) setSelectedSku(firstId);
    }
  }, [subscriptions, selectedSku]);

  useEffect(() => {
    if (entitlement && status === 'active') {
      console.log('tengo entitlement');
      onSuccess(entitlement);
    } else {
      console.log('no hay success aun', entitlement, status);
    }
  }, [entitlement, status]);

  const buy = async () => {
    if (!selectedSku) return;
    console.log('[Paywall] Trying to buy this id:', selectedSku);
    try {
      await requestPurchase(selectedSku);
    } catch (error) {
      console.log('error trying to buy subscription');
    }
  };

  const onRestore = async () => {
    const checkRet = async () => {
      await checkSubscription();
    };
    checkRet();
  };

  const bySkuOrder = (a: ProductSubscription, b: ProductSubscription) => {
    const ai = PRODUCTS_IDS.indexOf(a?.id ?? '');
    const bi = PRODUCTS_IDS.indexOf(b?.id ?? '');
    const ra = ai === -1 ? Number.MAX_SAFE_INTEGER : ai;
    const rb = bi === -1 ? Number.MAX_SAFE_INTEGER : bi;
    return ra - rb;
  };

  const renderOption = (product: ProductSubscription) => {
    const id = product.id;
    const metadata = PRODUCTS_METADATA[id];
    const selected = id && selectedSku === id;

    return (
      <TouchableOpacity
        key={id ?? Math.random().toString(36)}
        style={[
          payWallStyles.optionButton,
          selected && payWallStyles.optionSelectedButton,
        ]}
        onPress={() => setSelectedSku(id)}
        disabled={purchasing}>
        <Text style={payWallStyles.optionText}>{metadata.displayTitle}</Text>
        <Text style={payWallStyles.optionDescription}>
          {metadata.displaySubTitle}
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

        {modal === true && (
          <View style={styles.backButtonContainer}>
            <TouchableOpacity onPress={() => signOut()} disabled={purchasing}>
              <Icon
                name="log-out"
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
            subscriptions.sort(bySkuOrder).map(sub => renderOption(sub))
          ) : (
            <View style={styles.optionButton}>
              <Text style={styles.optionText}>Loading options…</Text>
            </View>
          )}
        </View>
      </View>

      <View>
        <Button
          title={purchasing ? 'Processing…' : 'Continue'}
          loading={loadingProducts || purchasing}
          onPress={buy}
          disabled={!selectedSku || loadingProducts || purchasing}
          buttonStyle={styles.nextButton}
          titleStyle={styles.nextButtonText}
        />

        <View style={payWallStyles.linksRow}>
          <Text
            style={payWallStyles.linkText}
            onPress={() => Linking.openURL(TERMS_URL)}>
            Terms of Use
          </Text>
          <Text style={payWallStyles.dot}> · </Text>

          <Text style={payWallStyles.linkText} onPress={onRestore}>
            Restore
          </Text>
          <Text style={payWallStyles.dot}> · </Text>

          <Text
            style={payWallStyles.linkText}
            onPress={() => Linking.openURL(PRIVACY_URL)}>
            Privacy policy
          </Text>
        </View>
      </View>
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
  optionButton: {
    backgroundColor: COLORS.secondaryColor,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  optionSelectedButton: {
    borderColor: COLORS.primaryColor,
    borderWidth: 2,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.primaryColor,
    fontWeight: 'bold',
  },
  optionDescription: {
    color: COLORS.subText,
  },
  linksRow: {
    marginTop: 5,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  linkText: {
    fontSize: 12,
    color: COLORS.subText,
    textDecorationLine: 'underline',
  },
  dot: {
    marginHorizontal: 5,
    fontSize: 13,
    color: COLORS.subText,
  },
});

// Inicio, aca tengo que buscar los productos
// useEffect(() => {
//   const fetchProds = async () => {
//     console.log('got subscriptions?', subscriptions);
//     try {
//       // setLoadingProducts(true);
//       // aca tengo que buscar los produtos.
//       // Ojo que antes entraban directamente en subscriptions.
//       // Ahora los voy a tener que meter por un state
//       // await fetchProducts({
//       //   skus: productsIds,
//       //   type: 'subs',
//       // });
//     } catch {
//       Alert.alert('Store error', 'Unable to load products.');
//     } finally {
//       // setLoadingProducts(false);
//     }
//   };
//   fetchProds();
// }, []);
