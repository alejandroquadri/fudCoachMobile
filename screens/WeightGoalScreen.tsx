import { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert, ActivityIndicator } from 'react-native';
import { Button, ButtonGroup } from '@rneui/themed';
import { useRegistration, AuthContext, AuthContextType } from '../navigation';
import { userAPI } from '../api';
import { COLORS } from '../theme';

interface WeightGoal {
  value: number;
  lb: string;
  kg: string;
}

export const WeightGoalScreen = () => {
  const { registrationData, setRegistrationData } = useRegistration();
  console.log(registrationData);
  const [loading, setLoading] = useState(false);
  const [weightUnit, setWeightUnit] = useState(0); // 0 for lb, 1 for kg
  const [weightGoal, setWeightGoal] = useState({} as WeightGoal);

  const weightGoalVal = [
    { value: 0.5, lb: 'Gain 1 lb per week', kg: 'Gain 1/2 kg per week' },
    { value: 0.25, lb: 'Gain 1/2 lb per week', kg: 'Gain 1/4 kg per week' },
    { value: 0, lb: 'Maintain weight', kg: 'Maintain weight' },
    { value: -0.25, lb: 'Lose 1/2 lb per week', kg: 'Lose 1/4 kg per week' },
    { value: -0.5, lb: 'Lose 1 lb per week', kg: 'Lose 1/2 kg per week' },
  ];

  const auth = useContext<AuthContextType | undefined>(AuthContext);

  if (!auth) {
    throw new Error('SignIn must be used within an AuthProvider');
  }
  const { signUp } = auth;

  useEffect(() => {
    if (registrationData.weightUnit !== undefined) {
      const unit = registrationData.weightUnit === 'lbs' ? 0 : 1;
      setWeightUnit(unit);
    }
  }, [registrationData.weightUnit]);

  const handleWeightGoalSelect = async (selectedGoal: WeightGoal) => {
    setWeightGoal(selectedGoal);
    setRegistrationData({
      ...registrationData,
      weightGoal: selectedGoal.value,
    });
    console.log(registrationData);
    setLoading(true);
    try {
      const response = await userAPI.signUpEmailPass(registrationData);
      const token = response.token;
      const refreshToken = response.refreshToken;
      const profile = response.user;
      signUp(token, refreshToken, profile);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // falta el laoding!!!
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
          <Text style={styles.questionText}>
            What is your goal for weight gain/loss? Remember slower change plans
            are healthier and more sustainable.
          </Text>
          <ButtonGroup
            buttons={['lb', 'kg']}
            selectedIndex={weightUnit}
            onPress={selectedIndex => setWeightUnit(selectedIndex)}
            containerStyle={styles.buttonGroupContainer}
          />
          {weightGoalVal.map((goal, index) => (
            <Button
              key={index}
              title={weightUnit === 0 ? goal.lb : goal.kg}
              onPress={() => handleWeightGoalSelect(goal)}
              containerStyle={styles.buttonContainer}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginVertical: 5,
  },
  buttonGroupContainer: {
    marginBottom: 30,
  },
  container: {
    alignItems: 'stretch',
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 20,
    marginTop: 30,
    textAlign: 'center',
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
});

export default WeightGoalScreen;
