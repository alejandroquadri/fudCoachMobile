import React from 'react';
import { View } from 'react-native';
import { Card, Text } from '@rneui/themed';
import { FoodLogStyles } from '../theme';

interface CalorieProgressCardProps {
  goal: number;
  burned: number;
  consumed: number;
  remaining: number;
}

export const CalorieProgressCard: React.FC<CalorieProgressCardProps> = ({
  goal,
  burned,
  consumed,
  remaining,
}) => {
  const styles = FoodLogStyles();
  return (
    <Card containerStyle={styles.progressCard}>
      <View style={styles.calorieProgressContainer}>
        <Text style={styles.progressTitle}>Calorie Progress</Text>
        <View style={styles.calorieRow}>
          <View style={styles.calorieColumn}>
            <Text style={styles.calorieLabel}>{goal}</Text>
            <Text style={styles.calorieLabelText}>Goal</Text>
          </View>
          <Text style={styles.calorieSign}>+</Text>
          <View style={styles.calorieColumn}>
            <Text style={styles.calorieLabel}>{burned}</Text>
            <Text style={styles.calorieLabelText}>Burned</Text>
          </View>
          <Text style={styles.calorieSign}>-</Text>
          <View style={styles.calorieColumn}>
            <Text style={styles.calorieLabel}>{consumed}</Text>
            <Text style={styles.calorieLabelText}>Consumed</Text>
          </View>
          <Text style={styles.calorieSign}>=</Text>
          <View style={styles.calorieColumn}>
            <Text style={styles.calorieRemaining}>{remaining}</Text>
            <Text style={styles.calorieLabelText}>Remaining</Text>
          </View>
        </View>
      </View>
    </Card>
  );
};
