import React, { useState } from 'react';
import { View } from 'react-native';
import { StepProgressBar } from '@components';
import { Button, ButtonGroup } from '@rneui/themed';

interface GenderScreenProps {
  initialValue?: string;
  onSave: (gender: string) => void;
  showProgressBar?: boolean;
  step?: number;
  totalSteps?: number;
}

export const GenderScreen = ({
  initialValue = '',
  onSave,
  showProgressBar = false,
  step = 0,
  totalSteps = 0,
}: GenderScreenProps) => {
  const [selectedIndex, setSelectedIndex] = useState(
    initialValue === 'male' ? 0 : initialValue === 'female' ? 1 : -1
  );

  const handleSave = () => {
    console.log('handle save');
    const gender =
      selectedIndex === 0 ? 'male' : selectedIndex === 1 ? 'female' : '';
    if (gender) {
      onSave(gender);
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
        buttons={['Male', 'Female']}
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
