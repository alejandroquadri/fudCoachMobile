import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StepProgressBar } from '@components';
import { Button, Icon } from '@rneui/themed';
import { COLORS, SharedStyles } from '@theme';

interface ActivityScreenProps {
  initialValue?: number;
  onSave: (activityLevel: number) => void;
  onBack: () => void;
  showProgressBar?: boolean;
  step?: number;
  totalSteps?: number;
}

export const LifeStyleScreen = ({
  initialValue = 1.2,
  onSave,
  onBack,
  showProgressBar = false,
  step = 0,
  totalSteps = 0,
}: ActivityScreenProps) => {
  const styles = SharedStyles();
  const [selectedActivity, setSelectedActivity] = useState(initialValue);

  const handleSave = () => {
    if (selectedActivity) {
      onSave(selectedActivity);
    }
  };

  const renderOption = (value: number, label: string) => {
    const selected = selectedActivity === value;
    return (
      <TouchableOpacity
        key={value}
        style={[styles.optionButton, selected && styles.optionSelectedButton]}
        onPress={() => setSelectedActivity(value)}>
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
        <Text style={styles.title}>
          Which of the following best describes your daily lifestyle?
        </Text>
        <Text style={styles.subtitle}>
          We will use it to calibrate your personalized plan
        </Text>

        <View style={styles.optionsContainer}>
          {renderOption(1.2, 'Mainly sitting')}
          {renderOption(1.375, 'Some time on feet')}
          {renderOption(1.55, 'Majority on feet')}
          {renderOption(1.725, 'High physical activity')}
        </View>
      </View>

      <Button
        title="Next"
        onPress={handleSave}
        disabled={!selectedActivity}
        buttonStyle={styles.nextButton}
        titleStyle={styles.nextButtonText}
      />
    </ScrollView>
  );
};
