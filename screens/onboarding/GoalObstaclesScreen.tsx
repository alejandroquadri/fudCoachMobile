import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { StepProgressBar } from '@components';
import { COLORS, SharedStyles } from '@theme';

interface GoalObstacleProps {
  initialValue?: string;
  onSave: (trainingFrequency: string) => void;
  onBack: () => void;
  showProgressBar?: boolean;
  step?: number;
  totalSteps?: number;
}

export const GoalObstacleScreen = ({
  initialValue = '',
  onSave,
  onBack,
  showProgressBar = false,
  step = 0,
  totalSteps = 0,
}: GoalObstacleProps) => {
  const styles = SharedStyles();

  const [selectedObstacle, setSelectedObstacle] = useState(initialValue);

  const handleSave = () => {
    if (selectedObstacle !== null) {
      onSave(selectedObstacle);
    }
  };

  const renderOption = (value: string) => {
    const selected = selectedObstacle === value;
    return (
      <TouchableOpacity
        key={value}
        style={[styles.optionButton, selected && styles.optionSelectedButton]}
        onPress={() => setSelectedObstacle(value)}>
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
          {renderOption('Lack of consistency')}
          {renderOption('Unhealthy habits')}
          {renderOption('Busy lifestyle')}
          {renderOption("Don't know how")}
        </View>
      </View>

      <Button
        title="Next"
        onPress={handleSave}
        disabled={!selectedObstacle}
        buttonStyle={styles.nextButton}
        titleStyle={styles.nextButtonText}
      />
    </ScrollView>
  );
};
