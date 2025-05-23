import { StepProgressBar } from '@components';
import { Picker } from '@react-native-picker/picker';
import { Button, Icon, Text } from '@rneui/themed';
import { COLORS, SharedStyles } from '@theme';
import { kgToLbs, lbsToKg } from '@utils';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const KG_START = 40;
const KG_END = 139;

const weightKgOptions = Array.from(
  { length: KG_END - KG_START + 1 },
  (_, i) => KG_START + i
);

type WeightRet = {
  unitType: 'metric' | 'imperial';
  weight: number;
};

interface WeightProps {
  initialValue?: number;
  unitType?: 'metric' | 'imperial';
  title: string;
  onSave: (ret: WeightRet) => void;
  onBack: () => void;
  showProgressBar?: boolean;
  step?: number;
  totalSteps?: number;
}

export const WeightScreen = ({
  initialValue,
  unitType = 'imperial',
  title,
  onSave,
  onBack,
  showProgressBar = false,
  step = 0,
  totalSteps = 0,
}: WeightProps) => {
  const styles = SharedStyles();
  const [unit, setUnit] = useState<'metric' | 'imperial'>(unitType);
  const [selectedKg, setSelectedKg] = useState(initialValue || 90);
  const [displayWeightValue, setDisplayWeightValue] = useState(90);

  const isMetric = unit === 'metric';

  const setWeight = (value: number) => {
    console.log('value changed', value);
    if (isMetric) {
      setSelectedKg(value);
      setDisplayWeightValue(value);
    } else {
      const converted = lbsToKg(value);
      setSelectedKg(converted);
      setDisplayWeightValue(value);
    }
  };

  const weightOptions = isMetric
    ? weightKgOptions
    : weightKgOptions.map(kgToLbs);

  const handleSave = () => {
    if (onSave) {
      onSave({ weight: selectedKg, unitType: unit });
    }
  };

  const handleUnitToggle = (value: 'metric' | 'imperial') => {
    console.log('selectedKg', selectedKg);
    console.log('displayWeight', displayWeightValue);

    if (value !== unit) {
      if (value === 'metric') {
        setDisplayWeightValue(lbsToKg(displayWeightValue));
        setSelectedKg(lbsToKg(displayWeightValue));
      } else {
        setDisplayWeightValue(kgToLbs(displayWeightValue));
        setSelectedKg(displayWeightValue);
      }
      setUnit(value);
    }
  };

  useEffect(() => {
    if (initialValue !== undefined) {
      setDisplayWeightValue(
        unit === 'metric' ? initialValue : kgToLbs(initialValue)
      );
    }
  }, []);

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
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>
          We will use it to calibrate your personalized plan
        </Text>

        <View style={weightStyles.container}>
          <View style={weightStyles.unitSwitchContainer}>
            <TouchableOpacity
              style={[
                weightStyles.unitOption,
                isMetric && weightStyles.unitOptionSelected,
              ]}
              onPress={() => handleUnitToggle('metric')}>
              <Text
                style={[
                  weightStyles.unitOptionText,
                  isMetric && weightStyles.unitOptionTextSelected,
                ]}>
                Metric
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                weightStyles.unitOption,
                !isMetric && weightStyles.unitOptionSelected,
              ]}
              onPress={() => handleUnitToggle('imperial')}>
              <Text
                style={[
                  weightStyles.unitOptionText,
                  !isMetric && weightStyles.unitOptionTextSelected,
                ]}>
                Imperial
              </Text>
            </TouchableOpacity>
          </View>

          {/* Picker 1 */}
          <View style={weightStyles.pickerContainer}>
            <Picker
              selectedValue={displayWeightValue}
              onValueChange={val =>
                // setSelectedKg(isMetric ? Number(val) : lbsToKg(val))
                setWeight(Number(val))
              }
              style={weightStyles.picker}>
              {weightOptions.map(weight => (
                <Picker.Item
                  key={weight}
                  label={`${weight} ${isMetric ? 'kg' : 'lb'}`}
                  value={weight}
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      <Button
        title="Next"
        onPress={handleSave}
        // disabled={!selectedActivity}
        buttonStyle={styles.nextButton}
        titleStyle={styles.nextButtonText}
      />
    </ScrollView>
  );
};

const weightStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  unitSwitchContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    padding: 4,
    marginBottom: 20,
  },
  unitOption: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  unitOptionSelected: {
    backgroundColor: '#000',
  },
  unitOptionText: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
  unitOptionTextSelected: {
    color: '#fff',
  },
  pickerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexGrow: 1,
  },
  picker: {
    width: '70%',
    height: 180,
  },
});
