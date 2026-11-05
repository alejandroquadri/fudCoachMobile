import { tr, useLanguageUpdates } from '../../../localization';
import React from 'react';
import { View } from 'react-native';
import { Card, Text } from '@rneui/themed';
import { FoodLogStyles } from '../LogStyles';

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
  useLanguageUpdates();
  const styles = FoodLogStyles();
  return (
    <Card containerStyle={styles.progressCard}>
      <View style={styles.calorieProgressContainer}>
        <Text style={styles.progressTitle}>{tr('Calorie Progress')}</Text>
        <View style={styles.calorieRow}>
          <View style={styles.calorieColumn}>
            <Text style={styles.calorieLabel}>{goal}</Text>
            <Text style={styles.calorieLabelText}>{tr('Goal')}</Text>
          </View>
          <Text style={styles.calorieSign}>+</Text>
          <View style={styles.calorieColumn}>
            <Text style={styles.calorieLabel}>{burned}</Text>
            <Text style={styles.calorieLabelText}>{tr('Burned')}</Text>
          </View>
          <Text style={styles.calorieSign}>-</Text>
          <View style={styles.calorieColumn}>
            <Text style={styles.calorieLabel}>{consumed}</Text>
            <Text style={styles.calorieLabelText}>{tr('Consumed')}</Text>
          </View>
          <Text style={styles.calorieSign}>=</Text>
          <View style={styles.calorieColumn}>
            <Text style={styles.calorieRemaining}>{remaining}</Text>
            <Text style={styles.calorieLabelText}>{tr('Remaining')}</Text>
          </View>
        </View>
      </View>
    </Card>
  );
};
