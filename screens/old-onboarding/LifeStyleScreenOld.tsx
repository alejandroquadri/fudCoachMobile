import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '@rneui/themed';
import { useRegistration } from '../../navigation/RegistrationContext';
import { RootStackParamList } from '../../types';

interface LifeStyle {
  value: number;
  label: string;
}

type LifeStyleScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'LifeStyle'
>;

export const LifeStyleScreenOld: React.FC<LifeStyleScreenProps> = ({
  navigation,
}) => {
  const { registrationData, setRegistrationData } = useRegistration();

  const [_lifestyle, setLifestyle] = useState({} as LifeStyle);

  const lifeStyleVal = [
    {
      value: 1.2,
      label: 'Mainly sitting',
    },
    {
      value: 1.375,
      label: 'Some time on feet',
    },
    {
      value: 1.55,
      label: 'Majority on feet',
    },
    {
      value: 1.725,
      label: 'High physical activity',
    },
  ];

  const handleLifestyleSelect = (selectedLifestyle: LifeStyle) => {
    setLifestyle(selectedLifestyle);
    // You can also perform other actions on lifestyle select, like navigation or API calls
    setRegistrationData({
      ...registrationData,
      lifestyle: selectedLifestyle.value,
    });
    navigation.navigate('WeightGoal');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>
        Which of the following best describes your daily lifestyle?
      </Text>
      {lifeStyleVal.map((lifestyle, index) => (
        <Button
          key={index}
          title={lifestyle.label}
          onPress={() => handleLifestyleSelect(lifestyle)}
          containerStyle={styles.buttonContainer}
        />
      ))}
      {/* <Button
        title="Mainly sitting"
        onPress={() => handleLifestyleSelect('Mainly sitting')}
        containerStyle={styles.buttonContainer}
      />
      <Button
        title="Some time on feet"
        onPress={() => handleLifestyleSelect('Some time on feet')}
        containerStyle={styles.buttonContainer}
      />
      <Button
        title="Majority on feet"
        onPress={() => handleLifestyleSelect('Majority on feet')}
        containerStyle={styles.buttonContainer}
      />
      <Button
        title="High physical activity"
        onPress={() => handleLifestyleSelect('High physical activity')}
        containerStyle={styles.buttonContainer}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginVertical: 5,
  },
  container: {
    alignItems: 'stretch',
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 40,
    marginTop: 30,
    textAlign: 'center',
  },
});

export default LifeStyleScreenOld;
