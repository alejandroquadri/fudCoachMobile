// import React, { useEffect, useMemo, useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   Platform,
//   Alert,
// } from 'react-native';
// import { Button, Icon } from '@rneui/themed';
// import { StepProgressBar } from '@components';
// import { COLORS, SharedStyles } from '@theme';
// import { IAP_PRODUCT_IDS, initIap, endIap } from '@services';
// import * as RNIap from 'react-native-iap';
//
// interface PaywallProps {
//   onNext: () => void; // advance when unlocked (purchase or restore)
//   onBack: () => void;
//   showProgressBar?: boolean;
//   step?: number;
//   totalSteps?: number;
// }
//
// export const PaywallScreen = ({
//   onNext,
//   onBack,
//   showProgressBar = false,
//   step = 0,
//   totalSteps = 0,
// }: PaywallProps) => {
//   const styles = SharedStyles();
//
//   const [loading, setLoading] = useState(true);
//   const [purchasing, setPurchasing] = useState(false);
//   const [products, setProducts] = useState<RNIap.Product[]>([]);
//
//   // If you switch to subs later:
//   const productIds = useMemo<string[]>(
//     () => [...IAP_PRODUCT_IDS.subscriptions],
//     []
//   );
//
//   useEffect(() => {
//     // listeners (no need to import types)
//     let purchaseUpdateSub:
//       | ReturnType<typeof RNIap.purchaseUpdatedListener>
//       | undefined;
//     let purchaseErrorSub:
//       | ReturnType<typeof RNIap.purchaseErrorListener>
//       | undefined;
//
//     (async () => {
//       if (Platform.OS !== 'ios') {
//         setLoading(false);
//         return;
//       }
//
//       try {
//         await initIap();
//         // v14 uses fetchProducts
//         const list = await RNIap.getProducts({ skus: productIds });
//         setProducts(list);
//       } catch (e) {
//         Alert.alert(
//           'Store',
//           'Could not load products. Please try again later.'
//         );
//       } finally {
//         setLoading(false);
//       }
//
//       purchaseUpdateSub = RNIap.purchaseUpdatedListener(async purchase => {
//         try {
//           // Always finish the transaction; StoreKit 2 handles details internally.
//           await RNIap.finishTransaction({ purchase, isConsumable: false });
//           // TODO: send purchase info to your backend for App Store Server API verification.
//           onNext();
//         } catch {
//           Alert.alert('Purchase', 'We could not complete your purchase.');
//         } finally {
//           setPurchasing(false);
//         }
//       });
//
//       purchaseErrorSub = RNIap.purchaseErrorListener(err => {
//         setPurchasing(false);
//         if (err.code === RNIap.ErrorCode.E_USER_CANCELLED) {
//           return; // just ignore cancellation
//         }
//         Alert.alert('Purchase error', err.message ?? 'Unknown error');
//       });
//     })();
//
//     return () => {
//       purchaseUpdateSub?.remove();
//       purchaseErrorSub?.remove();
//       endIap();
//     };
//   }, [onNext, productIds]);
//
//   const buy = async (id: string) => {
//     try {
//       setPurchasing(true);
//       await (RNIap as any).requestPurchase({ sku: id });
//     } catch {
//       setPurchasing(false);
//       // user-cancel is handled by listener as well
//     }
//   };
//
//   const restore = async () => {
//     try {
//       setPurchasing(true);
//       const restored = await RNIap.getAvailablePurchases();
//       // Different platforms expose slightly different shapes; normalize the id.
//       const extractId = (p: any) =>
//         p?.productId ?? p?.productIdIOS ?? p?.productIdAndroid ?? p?.sku;
//
//       const ids = new Set(productIds);
//       const has = restored?.some((p: any) => ids.has(extractId(p)));
//       if (has) onNext();
//       else
//         Alert.alert(
//           'Restore',
//           'No previous purchases found for this Apple ID.'
//         );
//     } catch {
//       Alert.alert('Restore', 'Could not restore at the moment.');
//     } finally {
//       setPurchasing(false);
//     }
//   };
//
//   // Defensive getters for cross-platform Product fields
//   const getProductId = (p: any): string =>
//     p?.productId ?? p?.productIdIOS ?? p?.productIdAndroid ?? p?.sku ?? '';
//
//   const getProductTitle = (p: any): string => p?.title ?? 'Unlock Pro';
//
//   const getProductPrice = (p: any): string =>
//     p?.localizedPrice ??
//     p?.priceString ??
//     (p?.price && p?.currency ? `${p.price} ${p.currency}` : '');
//
//   const renderProduct = (p: RNIap.Product) => {
//     const id = getProductId(p);
//     return (
//       <TouchableOpacity
//         key={id}
//         style={styles.optionButton}
//         onPress={() => buy(id)}
//         disabled={purchasing}>
//         <Text style={styles.optionText}>{getProductTitle(p)}</Text>
//         <Text style={{ opacity: 0.8, marginTop: 4 }}>{getProductPrice(p)}</Text>
//       </TouchableOpacity>
//     );
//   };
//
//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.backButtonContainer}>
//           <TouchableOpacity onPress={onBack}>
//             <Icon
//               name="chevron-left"
//               type="feather"
//               size={28}
//               color={COLORS.primaryColor}
//             />
//           </TouchableOpacity>
//         </View>
//
//         {showProgressBar && (
//           <View style={styles.progressBar}>
//             <StepProgressBar step={step} totalSteps={totalSteps} />
//           </View>
//         )}
//       </View>
//
//       {/* Content */}
//       <View style={styles.content}>
//         <Text style={styles.titleNoSub}>Unlock FudCoach Pro</Text>
//         <Text style={{ opacity: 0.8, marginTop: 8 }}>
//           Personalized plans, advanced chat tools, and accountability features.
//         </Text>
//
//         <View style={styles.optionsContainer}>
//           {Platform.OS !== 'ios' ? (
//             <TouchableOpacity style={styles.optionButton} onPress={onNext}>
//               <Text style={styles.optionText}>Continue (dev build)</Text>
//             </TouchableOpacity>
//           ) : loading ? (
//             <Text style={{ marginTop: 16 }}>Loading prices…</Text>
//           ) : products.length ? (
//             products.map(renderProduct)
//           ) : (
//             <Text style={{ marginTop: 16 }}>
//               Products unavailable. Check your StoreKit configuration and
//               product IDs.
//             </Text>
//           )}
//         </View>
//       </View>
//
//       {/* Bottom actions */}
//       {Platform.OS === 'ios' && (
//         <Button
//           type="clear"
//           title="Restore Purchases"
//           onPress={restore}
//           loading={purchasing}
//           titleStyle={styles.nextButtonText}
//           containerStyle={{ marginBottom: 8 }}
//         />
//       )}
//
//       <Button
//         title={purchasing ? 'Processing…' : 'Continue'}
//         onPress={onNext}
//         disabled={Platform.OS === 'ios'} // force purchase/restore on iOS
//         loading={purchasing}
//         buttonStyle={styles.nextButton}
//         titleStyle={styles.nextButtonText}
//       />
//     </ScrollView>
//   );
// };
