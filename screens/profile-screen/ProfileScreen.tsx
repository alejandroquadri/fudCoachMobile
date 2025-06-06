import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DrawerParamList, User } from '../../types';
import { AuthContextType, AuthContext } from '../../navigation';
import { getProfile, updateProfile } from '../../services';
import { format } from 'date-fns';

type RootStackNavigationProp = NativeStackNavigationProp<DrawerParamList>;

const dateFormatBuilder = (date: string | undefined) => {
  if (!date) {
    return '';
  } else {
    return format(new Date(date), 'dd/MM/yyy');
  }
};

export const Profile = () => {
  const auth = useContext<AuthContextType | undefined>(AuthContext);
  if (!auth) {
    throw new Error('SignIn must be used within an AuthProvider');
  }
  const { user, refreshUser } = auth;
  if (user === null) {
    throw new Error('User not found');
  }
  const navigation = useNavigation<RootStackNavigationProp>();

  const [profile, setProfile] = useState<User>();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentProfile = await getProfile(user._id);
        setProfile(currentProfile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleEditGoalWeight = () => {
    navigation.navigate('EditWeight', {
      onSave: (newWeightKg: number) => {
        console.log('Received from child:', newWeightKg);
        // your update logic
      },
    });
  };

  const handleEditCurrentWeight = () => {
    navigation.navigate('EditWeight', {
      onSave: (newWeightKg: number) => {
        console.log('Received from child:', newWeightKg);
        // your update logic
      },
    });
  };

  const handleEditHeight = () => {
    navigation.navigate('EditHeight', {
      currentHeight: profile?.height,
      onSave: async (newHeightCm: number) => {
        console.log('Received from child:', newHeightCm);
        try {
          const updatedUser = { ...user, height: newHeightCm };
          await updateProfile(updatedUser);
          setProfile(updatedUser);
          refreshUser(updatedUser);
          return 'ok';
        } catch (error) {
          console.log(error);
          Alert.alert('Error', 'Error saving new height');
        }
      },
    });
  };

  const handleBirthdate = () => {
    navigation.navigate('EditBirthdate', {
      currentBirthdate: profile?.birthday,
      onSave: async (newDate: string) => {
        console.log('Received from child:', newDate);
        try {
          const updatedUser = { ...user, birthday: newDate };
          await updateProfile(updatedUser);
          setProfile(updatedUser);
          refreshUser(updatedUser);
          return 'ok';
        } catch (error) {
          console.log(error);
          Alert.alert('Error', 'Error saving new height');
        }
      },
    });
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.goalRow}>
          <View>
            <Text style={styles.label}>Goal Weight</Text>
            <Text style={styles.value}>85 kg</Text>
          </View>
          <Button
            title="Change Goal"
            buttonStyle={styles.changeGoalButton}
            titleStyle={styles.changeGoalButtonText}
            onPress={handleEditGoalWeight}
          />
        </View>
      </View>

      <View style={styles.card}>
        {/* <Pressable onPress={() => navigation.navigate('EditWeight')}> */}
        <Pressable onPress={handleEditCurrentWeight}>
          <View style={styles.itemRow}>
            <Text style={styles.label}>Current weight</Text>
            <Text style={styles.value}>90 kg</Text>
          </View>
        </Pressable>
        <View style={styles.separator} />

        <Pressable onPress={handleEditHeight}>
          <View style={styles.itemRow}>
            <Text style={styles.label}>Height</Text>
            <Text style={styles.value}>{profile?.height || ''} cm</Text>
          </View>
        </Pressable>
        <View style={styles.separator} />

        <Pressable onPress={handleBirthdate}>
          <View style={styles.itemRow}>
            <Text style={styles.label}>Date of birth</Text>
            <Text style={styles.value}>
              {dateFormatBuilder(profile?.birthday)}
            </Text>
          </View>
        </Pressable>
        <View style={styles.separator} />

        <View style={styles.itemRow}>
          <Text style={styles.label}>Gender</Text>
          <Text style={styles.value}>Male</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F2F2F2', // gray background
  },
  container: {
    paddingTop: 64,
    paddingHorizontal: 20,
    paddingBottom: 40,
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
