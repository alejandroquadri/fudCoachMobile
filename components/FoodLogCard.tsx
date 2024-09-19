import React from 'react';
import { View } from 'react-native';
import { Card, Button, Text } from '@rneui/themed';
import { PieChart } from 'react-native-gifted-charts';
import { FoodLogStyles } from '../theme';

interface FoodLogCardProps {
  foodName: string;
  calories: number;
}

export const FoodLogCard: React.FC<FoodLogCardProps> = ({
  foodName,
  calories,
}) => {
  const styles = FoodLogStyles();
  return (
    <Card containerStyle={styles.mealCard}>
      <View style={styles.mealHeader}>
        <Text style={styles.mealTitle}>Breakfast</Text>
        <Text style={styles.mealCalories}>(91 calories)</Text>
        <Button title="+ Add Meal" type="clear" onPress={() => {}} />
      </View>

      <View style={styles.foodItemContainer}>
        <View style={styles.foodIcon}>
          <Text style={styles.foodIconText}>SC</Text>
        </View>

        <View style={styles.foodDetails}>
          <Text style={styles.foodName}>{foodName}</Text>
          <Text style={styles.foodCalories}>{calories} calories</Text>
        </View>

        <View style={styles.chartContainer}>
          <PieChart
            donut
            radius={25}
            innerRadius={20}
            data={[
              { value: 4, color: '#4CAF50' },
              { value: 96, color: 'lightgray' },
            ]}
            centerLabelComponent={() => (
              <Text style={styles.chartCenterLabel}>4%</Text>
            )}
          />
        </View>
      </View>
    </Card>
  );
};
