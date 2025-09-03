import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { StepProgressBar } from '@components';
import { COLORS, SharedStyles } from '@theme';

interface ActivityLevelScreenProps {
  initialValue?: string;
  onSave: (activityLevel: string) => void;
  onBack: () => void;
  showProgressBar?: boolean;
  step?: number;
  totalSteps?: number;
}

export const ActivityLevelScreen = ({
  initialValue = '',
  onSave,
  onBack,
  showProgressBar = false,
  step = 0,
  totalSteps = 0,
}: ActivityLevelScreenProps) => {
  const styles = SharedStyles();

  const [selectedActivity, setSelectedActivity] = useState(initialValue);

  const handleSave = () => {
    if (selectedActivity !== null) {
      onSave(selectedActivity);
    }
  };

  const renderOption = (value: string) => {
    const selected = selectedActivity === value;
    return (
      <TouchableOpacity
        key={value}
        style={[styles.optionButton, selected && styles.optionSelectedButton]}
        onPress={() => setSelectedActivity(value)}>
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
        <Text style={styles.title}>
          How often do you work out in a typical week?
        </Text>
        <Text style={styles.subtitle}>
          This helps us personalize your training and nutrition strategy
        </Text>

        <View style={styles.optionsContainer}>
          {renderOption('0–2 times: Rarely')}
          {renderOption('3–5 times: A few times a week')}
          {renderOption('6+ times: Like an athlete')}
        </View>
      </View>

      <Button
        title="Next"
        onPress={handleSave}
        disabled={selectedActivity === null}
        buttonStyle={styles.nextButton}
        titleStyle={styles.nextButtonText}
      />
    </ScrollView>
  );
};
