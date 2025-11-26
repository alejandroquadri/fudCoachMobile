import * as SecureStore from 'expo-secure-store';

export const wipeSecureStore = async () => {
  const keys = [
    'userToken',
    'refreshUserToken',
    'userProfile',
    'fc_processed_lineages_v1',
    'fc_last_sub_check_iso',
    'fc_device_id',
    'fc_last_push_token_payload',
    'fc_app_account_token_v1',
    // add any others you know your app uses
  ];

  for (const key of keys) {
    await SecureStore.deleteItemAsync(key);
  }

  console.log('SecureStore wiped.');
};
