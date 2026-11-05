import { useLanguage } from '../../localization/LanguageProvider';
import {
  tr,
  useLanguageUpdates,
  languages,
  LanguagePreference,
} from '../../localization';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Dialog, Icon, ListItem, Button } from '@rneui/themed';
import React, { useState } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Alert,
  Linking,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { ConfigStackParamList } from './ConfigStack';
import { COLORS } from '@theme';
import { URLS } from '@constants';
import { useAuth, useCurrentUser } from '@hooks';
import { deleteUser } from '@services';

type Props = NativeStackScreenProps<ConfigStackParamList, 'ConfigScreen'>;

export const ConfigScreen = ({ navigation }: Props) => {
  useLanguageUpdates();
  const { language, setPreference } = useLanguage();
  const chooseLanguage = () =>
    Alert.alert(tr('Language'), undefined, [
      ...Object.entries(languages).map(([value, entry]) => ({
        text: (language === value ? '✓ ' : '') + entry.label,
        onPress: () => {
          void setPreference(value as LanguagePreference).catch(() =>
            Alert.alert(tr('Could not save language'), tr('Please try again.'))
          );
        },
      })),
    ]);
  const { signOut } = useAuth();
  const user = useCurrentUser();

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const IOS_SUBS_URL = URLS.iosSubs;
  const TERMS_URL = URLS.terms;
  const PRIVACY_URL = URLS.privacy;

  const manageSubs = async () => {
    try {
      // iOS only for now (your current target)
      if (Platform.OS === 'ios') {
        await Linking.openURL(IOS_SUBS_URL);
        return;
      }
      // no-op for other platforms for now
      Alert.alert(
        tr('Subscriptions'),
        tr('Available on iOS from the App Store account page.')
      );
    } catch {
      Alert.alert(
        tr('Unable to open'),
        tr('Open the App Store, tap your avatar, then Subscriptions.')
      );
    }
  };

  const toPrivacyPolicy = async () => {
    console.log('privacy policy');
    Linking.openURL(PRIVACY_URL);
  };

  const toTermsService = async () => {
    console.log('terms of service');
    Linking.openURL(TERMS_URL);
  };

  const showAlert = async () => {
    setConfirmVisible(true);
  };

  const deleteAccount = () => {
    console.log('start delete account');
    setTimeout(async () => {
      try {
        setDeleting(true);
        console.log('set delete to true');
        const delRet = await deleteUser(user._id);
        console.log('termina promise de delete', delRet);
        await signOut();
        console.log('deslogueo');
      } catch (error) {
        console.log('error deleting accoung', error);
      } finally {
        setDeleting(false);
      }
    }, 0);
  };

  return (
    <>
      <ScrollView contentContainerStyle={configStyles.container}>
        <View style={configStyles.cardShadow}>
          <ListItem
            bottomDivider
            onPress={() => navigation.navigate('ProfileStack')}>
            <View key="content" style={configStyles.listItemRow}>
              <Icon name="user" type="feather" />
              <ListItem.Content>
                <ListItem.Title>
                  <Text>{tr('Profile')}</Text>
                </ListItem.Title>
                <ListItem.Subtitle>
                  <Text>{tr('Personal data, objectives')}</Text>
                </ListItem.Subtitle>
              </ListItem.Content>
              <Icon name="chevron-right" type="feather" />
            </View>
          </ListItem>

          <ListItem
            bottomDivider
            onPress={() => navigation.navigate('CoachMemoryScreen')}>
            <View key="content" style={configStyles.listItemRow}>
              <Icon name="heart" type="feather" />
              <ListItem.Content>
                <ListItem.Title>
                  <Text>{tr('Coach memory')}</Text>
                </ListItem.Title>
                <ListItem.Subtitle>
                  <Text>{tr('What the coach remembers')}</Text>
                </ListItem.Subtitle>
              </ListItem.Content>
              <Icon name="chevron-right" type="feather" />
            </View>
          </ListItem>

          <ListItem
            bottomDivider
            onPress={() => navigation.navigate('NotificationsScreen')}>
            <View key="content" style={configStyles.listItemRow}>
              <Icon name="bell" type="feather" />
              <ListItem.Content>
                <ListItem.Title>
                  <Text>{tr('Notifications')}</Text>
                </ListItem.Title>
                <ListItem.Subtitle>
                  <Text>{tr('Reminders, push preferences')}</Text>
                </ListItem.Subtitle>
              </ListItem.Content>
              <Icon name="chevron-right" type="feather" />
            </View>
          </ListItem>
          <ListItem onPress={chooseLanguage}>
            <View key="content" style={configStyles.listItemRow}>
              <Icon name="translate" type="material" />
              <ListItem.Content>
                <ListItem.Title>{tr('Language')}</ListItem.Title>
                <ListItem.Subtitle>
                  {languages[language].label}
                </ListItem.Subtitle>
              </ListItem.Content>
              <Icon name="chevron-right" type="feather" />
            </View>
          </ListItem>
        </View>

        <View style={[configStyles.cardShadow, configStyles.lastCard]}>
          <ListItem bottomDivider onPress={manageSubs}>
            <View key="content" style={configStyles.listItemRow}>
              <Icon name="credit-card" type="feather" />
              <ListItem.Content>
                <ListItem.Title>
                  <Text>{tr('Manage subscription')}</Text>
                </ListItem.Title>
              </ListItem.Content>
              <Icon name="chevron-right" type="feather" />
            </View>
          </ListItem>

          <ListItem bottomDivider onPress={toTermsService}>
            <View key="content" style={configStyles.listItemRow}>
              <Icon name="document-outline" type="ionicon" />
              <ListItem.Content>
                <ListItem.Title>
                  <Text>{tr('Terms of service')}</Text>
                </ListItem.Title>
              </ListItem.Content>
              <Icon name="chevron-right" type="feather" />
            </View>
          </ListItem>

          <ListItem bottomDivider onPress={toPrivacyPolicy}>
            <View key="content" style={configStyles.listItemRow}>
              <Icon name="police-badge-outline" type="material-design" />
              <ListItem.Content>
                <ListItem.Title>
                  <Text>{tr('Privacy policy')}</Text>
                </ListItem.Title>
              </ListItem.Content>
              <Icon name="chevron-right" type="feather" />
            </View>
          </ListItem>

          <ListItem bottomDivider={false} onPress={showAlert}>
            <View key="content" style={configStyles.listItemRow}>
              <Icon name="user-minus" type="feather" />
              <ListItem.Content>
                <ListItem.Title>
                  <Text>{tr('Delete account')}</Text>
                </ListItem.Title>
              </ListItem.Content>
              <Icon name="chevron-right" type="feather" />
            </View>
          </ListItem>

          {/* Add more settings entries here */}
        </View>
      </ScrollView>

      {/* Confirm Delete Dialog */}
      <Dialog
        isVisible={confirmVisible}
        onBackdropPress={() => setConfirmVisible(false)}>
        <Dialog.Title title={tr('Delete Account?')} />
        <Text>
          {tr(
            'Are you sure you want to permanently delete your account? This action cannot be undone.'
          )}
        </Text>

        <Dialog.Actions>
          <Button
            title={tr('Delete')}
            onPress={async () => {
              setConfirmVisible(false);
              console.log('running after interacion');
              deleteAccount();
            }}
            titleStyle={configStyles.dialogTitle}
            type="clear"
            testID="confirm-delete"
          />
          <Button
            title={tr('Cancel')}
            type="clear"
            onPress={() => setConfirmVisible(false)}
            testID="cancel-delete"
          />
        </Dialog.Actions>
      </Dialog>

      {/* delete dialog loader */}
      <Dialog isVisible={deleting}>
        <View style={configStyles.loaderBox}>
          <ActivityIndicator size="large" />
          <Text style={configStyles.loading}>{tr('Deleting account...')}</Text>
        </View>
      </Dialog>
    </>
  );
};

const configStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  cardShadow: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  lastCard: {
    marginTop: 20,
  },
  listItemRow: {
    alignItems: 'center',
    columnGap: 16,
    flex: 1,
    flexDirection: 'row',
  },
  deleteAcountText: {
    color: COLORS.danger,
  },
  dialogTitle: { color: COLORS.danger, fontWeight: '700' },
  loading: { marginTop: 5, textAlign: 'center' },
  loaderBox: { alignItems: 'center', paddingVertical: 8 },
});
