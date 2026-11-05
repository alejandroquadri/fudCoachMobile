# Languages

The device preference is the default. We scan the device's ordered language list for a supported language and fall back to English. An explicit selection in Settings takes precedence and is saved on the device. Settings offers only supported languages; it shows the resolved language even before an explicit selection. Device detection also refreshes on foreground changes until a language is explicitly selected. Units stay independent.

Components subscribe through `useLanguageUpdates()` and call `tr()` at display boundaries. Canonical onboarding values, API enum values, user names, food names, notes and existing chat history are not translated. Language changes do not remount navigation or discard drafts. Resources ship with the app and work offline.

Authenticated requests carry `X-App-Language`, so chat uses the current device selection immediately. Authenticated startup, language changes and app foregrounding also synchronize the resolved language through `PUT /profile/language`; failed synchronization retries while the app is running. Scheduled server reminders use the most recently synchronized account language. On multiple devices the last synchronization wins for reminders; each device keeps its own interface choice.

## Add a language

1. Add a registry entry in `registry.ts` with its native label and formatting locale.
2. Create a translation JSON with all keys from `en.json`; register that resource in `index.ts`. English is the fallback for missing keys. Full sentences and interpolated translation keys should be preferred over concatenating translated fragments.
3. Declare the language in the `expo-localization` supported locales in `app.json`, and add a native permission translation JSON under `expo.locales`.
4. In the backend add the code to `supportedLanguages`, its model instruction and fixed-response resources in `services/ai/language.ts`, its welcome text and scheduled reminder resources. Keep extraction identifiers and USDA matching data in their required formats.
5. Run `node scripts/check-localization.cjs`, mobile typecheck/lint, and backend tests/typecheck. Translation parity checks automatically cover every registry entry. Check longer labels and native dialogs on a device.

Native plugin and permission changes require regeneration of the native project and a new device build. No iOS build was run as part of this change. From the mobile repository use `yarn prebuild --platform ios`, then open `ios/FoodCoach.xcworkspace` and build on the physical device. Do not use clean prebuild if there are native changes you need to retain.
