import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Icon } from '@rneui/themed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@hooks';

export const CustomDrawer = (props: DrawerContentComponentProps) => {
  const { navigation, state } = props;
  const insets = useSafeAreaInsets();

  const { signOut, user, loading } = useAuth();
  if (!user || loading) return null; // or show fallback

  const currentRoute = state.routeNames[state.index];

  const signOutUser = async () => {
    console.log('trying to signout');
    await signOut();
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const DrawerItem = ({
    label,
    iconName,
    route,
  }: {
    label: string;
    iconName: string;
    route: string;
  }) => {
    const isActive = currentRoute === route;

    return (
      <TouchableOpacity
        style={[styles.itemContainer, isActive && styles.activeItem]}
        onPress={() => navigation.navigate(route)}>
        <Icon
          name={iconName}
          type="feather"
          color={isActive ? '#000' : '#888'}
          style={styles.icon}
        />
        <Text style={[styles.label, isActive && styles.activeLabel]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingTop: insets.top + 16 },
      ]}>
      <View style={styles.profileContainer}>
        {user.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.fallbackAvatar}>
            <Text style={styles.initials}>{getInitials(user.name)}</Text>
          </View>
        )}
        <Text style={styles.name}>{user.name}</Text>
      </View>

      <View style={styles.divider} />

      {/* Navigation Items */}
      <DrawerItem label="Coach" iconName="message-circle" route="Chat" />
      <DrawerItem label="Logs" iconName="clipboard" route="MealLogs" />
      <DrawerItem label="Progress" iconName="bar-chart" route="Progress" />
      <DrawerItem label="Settings" iconName="settings" route="ConfigStack" />
      {/* Bottom Divider */}
      <View style={styles.bottomDivider} />

      {/* Sign Out */}
      <TouchableOpacity style={styles.itemContainer} onPress={signOutUser}>
        <Icon name="log-out" type="feather" color="#888" style={styles.icon} />
        <Text style={styles.label}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  fallbackAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  initials: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  activeItem: {
    backgroundColor: '#f1f1f1',
  },
  icon: {
    marginRight: 16,
  },
  label: {
    fontSize: 15,
    color: '#444',
  },
  activeLabel: {
    fontWeight: 'bold',
    color: '#000',
  },
});
