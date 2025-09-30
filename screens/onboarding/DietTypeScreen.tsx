import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { StepProgressBar } from '@components';
import { COLORS, SharedStyles } from '@theme';

interface DietTypeProps {
  initialValue?: string;
  onSave: (dietType: string) => void;
  onBack: () => void;
  showProgressBar?: boolean;
  step?: number;
  totalSteps?: number;
}

export const DietTypeScreen = ({
  initialValue = '',
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

  const renderOption = (value: string) => {
    const selected = selectedDietType === value;
    return (
      <TouchableOpacity
        key={value}
        style={[styles.optionButton, selected && styles.optionSelectedButton]}
        onPress={() => setSelectedDietType(value)}>
        <Text
          style={[styles.optionText, selected && styles.optionTextSelected]}>
          {value}
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
          {renderOption('Classic')}
          {renderOption('Vegetarian')}
          {renderOption('Vegan')}
          {renderOption('Pescatarian')}
          {renderOption('Keto')}
          {renderOption('Low carb')}
          {renderOption('Paleo')}
        </View>
      </View>

      <Button
        title="Next"
        onPress={handleSave}
        disabled={!selectedDietType}
        buttonStyle={styles.nextButton}
        titleStyle={styles.nextButtonText}
      />
    </ScrollView>
  );
};
