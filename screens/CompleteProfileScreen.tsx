import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button, ButtonGroup, Text } from '@rneui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../theme';

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
  const [selectedWeightUnit, setSelectedWeightUnit] = useState(0); // 0 for kg, 1 for lbs
  const [selectedHeightUnit, setSelectedHeightUnit] = useState(0); // 0 for cm, 1 for inches
  const unitsWeight = ['kg', 'lbs'];
  const unitsHeight = ['cm', 'inches'];

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
      {/* <Input
        placeholder="Weight"
        onChangeText={value => setWeight(value)}
        value={weight}
      /> */}
      <View style={styles.weightContainer}>
        <Input
          placeholder="Weight"
          containerStyle={styles.inputContainer}
          inputContainerStyle={styles.inputInnerContainer}
          onChangeText={value => setWeight(value)}
          value={weight}
          keyboardType="numeric"
        />
        <ButtonGroup
          buttons={unitsWeight}
          containerStyle={styles.buttonGroupContainer}
          selectedIndex={selectedWeightUnit}
          onPress={setSelectedWeightUnit}
        />
      </View>
      <View style={styles.weightContainer}>
        <Input
          placeholder="Height"
          containerStyle={styles.inputContainer}
          inputContainerStyle={styles.inputInnerContainer}
          onChangeText={value => setHeight(value)}
          value={height}
          keyboardType="numeric"
        />
        <ButtonGroup
          buttons={unitsHeight}
          containerStyle={styles.buttonGroupContainer}
          selectedIndex={selectedHeightUnit}
          onPress={setSelectedHeightUnit}
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
    marginBottom: 30,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  datePicker: {
    backgroundColor: COLORS.transparent,
    height: 200,
    // marginHorizontal: 30,
    // flex: 1, // Adjust as needed for proper sizing
  },
  datePickerLabel: {
    color: COLORS.black,
    fontSize: 16,
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
  submitButton: {
    marginTop: 30,
  },
  weightContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  // inlineContainer: {
  //   alignItems: 'center',
  //   flexDirection: 'row',
  //   marginBottom: 15,
  // },
});
