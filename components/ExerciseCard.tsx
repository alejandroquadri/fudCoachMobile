import React from 'react';
import { View } from 'react-native';
import { Card, Button, Text } from '@rneui/themed';
import { ExerciseLogStyles } from '../theme';
import { ExerciseLog } from '../types';

interface ExerciseCardProps {
  logs: ExerciseLog[];
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ logs }) => {
  const styles = ExerciseLogStyles();
  console.log(logs);
  const totalCalories = logs.reduce((sum, log) => sum + log.caloriesBurned, 0);

  return (
    <Card containerStyle={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseTitle}>Exercise</Text>
        <Text style={styles.exerciseBurned}>({totalCalories} burned)</Text>
        <Button title="+ Add Exercise" type="clear" onPress={() => {}} />
      </View>

      {/* Display each exercise log */}
      {logs.map((log, index) => (
        <View key={index} style={styles.foodItemContainer}>
          <View style={styles.exerciseDetails}>
            <Text style={styles.exerciseType}>{log.exerciseName}</Text>
            <Text style={styles.exerciseCalories}>
              {log.caloriesBurned} calories burned
            </Text>
          </View>
        </View>
      ))}
    </Card>
  );
};
