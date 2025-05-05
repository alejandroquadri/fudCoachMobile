import React from 'react';
import { View, Text } from 'react-native';
import { LinearProgress } from '@rneui/themed';

interface StepProgressBarProps {
  step: number;
  totalSteps: number;
}

export const StepProgressBar = ({ step, totalSteps }: StepProgressBarProps) => {
  const progress = step / totalSteps;

  return (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          textAlign: 'center',
          marginBottom: 5,
        }}>{`Step ${step} of ${totalSteps}`}</Text>
      <LinearProgress value={progress} variant="determinate" />
    </View>
  );
};
