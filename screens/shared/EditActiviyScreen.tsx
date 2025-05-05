import React, { useState } from 'react';
import { View } from 'react-native';
import { StepProgressBar } from '@components';
import { Button, ButtonGroup } from '@rneui/themed';

interface ActivityScreenProps {
  initialValue?: string;
  onSave: (activityLevel: string) => void;
  showProgressBar?: boolean;
  step?: number;
  totalSteps?: number;
}

export const ActivityScreen = ({
  initialValue = '',
  onSave,
  showProgressBar = false,
  step = 0,
  totalSteps = 0,
}: ActivityScreenProps) => {
  const [selectedIndex, setSelectedIndex] = useState(
    initialValue === 'low'
      ? 0
      : initialValue === 'moderate'
        ? 1
        : initialValue === 'high'
          ? 2
          : -1
  );

  const handleSave = () => {
    const levels = ['low', 'moderate', 'high'];
    if (selectedIndex !== -1) {
      onSave(levels[selectedIndex]);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      {showProgressBar && (
        <StepProgressBar step={step} totalSteps={totalSteps} />
      )}
      <ButtonGroup
        onPress={index => setSelectedIndex(index)}
        selectedIndex={selectedIndex}
        buttons={['Low', 'Moderate', 'High']}
        containerStyle={{ marginBottom: 20 }}
      />
      <Button
        title="Next"
        onPress={handleSave}
        disabled={selectedIndex === -1}
      />
    </View>
  );
};
