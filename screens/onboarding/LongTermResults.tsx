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
import { COLORS } from '@theme';

// import longTermChart from '../../../assets/long_term.png';
// const longTermChart={require('../../../assets/long_term.png')}

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
        <Text style={styles.title}>With Fud Coach, get long term results</Text>

        <Image
          source={require('../../assets/long_term.png')} // Update the path to your actual chart asset
          style={styles.chartImage}
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

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  header: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    marginRight: 12,
  },
  progressBar: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  chartImage: {
    width: '100%',
    height: 250,
    borderRadius: 16,
  },
  nextButton: {
    borderRadius: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.primaryColor,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
