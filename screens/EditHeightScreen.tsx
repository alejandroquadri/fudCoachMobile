import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Button } from '@rneui/themed';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

const HEIGHT_CM_OPTIONS = Array.from({ length: 100 }, (_, i) => 140 + i); // 140 cm to 239 cm
const FEET_OPTIONS = Array.from({ length: 4 }, (_, i) => 4 + i); // 4ft to 7ft
const INCHES_OPTIONS = Array.from({ length: 12 }, (_, i) => i); // 0in to 11in

const cmToImperial = (cm: number) => {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
};

const imperialToCm = (feet: number, inches: number) => {
  const totalInches = feet * 12 + inches;
  return Math.round(totalInches * 2.54);
};

export const EditHeightScreen = () => {
  const navigation = useNavigation();

  const route = useRoute<RouteProp<RootStackParamList, 'EditHeight'>>();
  // const onSave = route.params?.onSave;
  const { currentHeight, onSave } = route.params;

  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [selectedCm, setSelectedCm] = useState(currentHeight || 170);

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
    console.log('Selected Height (cm):', selectedCm);
    console.log('Selected Height (feet & inch):', selectedFeet, selectedInches);
    // Save or callback logic here
    if (onSave) {
      onSave(selectedCm);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Height</Text>

      {/* Unit Toggle */}
      <View style={styles.unitSwitchContainer}>
        <TouchableOpacity
          style={[styles.unitOption, !isMetric && styles.unitOptionSelected]}
          onPress={() => handleUnitToggle('imperial')}>
          <Text
            style={[
              styles.unitOptionText,
              !isMetric && styles.unitOptionTextSelected,
            ]}>
            Imperial
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.unitOption, isMetric && styles.unitOptionSelected]}
          onPress={() => handleUnitToggle('metric')}>
          <Text
            style={[
              styles.unitOptionText,
              isMetric && styles.unitOptionTextSelected,
            ]}>
            Metric
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Height</Text>

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
          style={styles.picker}>
          {HEIGHT_CM_OPTIONS.map(cm => (
            <Picker.Item key={cm} label={`${cm} cm`} value={cm} />
          ))}
        </Picker>
      ) : (
        <View style={styles.imperialPickerContainer}>
          <Picker
            selectedValue={selectedFeet}
            onValueChange={val => {
              setSelectedCm(imperialToCm(Number(val), selectedInches));
              setSelectedFeet(Number(val));
            }}
            style={styles.imperialPicker}>
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
            style={styles.imperialPicker}>
            {INCHES_OPTIONS.map(inch => (
              <Picker.Item key={inch} label={`${inch} in`} value={inch} />
            ))}
          </Picker>
        </View>
      )}

      <Button
        title="Save changes"
        buttonStyle={styles.saveButton}
        titleStyle={styles.saveButtonText}
        onPress={handleSave}
      />
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 64,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
  },
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
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
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
  saveButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 24,
    marginTop: 'auto',
    marginBottom: 32,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
