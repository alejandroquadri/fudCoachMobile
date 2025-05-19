import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { StepProgressBar } from '@components';
import { Button, Icon } from '@rneui/themed';
import { COLORS } from '@theme';

interface ActivityScreenProps {
  initialValue?: number;
  onSave: (activityLevel: number) => void;
  onBack: () => void;
  showProgressBar?: boolean;
  step?: number;
  totalSteps?: number;
}

export const LifeStyleScreen = ({
  initialValue = 1.2,
  onSave,
  onBack,
  showProgressBar = false,
  step = 0,
  totalSteps = 0,
}: ActivityScreenProps) => {
  const [selectedActivity, setSelectedActivity] = useState(initialValue);

  const handleSave = () => {
    if (selectedActivity) {
      onSave(selectedActivity);
    }
  };

  const renderOption = (value: number, label: string) => {
    const selected = selectedActivity === value;
    return (
      <TouchableOpacity
        key={value}
        style={[styles.option, selected && styles.optionSelected]}
        onPress={() => setSelectedActivity(value)}>
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
        <Text style={styles.title}>
          Which of the following best describes your daily lifestyle?
        </Text>
        <Text style={styles.subtitle}>
          We will use it to calibrate your personalized plan
        </Text>

        <View style={styles.optionsContainer}>
          {renderOption(1.2, 'Mainly sitting')}
          {renderOption(1.375, 'Some time on feet')}
          {renderOption(1.55, 'Majority on feet')}
          {renderOption(1.725, 'High physical activity')}
        </View>
      </View>

      <Button
        title="Next"
        onPress={handleSave}
        disabled={!selectedActivity}
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
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.subText,
    marginBottom: 30,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    gap: 12,
  },
  option: {
    backgroundColor: COLORS.backgroundColor,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: COLORS.primaryColor,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.primaryColor,
  },
  optionTextSelected: {
    color: COLORS.primaryContrast,
    fontWeight: 'bold',
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

// import React, { useState } from 'react';
// import { View } from 'react-native';
// import { StepProgressBar } from '@components';
// import { Button, ButtonGroup } from '@rneui/themed';
//
// interface ActivityScreenProps {
//   initialValue?: string;
//   onSave: (activityLevel: string) => void;
//   showProgressBar?: boolean;
//   step?: number;
//   totalSteps?: number;
// }
//
// export const ActivityScreen = ({
//   initialValue = '',
//   onSave,
//   showProgressBar = false,
//   step = 0,
//   totalSteps = 0,
// }: ActivityScreenProps) => {
//   const [selectedIndex, setSelectedIndex] = useState(
//     initialValue === 'low'
//       ? 0
//       : initialValue === 'moderate'
//         ? 1
//         : initialValue === 'high'
//           ? 2
//           : -1
//   );
//
//   const handleSave = () => {
//     const levels = ['low', 'moderate', 'high'];
//     if (selectedIndex !== -1) {
//       onSave(levels[selectedIndex]);
//     }
//   };
//
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
//       {showProgressBar && (
//         <StepProgressBar step={step} totalSteps={totalSteps} />
//       )}
//       <ButtonGroup
//         onPress={index => setSelectedIndex(index)}
//         selectedIndex={selectedIndex}
//         buttons={['Low', 'Moderate', 'High']}
//         containerStyle={{ marginBottom: 20 }}
//       />
//       <Button
//         title="Next"
//         onPress={handleSave}
//         disabled={selectedIndex === -1}
//       />
//     </View>
//   );
// };
