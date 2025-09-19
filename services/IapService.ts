// import { Platform } from 'react-native';
// import * as RNIap from 'react-native-iap';
//
// // Keep all product IDs here (must match StoreKit / App Store Connect)
// export const IAP_PRODUCT_IDS = {
//   // choose one path:
//   // nonConsumable: ['pro_lifetime'], // one-time unlock
//   // or subscriptions:
//   subscriptions: ['weekly', 'anual'],
// } as const;
//
// export const initIap = async () => {
//   if (Platform.OS !== 'ios') return;
//   await RNIap.initConnection(); // StoreKit 2 behind the scenes
// };
//
// export const endIap = async () => {
//   if (Platform.OS !== 'ios') return;
//   await RNIap.endConnection();
// };
