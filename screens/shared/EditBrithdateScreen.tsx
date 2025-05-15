import React, { useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Button } from '@rneui/themed';
import RNDateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { DrawerParamList } from '@types';

export const EditBirthdateScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<DrawerParamList, 'EditBirthdate'>>();
  const { currentBirthdate, onSave } = route.params;

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(currentBirthdate || '1990-01-01')
  );

  const handleSave = () => {
    // tener en cuenta que si uno hace console log y quiere imprimir una fehca la consola no la muestra
    const formatDate = format(selectedDate, 'yyyy-MM-dd');
    if (onSave) onSave(formatDate);
    navigation.goBack();
  };

  const handleChange = (event: DateTimePickerEvent, date?: Date) => {
    const dateTs = date ? date : new Date(event.nativeEvent.timestamp);
    setSelectedDate(dateTs);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Birthdate</Text>

      <RNDateTimePicker
        value={selectedDate}
        mode="date"
        display="spinner"
        maximumDate={today}
        onChange={handleChange}
        style={styles.datePicker}
      />

      <Button
        title="Save changes"
        buttonStyle={styles.saveButton}
        titleStyle={styles.saveButtonText}
        onPress={handleSave}
      />
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 64,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
  },
  datePicker: {
    width: '70%',
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 24,
    marginTop: 'auto',
    marginBottom: 32,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
