import { StepProgressBar } from '@components';
import RNDateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Button, Icon } from '@rneui/themed';
import { COLORS, SharedStyles } from '@theme';
import { format } from 'date-fns';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface BirthdateProps {
  initialValue?: string;
  onSave: (birthDate: string) => void;
  onBack: () => void;
  showProgressBar?: boolean;
  step?: number;
  totalSteps?: number;
  standAlone?: boolean;
}

export const BirthdateScreen = ({
  initialValue,
  onSave,
  onBack,
  showProgressBar = false,
  step = 0,
  totalSteps = 0,
  standAlone = false,
}: BirthdateProps) => {
  const styles = SharedStyles();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(initialValue || '1990-01-01')
  );

  const handleSave = () => {
    // tener en cuenta que si uno hace console log y quiere imprimir una fehca la consola no la muestra
    const formatDate = format(selectedDate, 'yyyy-MM-dd');
    if (onSave) onSave(formatDate);
    // navigation.goBack();
  };

  const handleChange = (event: DateTimePickerEvent, date?: Date) => {
    const dateTs = date ? date : new Date(event.nativeEvent.timestamp);
    setSelectedDate(dateTs);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={onBack}>
            <Icon
              name="chevron-left"
              type="feather"
              size={28}
              color={COLORS.primaryColor}
            />
          </TouchableOpacity>
        </View>

        {showProgressBar && (
          <View style={styles.progressBar}>
            <StepProgressBar step={step} totalSteps={totalSteps} />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>When where you born?</Text>
        <Text style={styles.subtitle}>
          We will use it to calibrate your personalized plan
        </Text>

        <View style={birthdateStyles.container}>
          <RNDateTimePicker
            value={selectedDate}
            mode="date"
            display="spinner"
            maximumDate={today}
            onChange={handleChange}
            style={birthdateStyles.datePicker}
          />
        </View>
      </View>

      <Button
        title={standAlone ? 'Save' : 'Next'}
        onPress={handleSave}
        // disabled={!selectedActivity}
        buttonStyle={styles.nextButton}
        titleStyle={styles.nextButtonText}
      />
    </ScrollView>
  );
};

const birthdateStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  datePicker: {
    width: '70%',
    marginBottom: 24,
  },
});
