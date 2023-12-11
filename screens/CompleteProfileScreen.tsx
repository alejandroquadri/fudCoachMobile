import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button, ButtonGroup } from '@rneui/themed';

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

  const [age, setAge] = useState('');
  // const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const buttons = ['Male', 'Female'];
  const [gender, setGender] = useState(0);

  useEffect(() => {
    console.log(token, refreshToken);
  }, [token, refreshToken]);

  const handleCompleteProfile = () => {
    // Handle the complete profile logic here
    console.log(age, gender, weight, height, birthdate);
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Age"
        onChangeText={value => setAge(value)}
        value={age}
      />
      {/* <Input
        placeholder="Gender"
        onChangeText={value => setGender(value)}
        value={gender}
      /> */}
      <ButtonGroup
        onPress={setGender}
        selectedIndex={gender}
        buttons={buttons}
      />
      <Input
        placeholder="Weight"
        onChangeText={value => setWeight(value)}
        value={weight}
      />
      <Input
        placeholder="Height"
        onChangeText={value => setHeight(value)}
        value={height}
      />
      <Input
        placeholder="Birthdate"
        onChangeText={value => setBirthdate(value)}
        value={birthdate}
      />
      <Button title="Complete Profile" onPress={handleCompleteProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
});
