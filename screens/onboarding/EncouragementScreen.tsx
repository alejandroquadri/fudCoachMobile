import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { StepProgressBar } from '@components';
import { Icon, Button } from '@rneui/themed';
import { COLORS, SharedStyles } from '@theme';
import { kgToLbs } from '@utils';

interface LongTermResultsProps {
  weightDelta: number;
  unitType: 'metric' | 'imperial';
  onNext: () => void;
  onBack: () => void;
  showProgressBar?: boolean;
  step?: number;
  totalSteps?: number;
}

export const EcouragementScreen = ({
  weightDelta,
  unitType,
  onNext,
  onBack,
  showProgressBar = false,
  step = 0,
  totalSteps = 0,
}: LongTermResultsProps) => {
  const styles = SharedStyles();

  const direction = weightDelta < 0 ? 'To gain' : 'To loose';
  const convertedDelta =
    unitType === 'metric' ? weightDelta : kgToLbs(weightDelta);
  const unit = unitType === 'metric' ? 'kg' : 'lbs';
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
        <Text style={[styles.title, encouragementStyles.text]}>
          {direction}{' '}
          <Text style={encouragementStyles.textAccent}>{convertedDelta}</Text>{' '}
          {unit} is totally attainable. It is not difficult at all! You got
          this!
        </Text>
        <Text style={encouragementStyles.text2}>
          90% of users say that once they reach their goal, they are able to
          sustain it with Food Coach
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

const encouragementStyles = StyleSheet.create({
  text: {
    fontSize: 24,
    width: '80%',
  },
  textAccent: {
    color: COLORS.facebookBlue,
  },
  text2: {
    fontSize: 16,
    width: '80%',
    textAlign: 'center',
  },
});
