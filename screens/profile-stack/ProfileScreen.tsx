import { useAuth, useCurrentUser } from '@hooks';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Icon, Text } from '@rneui/themed';
import { getProfile } from '@services';
import { profileApi } from '@api';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { format } from 'date-fns';
import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  Image,
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
  const [savingAvatar, setSavingAvatar] = useState(false);
  const profileRevision = useRef(0);

  /** refetch every time screen is focused */
  useFocusEffect(
    useCallback(() => {
      const revision = profileRevision.current;
      (async () => {
        try {
          const fresh = await getProfile(user._id);
          if (revision !== profileRevision.current) return;
          setProfile(fresh);
          await refreshUser(fresh);
        } catch (e) {
          Alert.alert('Error', 'Could not load profile');
        }
      })();
    }, [user._id])
  );

  const saveAvatar = async (avatar: string) => {
    profileRevision.current++;
    setSavingAvatar(true);
    try {
      await profileApi.updateUser({ avatar });
      const updated = { ...profile, avatar };
      setProfile(updated);
      await refreshUser(updated);
    } catch {
      Alert.alert('Could not update photo', 'Please try again.');
    } finally {
      setSavingAvatar(false);
    }
  };

  const chooseAvatar = async (source: 'camera' | 'library') => {
    try {
      const permission =
        source === 'camera'
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permission needed',
          source === 'camera'
            ? 'Allow camera access in Settings to take a profile photo.'
            : 'Allow photo library access in Settings to choose a profile photo.'
        );
        return;
      }
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      };
      const result =
        source === 'camera'
          ? await ImagePicker.launchCameraAsync(options)
          : await ImagePicker.launchImageLibraryAsync(options);
      if (result.canceled || !result.assets[0]) return;
      const asset = result.assets[0];
      const side = Math.min(asset.width, asset.height);
      if (!side) throw new Error('Invalid image dimensions');
      const image = await ImageManipulator.manipulateAsync(
        asset.uri,
        [
          {
            crop: {
              originX: Math.floor((asset.width - side) / 2),
              originY: Math.floor((asset.height - side) / 2),
              width: side,
              height: side,
            },
          },
          { resize: { width: 192, height: 192 } },
        ],
        {
          compress: 0.55,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );
      if (!image.base64 || image.base64.length > 60000)
        throw new Error('Image is too large');
      await saveAvatar(`data:image/jpeg;base64,${image.base64}`);
    } catch {
      Alert.alert(
        'Could not use photo',
        'Please choose another photo and try again.'
      );
    }
  };

  const showAvatarOptions = () => {
    if (savingAvatar) return;
    Alert.alert('Profile photo', 'Choose a photo for your profile.', [
      { text: 'Take photo', onPress: () => void chooseAvatar('camera') },
      {
        text: 'Choose from library',
        onPress: () => void chooseAvatar('library'),
      },
      ...(profile.avatar
        ? [
            {
              text: 'Remove photo',
              style: 'destructive' as const,
              onPress: () => void saveAvatar(''),
            },
          ]
        : []),
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

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

      <View style={profileStyles.avatarSection}>
        <TouchableOpacity
          onPress={showAvatarOptions}
          disabled={savingAvatar}
          accessibilityRole="button"
          accessibilityLabel="Change profile photo"
          style={profileStyles.avatar}>
          {savingAvatar ? (
            <ActivityIndicator color={COLORS.white} />
          ) : profile.avatar ? (
            <Image
              source={{ uri: profile.avatar }}
              style={profileStyles.avatarImage}
            />
          ) : (
            <Text style={profileStyles.initials}>
              {profile.name
                ?.trim()
                .split(/\s+/)
                .slice(0, 2)
                .map(part => part[0].toUpperCase())
                .join('') || '?'}
            </Text>
          )}
        </TouchableOpacity>
        <Text style={profileStyles.avatarName}>
          {profile.name?.trim() || 'Your profile'}
        </Text>
        <TouchableOpacity onPress={showAvatarOptions} disabled={savingAvatar}>
          <Text style={profileStyles.changePhoto}>Change photo</Text>
        </TouchableOpacity>
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
  avatarSection: { alignItems: 'center', marginBottom: 24, gap: 8 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.accentColor,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  initials: { color: COLORS.white, fontSize: 32, fontWeight: '600' },
  avatarName: { color: COLORS.text, fontSize: 19, fontWeight: '600' },
  changePhoto: { color: '#238b88', fontSize: 15, fontWeight: '600' },
  container: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    flexGrow: 1,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  changeGoalButton: {
    backgroundColor: COLORS.accentColor,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  changeGoalButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
    color: COLORS.subText,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.lightDivider,
    marginVertical: 4,
  },
});
