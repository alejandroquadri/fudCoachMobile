import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  EditWeight: undefined;
  // Add the rest if needed
};

type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const Profile = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.goalRow}>
          <View>
            <Text style={styles.label}>Goal Weight</Text>
            <Text style={styles.value}>85 kg</Text>
          </View>
          <Button
            title="Change Goal"
            buttonStyle={styles.changeGoalButton}
            titleStyle={styles.changeGoalButtonText}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Pressable onPress={() => navigation.navigate('EditWeight')}>
          <View style={styles.itemRow}>
            <Text style={styles.label}>Current weight</Text>
            <Text style={styles.value}>90 kg</Text>
          </View>
        </Pressable>
        <View style={styles.separator} />

        <View style={styles.itemRow}>
          <Text style={styles.label}>Height</Text>
          <Text style={styles.value}>176 cm</Text>
        </View>
        <View style={styles.separator} />

        <View style={styles.itemRow}>
          <Text style={styles.label}>Date of birth</Text>
          <Text style={styles.value}>11/03/1983</Text>
        </View>
        <View style={styles.separator} />

        <View style={styles.itemRow}>
          <Text style={styles.label}>Gender</Text>
          <Text style={styles.value}>Male</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F2F2F2', // gray background
  },
  container: {
    paddingTop: 64,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  changeGoalButton: {
    backgroundColor: '#000',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  changeGoalButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
    color: '#666666',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  separator: {
    height: 1,
    backgroundColor: '#E6E6E6',
    marginVertical: 4,
  },
});
