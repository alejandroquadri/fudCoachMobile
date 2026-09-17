# Expo SDK 53 checkpoint

Phase 1 upgrades the application from Expo SDK 52 to SDK 53 while keeping the
legacy React Native architecture enabled. New Architecture migration remains a
separate phase.

## Versions

- Expo: 53.0.27
- React Native: 0.79.6
- React: 19.0.0
- React DOM: 19.0.0
- React Native Web: 0.20.0
- TypeScript: 5.8.3
- New Architecture: disabled
- iOS deployment target: 15.1

Expo-managed native dependencies were aligned with SDK 53. `expo-font` is now
declared directly because it is a required native peer of `@expo/vector-icons`.

## Automated verification

- Frozen Yarn install: passed
- Expo dependency validation: passed
- TypeScript: passed
- ESLint: passed with the existing 48-warning baseline and no errors
- Production iOS Hermes bundle: passed
- Clean iOS prebuild and CocoaPods installation: passed
- Xcode workspace and `FoodCoach` scheme discovery: passed

Expo Doctor passes 17 of 18 checks. Its remaining React Native Directory check
is unchanged: RNEUI and Gifted Chat are reported as unmaintained, and
`date-fns-tz`, `react-native-vector-icons`, and `uuid` have no directory
metadata. Those dependencies are intentionally handled in later phases.

## Native configuration retained

- Apple development team: `AVU48PUSM6`
- OpenIAP pod: pinned to 1.2.32 for `expo-iap` 3.1.26
- New Architecture: `false`
- Node binary used by Xcode: Node 22.23.2

## Manual device gate

Open `ios/FoodCoach.xcworkspace`, build `FoodCoach` on the physical iPhone, and
run the smoke checklist in `expo-upgrade-baseline.md`. Do not start the
`expo-iap` migration until this checkpoint is confirmed on-device.
