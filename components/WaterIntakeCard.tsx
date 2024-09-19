import React from 'react';
import { View } from 'react-native';
import { Card, Button, Text } from '@rneui/themed';
import { MaterialIcons } from '@expo/vector-icons';
import { FoodLogStyles } from '../theme';

interface WaterIntakeCardProps {
  waterIntake: number;
  handleIncrease: () => void;
  handleDecrease: () => void;
}

export const WaterIntakeCard: React.FC<WaterIntakeCardProps> = ({
  waterIntake,
  handleIncrease,
  handleDecrease,
}) => {
  const styles = FoodLogStyles();
  return (
    <Card containerStyle={styles.waterCard}>
      <View style={styles.waterHeader}>
        <Text style={styles.waterTitle}>Water</Text>
        <Text style={styles.waterGoal}>Goal: 8 cups</Text>
        <Text style={styles.totalWater}>Total Water: {waterIntake} cups</Text>
      </View>

      <View style={styles.waterRow}>
        <Button title="-" type="clear" onPress={handleDecrease} />
        <View style={styles.cupsContainer}>
          {Array.from({ length: 8 }, (_, index) => (
            <MaterialIcons
              key={index}
              name="local-drink"
              size={30}
              color={index < waterIntake ? '#2196F3' : 'lightgray'}
              style={styles.glassIcon}
            />
          ))}
        </View>
        <Button title="+" type="clear" onPress={handleIncrease} />
      </View>
    </Card>
  );
};
