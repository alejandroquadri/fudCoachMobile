import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { StepProgressBar } from '@components';
import { Button, Icon } from '@rneui/themed';
import { COLORS } from '@theme';

interface GenderScreenProps {
  initialValue?: string;
  onSave: (gender: string) => void;
  onBack: () => void;
  showProgressBar?: boolean;
  step?: number;
  totalSteps?: number;
}

export const EditGenderScreen = ({
  initialValue = '',
  onSave,
  onBack,
  showProgressBar = false,
  step = 0,
  totalSteps = 0,
}: GenderScreenProps) => {
  const [selectedGender, setSelectedGender] = useState(initialValue);

  const handleSave = () => {
    if (selectedGender) {
      onSave(selectedGender);
    }
  };

  const renderOption = (value: string, label: string) => {
    const selected = selectedGender === value;
    return (
      <TouchableOpacity
        key={value}
        style={[styles.option, selected && styles.optionSelected]}
        onPress={() => setSelectedGender(value)}>
        <Text
          style={[styles.optionText, selected && styles.optionTextSelected]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Optional back button */}
      {/* <OnboardingHeader /> */}
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
        <Text style={styles.title}>Choose your gender</Text>
        <Text style={styles.subtitle}>
          We will use it to calibrate your personalized plan
        </Text>

        <View style={styles.optionsContainer}>
          {renderOption('male', 'Masculino')}
          {renderOption('female', 'Femenino')}
          {renderOption('other', 'Otro')}
        </View>
      </View>

      <Button
        title="Next"
        onPress={handleSave}
        disabled={!selectedGender}
        buttonStyle={styles.nextButton}
        titleStyle={styles.nextButtonText}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  header: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 30, // same as the progress bar's visual height
    marginRight: 12,
  },
  progressBar: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.subText,
    marginBottom: 30,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    gap: 12,
  },
  option: {
    backgroundColor: COLORS.backgroundColor,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: COLORS.primaryColor,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.primaryColor,
  },
  optionTextSelected: {
    color: COLORS.primaryContrast,
    fontWeight: 'bold',
  },
  nextButton: {
    borderRadius: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.primaryColor,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
