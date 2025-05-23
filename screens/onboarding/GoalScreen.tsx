import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { StepProgressBar } from '@components';
import { COLORS, SharedStyles } from '@theme';

interface GoalScreenProps {
  initialValue?: number;
  onSave: (goal: number) => void;
  onBack: () => void;
  showProgressBar?: boolean;
  step?: number;
  totalSteps?: number;
}

export const GoalScreen = ({
  initialValue = 0,
  onSave,
  onBack,
  showProgressBar = false,
  step = 0,
  totalSteps = 0,
}: GoalScreenProps) => {
  const styles = SharedStyles();

  const [selectedGoal, setSelectedGoal] = useState(initialValue);

  const handleSave = () => {
    if (selectedGoal !== null) {
      onSave(selectedGoal);
    }
  };

  const renderOption = (value: number, label: string) => {
    const selected = selectedGoal === value;
    return (
      <TouchableOpacity
        key={value}
        style={[styles.optionButton, selected && styles.optionSelectedButton]}
        onPress={() => setSelectedGoal(value)}>
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
        <Text style={styles.title}>Which is your goal?</Text>
        <Text style={styles.subtitle}>
          This helps us personalize your training and nutrition strategy
        </Text>

        <View style={styles.optionsContainer}>
          {renderOption(0, 'Loose weight')}
          {renderOption(1, 'Keep weight')}
          {renderOption(2, 'Gain weight')}
        </View>
      </View>

      <Button
        title="Next"
        onPress={handleSave}
        disabled={selectedGoal === null}
        buttonStyle={styles.nextButton}
        titleStyle={styles.nextButtonText}
      />
    </ScrollView>
  );
};
