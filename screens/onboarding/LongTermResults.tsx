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

interface LongTermResultsProps {
  onNext: () => void;
  onBack: () => void;
  showProgressBar?: boolean;
  step?: number;
  totalSteps?: number;
}

export const LongTermResults = ({
  onNext,
  onBack,
  showProgressBar = false,
  step = 0,
  totalSteps = 0,
}: LongTermResultsProps) => {
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
        <Text style={styles.title}>With Food Coach, get long term results</Text>

        <Image
          source={require('../../assets/long_term.png')} // Update the path to your actual chart asset
          style={longTermStyles.chartImage}
          resizeMode="contain"
        />
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

const longTermStyles = StyleSheet.create({
  chartImage: {
    width: '100%',
    height: 250,
    borderRadius: 16,
  },
});
