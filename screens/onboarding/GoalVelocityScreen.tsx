import { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Button, Icon, Slider } from '@rneui/themed';
import { StepProgressBar } from '@components';
import { COLORS, SharedStyles } from '@theme';

interface GoalVelocityProps {
  initialValue?: number;
  unitType: 'metric' | 'imperial';
  onSave: (goalVelocity: number) => void;
  onBack: () => void;
  showProgressBar?: boolean;
  step?: number;
  totalSteps?: number;
}

export const GoalVelocityScreen = ({
  initialValue = 1.0,
  unitType,
  onSave,
  onBack,
  showProgressBar = false,
  step = 0,
  totalSteps = 0,
}: GoalVelocityProps) => {
  const styles = SharedStyles();
  const [selectedVel, setSelectedVel] = useState<number>(initialValue);

  const unit = unitType === 'metric' ? 'kg' : 'lbs';
  const weightStep = unitType === 'metric' ? 0.1 : 0.2;
  const min = unitType === 'metric' ? 0.1 : 0.2;
  const max = unitType === 'metric' ? 1.5 : 3.2;
  const minRecommendeVelocity = unitType === 'metric' ? 0.5 : 1.0;
  const maxRecommendeVelocity = unitType === 'metric' ? 1 : 2.0;

  const handleSave = () => {
    if (onSave) onSave(selectedVel);
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
          How fast do you want to reach your goal?
        </Text>
        <Text style={styles.subtitle}>
          We will use it to calibrate your personalized plan
        </Text>

        <View style={goalVelocityStyles.sliderContainer}>
          <Text style={goalVelocityStyles.label}>Weekly weight loss rate</Text>

          <Text style={goalVelocityStyles.selectedValue}>
            {selectedVel.toFixed(1)} {unit}
          </Text>

          <View style={goalVelocityStyles.slider}>
            <Slider
              value={selectedVel}
              onValueChange={setSelectedVel}
              minimumValue={min}
              maximumValue={max}
              step={weightStep}
              thumbStyle={goalVelocityStyles.sliderThumb}
              minimumTrackTintColor={COLORS.primaryColor}
              maximumTrackTintColor="#ddd"
              allowTouchTrack={true}
            />
          </View>

          <View style={goalVelocityStyles.sliderLabels}>
            <Icon
              name="walk"
              type="material-community"
              size={24}
              color="#444"
            />
            <Icon
              name="run-fast"
              type="material-community"
              size={24}
              color="#000"
            />
          </View>

          <View style={goalVelocityStyles.recommended}>
            {selectedVel >= minRecommendeVelocity &&
              selectedVel <= maxRecommendeVelocity && (
                <Text style={goalVelocityStyles.recommendedText}>
                  Recommended
                </Text>
              )}
          </View>
        </View>
      </View>

      <Button
        title="Next"
        onPress={handleSave}
        buttonStyle={styles.nextButton}
        titleStyle={styles.nextButtonText}
      />
    </ScrollView>
  );
};

const goalVelocityStyles = StyleSheet.create({
  sliderContainer: {
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#444',
    marginBottom: 10,
  },
  selectedValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 15,
  },
  slider: {
    width: '90%',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 15,
  },
  sliderThumb: {
    height: 20,
    width: 20,
    backgroundColor: COLORS.black,
  },
  recommended: {
    marginTop: 30,
    minHeight: 45,
  },
  recommendedText: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.subText,
  },
});
