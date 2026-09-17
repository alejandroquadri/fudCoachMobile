# Food Coach upgrade baseline

This document records the last known-good state before the Expo SDK upgrade.

## Baseline toolchain

- Expo SDK: 52.0.49
- React Native: 0.76.9
- React: 18.3.1
- Node.js: 22.23.2
- Xcode: 26.6
- Test device: iPhone on iOS 26.6.1
- iOS deployment target: 15.1
- New Architecture: disabled

The `ios` and `android` directories are generated and ignored. Persistent native
configuration belongs in `app.json` or a config plugin.

## Native rebuild workflow

After changing a native dependency or app configuration:

1. Run `nvm use`.
2. Run `yarn install`.
3. Run `yarn prebuild:ios:clean`. Expo prebuild runs CocoaPods installation.
4. Open `ios/FoodCoach.xcworkspace` in Xcode.
5. Build and run on the simulator and the physical iPhone.

For ordinary TypeScript development after a native build exists, run
`yarn start` and launch the app from Xcode.

## Baseline smoke test

- Cold launch and network error handling.
- Email sign in and sign out.
- Sign in with Apple.
- New-user onboarding through every step.
- Paywall product loading and plan selection.
- Subscription restore and existing entitlement recognition.
- Chat history loading.
- Send a text message and receive the coach response.
- Open the keyboard, type multiple lines, dismiss it, and reopen it.
- Open the camera, take a photo, upload it, and receive the coach response.
- Notification permission prompt and push-token registration.
- Notification settings and scheduled notification controls.
- Food, water, exercise, weight, progress, profile, sources, and settings screens.
- Background and foreground the app, then relaunch it.

## Automated checks

- `yarn typecheck`
- `yarn lint`
- `yarn doctor`

The initial lint baseline contained 48 warnings and two errors. The two errors
were fixed in Phase 0; warning cleanup is intentionally separate from the SDK
upgrade. Expo Doctor passes 17 of 18 checks. Its remaining check reports the
known maintenance status of RNEUI and Gifted Chat plus missing React Native
Directory metadata for `date-fns-tz`, `react-native-vector-icons`, and `uuid`.
Those packages are reviewed in later upgrade phases rather than suppressed.
