import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { StepProgressBar } from '@components';
import { COLORS, SharedStyles } from '@theme';

interface DietTypeProps {
  initialValue?: number;
  onSave: (trainingFrequency: number) => void;
  onBack: () => void;
  showProgressBar?: boolean;
  step?: number;
  totalSteps?: number;
}

export const DietTypeScreen = ({
  initialValue = 0,
  onSave,
  onBack,
  showProgressBar = false,
  step = 0,
  totalSteps = 0,
}: DietTypeProps) => {
  const styles = SharedStyles();

  const [selectedDietType, setSelectedDietType] = useState(initialValue);

  const handleSave = () => {
    if (selectedDietType !== null) {
      onSave(selectedDietType);
    }
  };

  const renderOption = (value: number, label: string, option?: string) => {
    const selected = selectedDietType === value;
    return (
      <TouchableOpacity
        key={value}
        style={[styles.optionButton, selected && styles.optionSelectedButton]}
        onPress={() => setSelectedDietType(value)}>
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
        <Text style={styles.titleNoSub}>
          What holds you back from achieving your goals?
        </Text>

        <View style={styles.optionsContainer}>
          {renderOption(0, 'Classic')}
          {renderOption(1, 'Vegetarian')}
          {renderOption(2, 'Vegan')}
          {renderOption(3, 'Pescatarian')}
          {renderOption(4, 'Keto')}
          {renderOption(5, 'Low carb')}
          {renderOption(6, 'Paleo')}
        </View>
      </View>

      <Button
        title="Next"
        onPress={handleSave}
        disabled={selectedDietType === null}
        buttonStyle={styles.nextButton}
        titleStyle={styles.nextButtonText}
      />
    </ScrollView>
  );
};
