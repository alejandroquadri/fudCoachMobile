import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
const KG_START = 40;

const KG_END = 139;

const weightKgOptions = Array.from(
  { length: KG_END - KG_START + 1 },
  (_, i) => KG_START + i
);

const kgToLbs = (kg: number) => Math.round(kg * 2.20462);
const lbsToKg = (lb: number) => Math.round(lb / 2.20462);

export const EditWeightScreen = () => {
  const navigation = useNavigation();

  const route = useRoute<RouteProp<RootStackParamList, 'EditWeight'>>();
  const onSave = route.params?.onSave;

  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [selectedKg, setSelectedKg] = useState(90);
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
    // Save logic here
    console.log(selectedKg, displayWeightValue);
    if (onSave) {
      onSave(selectedKg);
    }
    navigation.goBack();
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Weight</Text>

      <View style={styles.unitSwitchContainer}>
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
      </View>

      <Picker
        selectedValue={displayWeightValue}
        onValueChange={val =>
          // setSelectedKg(isMetric ? Number(val) : lbsToKg(val))
          setWeight(Number(val))
        }
        style={styles.picker}>
        {weightOptions.map(weight => (
          <Picker.Item
            key={weight}
            label={`${weight} ${isMetric ? 'kg' : 'lb'}`}
            value={weight}
          />
        ))}
      </Picker>

      <Text style={styles.unit}>{isMetric ? 'kg' : 'lb'}</Text>

      <Button
        title="Save"
        buttonStyle={styles.saveButton}
        titleStyle={styles.saveButtonText}
        onPress={handleSave}
      />
    </View>
  );
};

// const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 80,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
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
  picker: {
    width: '100%',
    height: 200,
  },
  unit: {
    fontSize: 18,
    color: '#555',
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 24,
    marginTop: 40,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
