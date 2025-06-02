import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { StepProgressBar } from '@components';
import { Icon, Button } from '@rneui/themed';
import { COLORS, SharedStyles } from '@theme';

interface PrepPlanProps {
  onNext: () => void;
  onBack: () => void;
  showProgressBar?: boolean;
  step?: number;
  totalSteps?: number;
}

export const PrepPlanScreen = ({
  onNext,
  onBack,
  showProgressBar = false,
  step = 0,
  totalSteps = 0,
}: PrepPlanProps) => {
  const styles = SharedStyles();

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
          We are preparing your personalized plan
        </Text>
      </View>

      <Button
        title="Next"
        onPress={onNext}
        buttonStyle={styles.nextButton}
        titleStyle={styles.nextButtonText}
      />
    </ScrollView>
  );
};
