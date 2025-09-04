import { useAuth, useCurrentUser } from '@hooks';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Icon, Text } from '@rneui/themed';
import { getProfile } from '@services';
import { format } from 'date-fns';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import type { ProfileStackParamList } from './ProfileStack';
import { capitalizeFirst } from '@utils';
import { SharedStyles, COLORS } from '@theme';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ProfileHome'>;

export const ProfileScreen = ({ navigation }: Props) => {
  const styles = SharedStyles();
  const user = useCurrentUser();
  const { refreshUser } = useAuth();
  const [profile, setProfile] = useState(user);

  /** refetch every time screen is focused */
  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const fresh = await getProfile(user._id);
          setProfile(fresh);
          refreshUser(fresh);
        } catch (e) {
          Alert.alert('Error', 'Could not load profile');
        }
      })();
    }, [user._id])
  );

  return (
    <ScrollView contentContainerStyle={profileStyles.container}>
      <View style={styles.header}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name="chevron-left"
              type="feather"
              size={28}
              color={COLORS.primaryColor}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={profileStyles.card}>
        <View style={profileStyles.goalRow}>
          <View>
            <Text style={profileStyles.label}>Goal Weight</Text>
            <Text style={profileStyles.value}>
              {profile.weightGoal ?? '--'} kg
            </Text>
          </View>
          <Button
            title="Change Goal"
            onPress={() => navigation.navigate('WeightGoalWrapper')}
            buttonStyle={profileStyles.changeGoalButton}
            titleStyle={profileStyles.changeGoalButtonText}
          />
        </View>
      </View>

      <View style={profileStyles.card}>
        <Pressable onPress={() => navigation.navigate('EditNameScreen')}>
          <View style={profileStyles.itemRow}>
            <Text style={profileStyles.label}>Name</Text>
            <Text style={profileStyles.value}>
              {profile.name?.trim() ? profile.name : '--'}
            </Text>
          </View>
        </Pressable>

        <View style={profileStyles.separator} />
        <Pressable onPress={() => navigation.navigate('HeightWrapper')}>
          <View style={profileStyles.itemRow}>
            <Text style={profileStyles.label}>Height</Text>
            <Text style={profileStyles.value}>{profile.height} cm</Text>
          </View>
        </Pressable>
        <View style={profileStyles.separator} />

        <Pressable onPress={() => navigation.navigate('BirthDateWrapper')}>
          <View style={profileStyles.itemRow}>
            <Text style={profileStyles.label}>Date of birth</Text>
            <Text style={profileStyles.value}>
              {profile.birthdate
                ? format(new Date(profile.birthdate), 'dd/MM/yyyy')
                : '--'}
            </Text>
          </View>
        </Pressable>
        <View style={profileStyles.separator} />

        <Pressable onPress={() => navigation.navigate('GenderWrapper')}>
          <View style={profileStyles.itemRow}>
            <Text style={profileStyles.label}>Gender</Text>
            <Text style={profileStyles.value}>
              {capitalizeFirst(profile.gender)}
            </Text>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const profileStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  changeGoalButton: {
    backgroundColor: '#000',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  changeGoalButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
    color: '#666666',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  separator: {
    height: 1,
    backgroundColor: '#E6E6E6',
    marginVertical: 4,
  },
});
