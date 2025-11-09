import { LinearProgress } from '@rneui/themed';
import { COLORS } from '@theme';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

interface StepProgressBarProps {
  step: number;
  totalSteps: number;
}

export const StepProgressBar: FC<StepProgressBarProps> = ({
  step,
  totalSteps,
}) => {
  const progress = step / totalSteps;

  return (
    <View style={styles.wrapper}>
      {/* Step indicator */}
      <View style={styles.container}>
        {/* <Text */}
        {/*   style={styles.progressText}>{`Step ${step} of ${totalSteps}`}</Text> */}
        <LinearProgress
          animation={{ duration: 300 }}
          value={progress}
          variant="determinate"
          color={COLORS.primaryColor}
          trackColor={COLORS.secondaryColor}
          style={styles.progressBar}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    width: '100%',
    height: 6,
    borderRadius: 3,
  },
});
