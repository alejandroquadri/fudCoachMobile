import { StepProgressBar } from '@components';
import { Picker } from '@react-native-picker/picker';
import { Button, Icon } from '@rneui/themed';
import { COLORS, SharedStyles } from '@theme';
import React, { useState } from 'react';
import { cmToImperial, imperialToCm } from '@utils';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const HEIGHT_CM_OPTIONS = Array.from({ length: 100 }, (_, i) => 140 + i); // 140 cm to 239 cm
const FEET_OPTIONS = Array.from({ length: 4 }, (_, i) => 4 + i); // 4ft to 7ft
const INCHES_OPTIONS = Array.from({ length: 12 }, (_, i) => i); // 0in to 11in

type HeightRet = {
  unitType: 'metric' | 'imperial';
  height: number;
};

interface HeightProps {
  initialValue?: number;
  unitType?: 'metric' | 'imperial';
  onSave: (ret: HeightRet) => void;
  onBack: () => void;
  showProgressBar?: boolean;
  step?: number;
  totalSteps?: number;
  standAlone?: boolean;
}

export const HeightScreen = ({
  initialValue = 170,
  unitType = 'imperial',
  onSave,
  onBack,
  showProgressBar = false,
  step = 0,
  totalSteps = 0,
  standAlone = false,
}: HeightProps) => {
  const styles = SharedStyles();
  const [unit, setUnit] = useState<'metric' | 'imperial'>(unitType);
  const [selectedCm, setSelectedCm] = useState<number>(initialValue || 170);

  const { feet, inches } = cmToImperial(selectedCm);
  const [selectedFeet, setSelectedFeet] = useState(feet);
  const [selectedInches, setSelectedInches] = useState(inches);
  const isMetric = unit === 'metric';

  const handleUnitToggle = (value: 'metric' | 'imperial') => {
    if (value !== unit) {
      if (value === 'metric') {
        setSelectedCm(imperialToCm(selectedFeet, selectedInches));
      } else {
        const { feet, inches } = cmToImperial(selectedCm);
        setSelectedFeet(feet);
        setSelectedInches(inches);
      }
      setUnit(value);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave({ height: selectedCm, unitType: unit });
    }
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
        <Text style={styles.title}>Height</Text>
        <Text style={styles.subtitle}>
          We will use it to calibrate your personalized plan
        </Text>

        {/* Unit Toggle */}
        <View style={heightStyles.unitSwitchContainer}>
          <TouchableOpacity
            style={[
              heightStyles.unitOption,
              !isMetric && heightStyles.unitOptionSelected,
            ]}
            onPress={() => handleUnitToggle('imperial')}>
            <Text
              style={[
                heightStyles.unitOptionText,
                !isMetric && heightStyles.unitOptionTextSelected,
              ]}>
              Imperial
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              heightStyles.unitOption,
              isMetric && heightStyles.unitOptionSelected,
            ]}
            onPress={() => handleUnitToggle('metric')}>
            <Text
              style={[
                heightStyles.unitOptionText,
                isMetric && heightStyles.unitOptionTextSelected,
              ]}>
              Metric
            </Text>
          </TouchableOpacity>
        </View>

        {/* Pickers */}
        {isMetric ? (
          <Picker
            selectedValue={selectedCm}
            onValueChange={val => {
              const { feet, inches } = cmToImperial(val);
              setSelectedFeet(feet);
              setSelectedInches(inches);
              setSelectedCm(Number(val));
            }}
            style={heightStyles.picker}>
            {HEIGHT_CM_OPTIONS.map(cm => (
              <Picker.Item key={cm} label={`${cm} cm`} value={cm} />
            ))}
          </Picker>
        ) : (
          <View style={heightStyles.imperialPickerContainer}>
            <Picker
              selectedValue={selectedFeet}
              onValueChange={val => {
                setSelectedCm(imperialToCm(Number(val), selectedInches));
                setSelectedFeet(Number(val));
              }}
              style={heightStyles.imperialPicker}>
              {FEET_OPTIONS.map(ft => (
                <Picker.Item key={ft} label={`${ft} ft`} value={ft} />
              ))}
            </Picker>
            <Picker
              selectedValue={selectedInches}
              onValueChange={val => {
                setSelectedCm(imperialToCm(selectedFeet, Number(val)));
                setSelectedInches(Number(val));
              }}
              style={heightStyles.imperialPicker}>
              {INCHES_OPTIONS.map(inch => (
                <Picker.Item key={inch} label={`${inch} in`} value={inch} />
              ))}
            </Picker>
          </View>
        )}
      </View>

      <Button
        title={standAlone ? 'Save' : 'Next'}
        onPress={handleSave}
        // disabled={!selectedActivity}
        buttonStyle={styles.nextButton}
        titleStyle={styles.nextButtonText}
      />
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');

const heightStyles = StyleSheet.create({
  unitSwitchContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    padding: 4,
    marginBottom: 16,
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
  picker: {
    width: '70%',
    height: 180,
    marginBottom: 24,
  },
  imperialPickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: width * 0.7,
    marginBottom: 24,
  },
  imperialPicker: {
    width: (width * 0.9) / 2,
    height: 180,
  },
});
