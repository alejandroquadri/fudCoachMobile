import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button, ButtonGroup, Text } from '@rneui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../theme';
import { MaskedTextInput } from 'react-native-mask-text';

interface RouteParams {
  token: string;
  refreshToken: string;
}

interface Props {
  route: {
    params: RouteParams;
  };
}

export const CompleteProfileScreen: React.FC<Props> = ({ route }) => {
  const { token, refreshToken } = route.params;

  // const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [birthdate, setBirthdate] = useState(new Date());
  const buttons = ['Male', 'Female'];
  const [gender, setGender] = useState(0);
  const [selectedWeightUnit, setSelectedWeightUnit] = useState(0); // 0 for lbs, 1 for gk
  const [selectedHeightUnit, setSelectedHeightUnit] = useState(0); // 0 for feet, 1 for cm
  const unitsWeight = ['lbs', 'kg'];
  const unitsHeight = ['feet', 'cm'];

  useEffect(() => {
    console.log(token, refreshToken);
  }, [token, refreshToken]);

  const handleCompleteProfile = () => {
    // Handle the complete profile logic here
    console.log(buttons[gender], weight, height, birthdate);
  };

  const onDateChange = (_event: unknown, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || birthdate;
    setBirthdate(currentDate);
  };

  return (
    <View style={styles.container}>
      <ButtonGroup
        onPress={setGender}
        selectedIndex={gender}
        buttons={buttons}
        containerStyle={styles.buttonGroup}
      />
      <View style={styles.weightContainer}>
        <Input
          placeholder="Weight"
          containerStyle={styles.inputContainer}
          inputContainerStyle={styles.inputInnerContainer}
          onChangeText={value => setWeight(value)}
          value={weight}
          keyboardType="numeric"
          renderErrorMessage={false}
        />
        <ButtonGroup
          buttons={unitsWeight}
          containerStyle={styles.buttonGroupContainer}
          selectedIndex={selectedWeightUnit}
          onPress={value => {
            setWeight('');
            setSelectedWeightUnit(value);
          }}
        />
      </View>
      <View style={styles.weightContainer}>
        <MaskedTextInput
          mask={selectedHeightUnit === 1 ? "9' 99" : '999'} // Adjust mask based on selected unit
          onChangeText={(masked, unmasked) => {
            console.log(masked); // Formatted text
            // console.log(unmasked); // Raw text
            setHeight(masked);
          }}
          value={height}
          keyboardType="numeric"
          placeholder="Height"
          style={styles.inputMask}
          // style={styles.input}
        />
        <ButtonGroup
          buttons={unitsHeight}
          containerStyle={styles.buttonGroupContainer}
          selectedIndex={selectedHeightUnit}
          onPress={value => {
            setHeight('');
            setSelectedHeightUnit(value);
          }}
        />
      </View>
      <View>
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
      <Button
        title="Complete Profile"
        containerStyle={styles.submitButton}
        onPress={handleCompleteProfile}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    marginBottom: 15,
  },
  buttonGroupContainer: {
    flex: 1, // Adjust the flex ratio as needed
    marginBottom: 10,
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
  datePickerLabel: {
    color: COLORS.black,
    fontSize: 18,
    marginBottom: 5,
    marginLeft: 10,
  },
  inputContainer: {
    flex: 2, // Adjust the flex ratio as needed
    marginRight: 5, // Optional: add some margin between the input and buttons
  },
  inputInnerContainer: {
    // Adjust if you need to style the inner container of the input
  },
  inputMask: {
    // borderWidth: 1,
    borderBottomColor: COLORS.black,
    borderBottomWidth: 1,
    flex: 2,
    fontSize: 18,
    height: 30,
    margin: 12,
  },
  submitButton: {
    marginTop: 30,
  },
  weightContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
