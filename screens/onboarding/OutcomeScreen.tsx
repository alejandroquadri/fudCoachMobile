import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { StepProgressBar } from '@components';
import { COLORS, SharedStyles } from '@theme';

interface OutcomeProps {
  initialValue?: number;
  onSave: (trainingFrequency: number) => void;
  onBack: () => void;
  showProgressBar?: boolean;
  step?: number;
  totalSteps?: number;
}

export const OutcomeScreen = ({
  initialValue = 0,
  onSave,
  onBack,
  showProgressBar = false,
  step = 0,
  totalSteps = 0,
}: OutcomeProps) => {
  const styles = SharedStyles();

  const [selectedOutcome, setSelectedOutcome] = useState(initialValue);

  const handleSave = () => {
    if (selectedOutcome !== null) {
      onSave(selectedOutcome);
    }
  };

  const renderOption = (value: number, label: string, option?: string) => {
    const selected = selectedOutcome === value;
    return (
      <TouchableOpacity
        key={value}
        style={[styles.optionButton, selected && styles.optionSelectedButton]}
        onPress={() => setSelectedOutcome(value)}>
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
        <Text style={styles.titleNoSub}>Which is your desired outcome?</Text>
        <View style={styles.optionsContainer}>
          {renderOption(0, 'Eat and live healthier')}
          {renderOption(1, 'Have more energy')}
          {renderOption(2, 'Feel motivated')}
          {renderOption(3, 'Feel better with myself')}
        </View>
      </View>

      <Button
        title="Next"
        onPress={handleSave}
        disabled={selectedOutcome === null}
        buttonStyle={styles.nextButton}
        titleStyle={styles.nextButtonText}
      />
    </ScrollView>
  );
};
