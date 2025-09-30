import { StepProgressBar } from '@components';
import { Button, Icon } from '@rneui/themed';
import { COLORS, SharedStyles } from '@theme';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface TriedOtherAppsScreenProps {
  initialValue?: boolean | null;
  onSave: (tried: boolean) => void;
  onBack: () => void;
  showProgressBar?: boolean;
  step?: number;
  totalSteps?: number;
}

export const TriedOtherAppsScreen = ({
  initialValue = null,
  onSave,
  onBack,
  showProgressBar = false,
  step = 0,
  totalSteps = 0,
}: TriedOtherAppsScreenProps) => {
  const styles = SharedStyles();

  const [selectedOption, setSelectedOption] = useState<boolean | null>(
    initialValue
  );

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
        style={[styles.optionButton, selected && styles.optionSelectedButton]}
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
