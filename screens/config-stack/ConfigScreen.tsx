import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Icon, ListItem } from '@rneui/themed';
import React from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { ConfigStackParamList } from './ConfigStack';

type Props = NativeStackScreenProps<ConfigStackParamList, 'ConfigScreen'>;

const IOS_SUBS_URL = 'itms-apps://apps.apple.com/account/subscriptions';

export const ConfigScreen = ({ navigation }: Props) => {
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

  return (
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

        <ListItem bottomDivider={false} onPress={manageSubs}>
          <Icon name="credit-card" type="feather" />
          <ListItem.Content>
            <ListItem.Title>
              <Text>Subscription</Text>
            </ListItem.Title>
            <ListItem.Subtitle>
              <Text>Manage</Text>
            </ListItem.Subtitle>
          </ListItem.Content>
          <Icon name="chevron-right" type="feather" />
        </ListItem>

        {/* Add more settings entries here */}
      </View>
    </ScrollView>
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
});
