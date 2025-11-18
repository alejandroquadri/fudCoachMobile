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
        'Subscriptions',
        'Available on iOS from the App Store account page.'
      );
    } catch {
      Alert.alert(
        'Unable to open',
        'Open the App Store, tap your avatar, then Subscriptions.'
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
            <Icon name="user" type="feather" />
            <ListItem.Content>
              <ListItem.Title>
                <Text>Profile</Text>
              </ListItem.Title>
              <ListItem.Subtitle>
                <Text>Personal info, goals, height</Text>
              </ListItem.Subtitle>
            </ListItem.Content>
            <Icon name="chevron-right" type="feather" />
          </ListItem>

          <ListItem
            bottomDivider
            onPress={() => navigation.navigate('NotificationsScreen')}>
            <Icon name="bell" type="feather" />
            <ListItem.Content>
              <ListItem.Title>
                <Text>Notifications</Text>
              </ListItem.Title>
              <ListItem.Subtitle>
                <Text>Reminders, push preferences</Text>
              </ListItem.Subtitle>
            </ListItem.Content>
            <Icon name="chevron-right" type="feather" />
          </ListItem>
        </View>

        <View style={[configStyles.cardShadow, configStyles.lastCard]}>
          <ListItem bottomDivider onPress={manageSubs}>
            <Icon name="credit-card" type="feather" />
            <ListItem.Content>
              <ListItem.Title>
                <Text>Manage subscription</Text>
              </ListItem.Title>
            </ListItem.Content>
            <Icon name="chevron-right" type="feather" />
          </ListItem>

          <ListItem bottomDivider onPress={toTermsService}>
            <Icon name="document-outline" type="ionicon" />
            <ListItem.Content>
              <ListItem.Title>
                <Text>Terms of service</Text>
              </ListItem.Title>
            </ListItem.Content>
            <Icon name="chevron-right" type="feather" />
          </ListItem>

          <ListItem bottomDivider onPress={toPrivacyPolicy}>
            <Icon name="police-badge-outline" type="material-community" />
            <ListItem.Content>
              <ListItem.Title>
                <Text>Privacy policy</Text>
              </ListItem.Title>
            </ListItem.Content>
            <Icon name="chevron-right" type="feather" />
          </ListItem>

          <ListItem bottomDivider={false} onPress={showAlert}>
            <Icon name="user-minus" type="feather" />
            <ListItem.Content>
              <ListItem.Title>
                <Text>Delete account</Text>
              </ListItem.Title>
            </ListItem.Content>
            <Icon name="chevron-right" type="feather" />
          </ListItem>

          {/* Add more settings entries here */}
        </View>
      </ScrollView>

      {/* Confirm Delete Dialog */}
      <Dialog
        isVisible={confirmVisible}
        onBackdropPress={() => setConfirmVisible(false)}>
        <Dialog.Title title="Delete Account?" />
        <Text>
          Are you sure you want to permanently delete your account? This action
          cannot be undone.
        </Text>

        <Dialog.Actions>
          <Button
            title="Delete"
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
            title="Cancel"
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
          <Text style={configStyles.loading}>Deleting account...</Text>
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
  deleteAcountText: {
    color: COLORS.danger,
  },
  dialogTitle: { color: COLORS.danger, fontWeight: '700' },
  loading: { marginTop: 5, textAlign: 'center' },
  loaderBox: { alignItems: 'center', paddingVertical: 8 },
});
