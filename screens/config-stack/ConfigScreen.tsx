import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Icon, ListItem, Text } from '@rneui/themed';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ConfigStackParamList } from './ConfigStack';

type Props = NativeStackScreenProps<ConfigStackParamList, 'ConfigScreen'>;

export const ConfigScreen = ({ navigation }: Props) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text h4 style={styles.title}>
        Settings
      </Text>

      <ListItem
        bottomDivider
        onPress={() => navigation.navigate('ProfileStack')}>
        <Icon name="user" type="feather" />
        <ListItem.Content>
          <ListItem.Title>Profile</ListItem.Title>
          <ListItem.Subtitle>Personal info, goals, height</ListItem.Subtitle>
        </ListItem.Content>
        <Icon name="chevron-right" type="feather" />
      </ListItem>

      <ListItem
        bottomDivider
        onPress={() => navigation.navigate('NotificationsScreen')}>
        <Icon name="bell" type="feather" />
        <ListItem.Content>
          <ListItem.Title>Notifications</ListItem.Title>
          <ListItem.Subtitle>Reminders, push preferences</ListItem.Subtitle>
        </ListItem.Content>
        <Icon name="chevron-right" type="feather" />
      </ListItem>

      {/* Add more settings entries here */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { marginBottom: 16 },
});
