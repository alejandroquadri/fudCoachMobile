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

interface TriedOtherAppsScreenProps {
  initialValue?: boolean;
  onSave: (tried: boolean) => void;
  onBack: () => void;
  showProgressBar?: boolean;
  step?: number;
  totalSteps?: number;
}

export const TriedOtherAppsScreen = ({
  initialValue = true,
  onSave,
  onBack,
  showProgressBar = false,
  step = 0,
  totalSteps = 0,
}: TriedOtherAppsScreenProps) => {
  const [selectedOption, setSelectedOption] = useState<boolean>(initialValue);

  const handleSave = () => {
    if (selectedOption !== null) {
      onSave(selectedOption);
    }
  };

  const renderOption = (value: boolean, label: string) => {
    const selected = selectedOption === value;
    return (
      <TouchableOpacity
        key={String(value)}
        style={[styles.option, selected && styles.optionSelected]}
        onPress={() => setSelectedOption(value)}>
        <Text
          style={[styles.optionText, selected && styles.optionTextSelected]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
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
        <Text style={styles.title}>Did you try other nutrition apps?</Text>

        <View style={styles.optionsContainer}>
          {renderOption(true, 'Yes')}
          {renderOption(false, 'No')}
        </View>
      </View>

      <Button
        title="Next"
        onPress={handleSave}
        disabled={selectedOption === null}
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
    height: 30,
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
