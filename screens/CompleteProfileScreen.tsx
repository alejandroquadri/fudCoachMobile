import { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, ButtonGroup, Input, Text } from '@rneui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaskedTextInput } from 'react-native-mask-text';
import { useRegistration } from '../navigation/RegistrationContext';

import { COLORS } from '../theme';
import { RootStackParamList } from '../navigation';
import {
  convertCentimetersToFeet,
  convertFeetToCentimeters,
  convertKilogramsToPounds,
  convertPoundsToKilograms,
  round,
} from '../services';

type CompleteScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Profile'
>;

export const CompleteProfileScreen: React.FC<CompleteScreenProps> = ({
  navigation,
}) => {
  const { registrationData, setRegistrationData } = useRegistration();

  const [weight, setWeight] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
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

  const validateWeight = (weight: string) => {
    if (weight.trim() === '') {
      setWeightError(true);
    } else {
      setWeightError(false);
    }
  };

  const validateHeightCm = (height: string) => {
    if (height.trim() === '') {
      setHeightError(true);
    } else {
      setHeightError(false);
    }
  };

  const validateHeightFt = (height: string) => {
    if (height.trim() === '' || heightIn.trim() === '') {
      setHeightError(true);
    } else {
      setHeightError(false);
    }
  };

  const validateHeightIn = (height: string) => {
    if (heightFt.trim() === '' || height.trim() === '') {
      setHeightError(true);
    } else {
      setHeightError(false);
    }
  };

  const handleWeightUnitChange = (selectedIndex: number) => {
    if (weight) {
      const numericWeight = round(Number(weight), 2);
      let convertedWeight = numericWeight;

      if (selectedIndex === 0 && selectedWeightUnit === 1) {
        // Convert from kg to lbs
        convertedWeight = convertKilogramsToPounds(numericWeight);
      } else if (selectedIndex === 1 && selectedWeightUnit === 0) {
        // Convert from lbs to kg
        convertedWeight = convertPoundsToKilograms(numericWeight);
      }
      // Update state with converted weight

      setWeight(round(convertedWeight, 2).toString()); // Rounds to 2 decimal places
    }

    setSelectedWeightUnit(selectedIndex);
  };

  const handleHeightUnitChange = (selectedIndex: number) => {
    if (selectedIndex === 0 && heightCm) {
      // Convert cm to feet/inches
      const { feet, inches } = convertCentimetersToFeet(Number(heightCm));

      setHeightFt(feet.toString());
      setHeightIn(inches.toString());
    } else if (selectedIndex === 1 && heightFt && heightIn) {
      // Convert feet/inches to cm
      let cm = convertFeetToCentimeters(Number(heightFt), Number(heightIn));
      cm = round(cm, 2);
      setHeightCm(cm.toString());
    }
    setSelectedHeightUnit(selectedIndex);
  };

  const handleCompleteProfile = async () => {
    setLoading(true);
    try {
      const finalWeight =
        selectedWeightUnit === 1
          ? Number(weight)
          : round(convertPoundsToKilograms(Number(weight)), 2);

      const finalHeight =
        selectedHeightUnit === 1
          ? Number(heightCm)
          : round(
              convertFeetToCentimeters(Number(heightFt), Number(heightIn)),
              2
            );

      setRegistrationData({
        ...registrationData,
        birthdate,
        gender: genderOpts[gender],
        weight: finalWeight,
        weightUnit: unitsWeight[selectedWeightUnit],
        height: finalHeight,
        heightUnit: unitsHeight[selectedHeightUnit],
      });
      navigation.navigate('LifeStyle');
    } catch (error) {
      console.log(error);

      Alert.alert('Error', 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
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
            <Input
              onChangeText={weight => {
                setWeight(weight);
                validateWeight(weight);
              }}
              keyboardType="number-pad"
              placeholder="Weight"
              renderErrorMessage={false}
              containerStyle={styles.weightInputCont}
              inputContainerStyle={styles.weightInputContStyle}
              value={weight.toString()}
            />
            <ButtonGroup
              buttons={unitsWeight}
              containerStyle={styles.unitsButtonGroupContainer}
              selectedIndex={selectedWeightUnit}
              onPress={handleWeightUnitChange}
            />
          </View>
          <View style={styles.measuresContainer}>
            {selectedHeightUnit === 0 ? (
              <View style={styles.heightWrapperContainer}>
                <Input
                  containerStyle={[
                    styles.heightInputCont,
                    styles.feetInputContStyle,
                  ]}
                  inputContainerStyle={styles.heightInputContStyle}
                  value={heightFt}
                  onChangeText={value => {
                    setHeightFt(value);
                    validateHeightFt(value);
                  }}
                  keyboardType="numeric"
                  placeholder="Feet"
                />
                <Input
                  containerStyle={[
                    styles.heightInputCont,
                    styles.inchInputContStyle,
                  ]}
                  inputContainerStyle={styles.heightInputContStyle}
                  value={heightIn}
                  onChangeText={value => {
                    setHeightIn(value);
                    validateHeightIn(value);
                  }}
                  keyboardType="numeric"
                  placeholder="Inches"
                />
              </View>
            ) : (
              <MaskedTextInput
                mask={selectedHeightUnit === 0 ? "9' 99" : '999'} // Adjust mask based on selected unit
                onChangeText={(masked, _unmasked) => {
                  setHeightCm(masked);
                  validateHeightCm(masked);
                }}
                value={heightCm}
                keyboardType="number-pad"
                placeholder="Height"
                style={styles.inputMask}
              />
            )}
            <ButtonGroup
              buttons={unitsHeight}
              containerStyle={styles.unitsButtonGroupContainer}
              selectedIndex={selectedHeightUnit}
              onPress={handleHeightUnitChange}
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
          title="Next"
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
  feetInputContStyle: {
    marginStart: 0,
  },
  heightInputCont: {
    backgroundColor: COLORS.lightGrey,
    borderBottomWidth: 0,
    borderColor: COLORS.transparent,
    borderRadius: 10,
    borderWidth: 0,
    color: COLORS.fontGrey,
    flex: 1,
    fontSize: 18,
    height: 40,
    // marginStart: 10,
    marginVertical: 5,
    paddingStart: 10,
    // width: 80,
  },
  heightInputContStyle: {
    borderBottomWidth: 0,
  },
  heightWrapperContainer: {
    flexDirection: 'row',
    marginStart: 10,
    width: 200,
  },
  inchInputContStyle: {
    marginStart: 10,
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
  weightInputCont: {
    backgroundColor: COLORS.lightGrey,
    borderBottomWidth: 0,
    borderColor: COLORS.transparent,
    borderRadius: 10,
    borderWidth: 0,
    color: COLORS.fontGrey,
    fontSize: 18,
    height: 40,
    marginStart: 10,
    marginVertical: 5,
    paddingStart: 10,
    width: 200,
  },
  weightInputContStyle: {
    borderBottomWidth: 0,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
});
