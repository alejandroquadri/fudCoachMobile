import React from 'react';
import { View } from 'react-native';
import { Card, Button, Text } from '@rneui/themed';
import { FoodLogStyles } from '../theme';

interface ExerciseCardProps {
  exerciseType: string;
  caloriesBurned: number;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exerciseType,
  caloriesBurned,
}) => {
  const styles = FoodLogStyles();
  return (
    <Card containerStyle={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseTitle}>Exercise</Text>
        <Text style={styles.exerciseBurned}>({caloriesBurned} burned)</Text>
        <Button title="+ Add Exercise" type="clear" onPress={() => {}} />
      </View>
      <View style={styles.exerciseDetails}>
        <Text style={styles.exerciseType}>{exerciseType}</Text>
        <Text style={styles.exerciseCalories}>
          {caloriesBurned} calories burned
        </Text>
      </View>
    </Card>
  );
};
