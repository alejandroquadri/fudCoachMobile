import { useState, useContext } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Button, ButtonGroup, Text } from '@rneui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';

import { AuthContext, AuthContextType } from '../navigation/Authcontext';
import { COLORS } from '../theme';
import { userAPI } from '../api';
import { MaskedTextInput } from 'react-native-mask-text';

interface RouteParams {
  name: string;
  email: string;
  password: string;
}

interface Props {
  route: {
    params: RouteParams;
  };
}

export const CompleteProfileScreen: React.FC<Props> = ({ route }) => {
  const { name, email, password } = route.params;

  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [birthdate, setBirthdate] = useState(new Date());
  const genderOpts = ['Male', 'Female'];
  const [gender, setGender] = useState(0);
  const [selectedWeightUnit, setSelectedWeightUnit] = useState(0); // 0 for lbs, 1 for gk
  const [selectedHeightUnit, setSelectedHeightUnit] = useState(0); // 0 for feet, 1 for cm
  const unitsWeight = ['lbs', 'kg'];
  const unitsHeight = ['feet', 'cm'];
  const [weightError, setWeightError] = useState(true);
  const [heightError, setHeightError] = useState(true);
  const [loading, setLoading] = useState(false);

  const auth = useContext<AuthContextType | undefined>(AuthContext);

  if (!auth) {
    throw new Error('SignIn must be used within an AuthProvider');
  }

  const { signUp } = auth;

  const validateWeight = (weight: string) => {
    if (weight.trim() === '') {
      setWeightError(true);
    } else {
      setWeightError(false);
    }
  };

  const validateHeight = (height: string) => {
    if (height.trim() === '') {
      setHeightError(true);
    } else {
      setHeightError(false);
    }
  };

  const handleCompleteProfile = async () => {
    setLoading(true);
    try {
      const response = await userAPI.signUpEmailPass(email, password, {
        name,
        birthdate,
        weight,
        height,
        weightUnit: unitsWeight[selectedWeightUnit],
        heightUnit: unitsHeight[selectedHeightUnit],
        gender: genderOpts[gender],
      });
      const token = response.token;
      const refreshToken = response.refreshToken;
      const profile = response.user;
      signUp(token, refreshToken, profile);
    } catch (error) {
      console.log(error);

      Alert.alert('Error', 'Failed to sign in. Please check your credentials.');
    } finally {
      // setLoading(false);
    }
  };

  const onDateChange = (_event: unknown, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || birthdate;
    setBirthdate(currentDate);
  };

  return (
    <View style={styles.wrapper}>
      {loading ? (
        <ActivityIndicator
          style={styles.spinner}
          size="large"
          color={COLORS.black}
        />
      ) : (
        <View style={styles.container}>
          <ButtonGroup
            onPress={setGender}
            selectedIndex={gender}
            buttons={genderOpts}
          />
          <View style={styles.measuresContainer}>
            <MaskedTextInput
              mask={'999'} // Adjust mask based on selected unit
              onChangeText={(masked, _unmasked) => {
                setWeight(masked);
                validateWeight(masked);
              }}
              value={weight}
              keyboardType="number-pad"
              placeholder="Weight"
              style={styles.inputMask}
            />
            <ButtonGroup
              buttons={unitsWeight}
              containerStyle={styles.unitsButtonGroupContainer}
              selectedIndex={selectedWeightUnit}
              onPress={value => {
                setWeight('');
                setSelectedWeightUnit(value);
              }}
            />
          </View>
          <View style={styles.measuresContainer}>
            <MaskedTextInput
              mask={selectedHeightUnit === 0 ? "9' 99" : '999'} // Adjust mask based on selected unit
              onChangeText={(masked, _unmasked) => {
                setHeight(masked);
                validateHeight(masked);
              }}
              value={height}
              keyboardType="number-pad"
              placeholder="Height"
              style={styles.inputMask}
            />
            <ButtonGroup
              buttons={unitsHeight}
              containerStyle={styles.unitsButtonGroupContainer}
              selectedIndex={selectedHeightUnit}
              onPress={value => {
                setHeight('');
                setSelectedHeightUnit(value);
              }}
            />
          </View>
          <View style={styles.datePickerContainer}>
            <Text style={styles.datePickerLabel}>Birthdate:</Text>
            <DateTimePicker
              testID="dateTimePicker"
              value={birthdate}
              mode="date"
              display="spinner"
              onChange={onDateChange}
              style={styles.datePicker}
            />
          </View>
        </View>
      )}
      <View style={styles.btnContainer}>
        <Button
          title="Sign up"
          containerStyle={styles.submitButton}
          onPress={handleCompleteProfile}
          disabled={weightError || heightError}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    padding: 18,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 18,
  },
  datePicker: {
    backgroundColor: COLORS.transparent,
    height: 200,
    // marginHorizontal: 30,
    // flex: 1, // Adjust as needed for proper sizing
  },
  datePickerContainer: {
    marginTop: 30,
  },
  datePickerLabel: {
    color: COLORS.fontGrey,
    fontSize: 18,
    marginBottom: 5,
    marginLeft: 10,
    paddingStart: 5,
  },
  inputMask: {
    backgroundColor: COLORS.lightGrey,
    borderBottomWidth: 0,
    borderRadius: 10,
    color: COLORS.fontGrey,
    fontSize: 18,
    height: 40,
    marginStart: 10,
    marginVertical: 5,
    paddingStart: 10,
    width: 200,
  },
  measuresContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginTop: 20,
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
  },
  submitButton: {
    marginTop: 30,
  },
  unitsButtonGroupContainer: {
    flex: 1, // Adjust the flex ratio as needed
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
});
