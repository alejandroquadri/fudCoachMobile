import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  Pressable,
} from 'react-native';
import { Text, Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

const weightOptions = Array.from({ length: 100 }, (_, i) => 40 + i); // 40kg to 139kg

export const EditWeightScreen = () => {
  const navigation = useNavigation();
  const [selectedWeight, setSelectedWeight] = useState(90);

  const handleSave = () => {
    // TODO: Save weight logic here
    navigation.goBack();
  };

  const renderItem = ({ item }: { item: number }) => (
    <Pressable style={styles.option} onPress={() => setSelectedWeight(item)}>
      <Text
        style={[
          styles.optionText,
          item === selectedWeight && styles.optionSelected,
        ]}>
        {item}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Weight</Text>
      <FlatList
        data={weightOptions}
        keyExtractor={item => item.toString()}
        renderItem={renderItem}
        getItemLayout={(_, index) => ({
          length: 60,
          offset: 60 * index,
          index,
        })}
        contentContainerStyle={styles.picker}
        showsVerticalScrollIndicator={false}
        snapToInterval={60}
        decelerationRate="fast"
        initialScrollIndex={selectedWeight - 40}
      />
      <Text style={styles.unit}>kg</Text>

      <Button
        title="Save"
        buttonStyle={styles.saveButton}
        titleStyle={styles.saveButtonText}
        onPress={handleSave}
      />
    </View>
  );
};

const { height } = Dimensions.get('window');

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
    marginBottom: 20,
  },
  picker: {
    height: height * 0.4,
    justifyContent: 'center',
  },
  option: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 24,
    color: '#888',
  },
  optionSelected: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 32,
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
