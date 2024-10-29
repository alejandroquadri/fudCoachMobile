import React from 'react';
import { View, Image } from 'react-native';
import { Card, Button, Text } from '@rneui/themed';
import { PieChart } from 'react-native-gifted-charts';
import { FoodLogStyles } from '../theme';
import { FoodLog } from '../types';

interface FoodLogCardProps {
  mealType: string;
  logs: FoodLog[];
}

export const FoodLogCard: React.FC<FoodLogCardProps> = ({ mealType, logs }) => {
  const styles = FoodLogStyles();

  // Calculate the total calories for this meal
  const totalCalories = logs.reduce(
    (sum, log) => sum + log.foodObj.calories,
    0
  );

  return (
    <Card containerStyle={styles.mealCard}>
      {/* Meal Header with total calories */}
      <View style={styles.mealHeader}>
        <Text style={styles.mealTitle}>{mealType}</Text>
        <Text style={styles.mealCalories}>({totalCalories} calories)</Text>
        <Button title="+ Add Meal" type="clear" onPress={() => {}} />
      </View>

      {/* Display each food log */}
      {logs.map((log, index) => (
        <View key={index} style={styles.foodItemContainer}>
          {/* Icon or image placeholder for food item */}
          <View style={styles.foodIcon}>
            {log.foodObj.foodName === 'Mate' ? (
              <Image
                source={{ uri: 'path/to/mate-image.jpg' }}
                style={styles.foodImage}
              />
            ) : (
              <Text style={styles.foodIconText}>
                {log.foodObj.foodName.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>

          {/* Food Details */}
          <View style={styles.foodDetails}>
            <Text style={styles.foodName}>{log.foodObj.foodName}</Text>
            <Text style={styles.foodCalories}>
              {log.foodObj.calories} calories
            </Text>
          </View>

          {/* Pie chart for showing calorie percentage */}
          <View style={styles.chartContainer}>
            <PieChart
              donut
              radius={25}
              innerRadius={20}
              data={[
                {
                  value: (log.foodObj.calories / totalCalories) * 100,
                  color: '#4CAF50',
                },
                {
                  value: 100 - (log.foodObj.calories / totalCalories) * 100,
                  color: 'lightgray',
                },
              ]}
              centerLabelComponent={() => (
                <Text style={styles.chartCenterLabel}>
                  {Math.round((log.foodObj.calories / totalCalories) * 100)}%
                </Text>
              )}
            />
          </View>
        </View>
      ))}
    </Card>
  );
};
