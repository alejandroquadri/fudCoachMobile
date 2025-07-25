import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCurrentUser } from '@navigation';
import { ProfileStackParamList } from './ProfileStack';
import { updateProfile } from '@services';
import { Button, Icon, Input } from '@rneui/themed';
import { COLORS, SharedStyles } from '@theme';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditNameScreen'>;

export const EditNameScreen = ({ navigation }: Props) => {
  const user = useCurrentUser();
  const styles = SharedStyles();
  const [name, setName] = useState(user.name ?? '');
  const [nameError, setNameError] = useState('');
  const [nameBlurred, setNameBlurred] = useState(false);

  const validateName = (value: string) => {
    if (value.trim() === '') {
      setNameError('Name cannot be empty');
    } else {
      setNameError('');
    }
  };

  const handleSave = async () => {
    validateName(name);
    if (name.trim() === '') return;

    try {
      const updated = { ...user, name: name.trim() };
      await updateProfile(updated);
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Could not update name');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

      <View style={editNameStyles.container}>
        <View style={editNameStyles.inputContainer}>
          <Input
            placeholder="Name"
            value={name}
            onChangeText={value => {
              setName(value);
              validateName(value);
            }}
            onBlur={() => setNameBlurred(true)}
            errorMessage={nameBlurred && nameError ? nameError : ''}
          />
        </View>
        <Button
          title="Save"
          onPress={handleSave}
          buttonStyle={styles.nextButton}
          disabled={!!nameError || name.trim() === ''}
        />
      </View>
    </ScrollView>
  );
};

const editNameStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 90,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 50,
  },
});
