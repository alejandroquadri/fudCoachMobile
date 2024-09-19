import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Text } from '@rneui/themed';
import { subDays, addDays } from 'date-fns';
import { AuthContext, AuthContextType } from '../navigation/Authcontext';
import { foodLogsApi } from '../api';
import {
  CalorieProgressCard,
  DateSegment,
  FoodLogCard,
  ExerciseCard,
  WaterIntakeCard,
} from '../components';
import { FoodLogStyles } from '../theme';
import { FoodLog as FLog } from '../types';

export const FoodLog = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [foodLogData, setFoodLogData] = useState<FLog[]>([]);
  const [waterIntake, setWaterIntake] = useState(2);
  const auth = useContext<AuthContextType | undefined>(AuthContext);

  const styles = FoodLogStyles();
  if (!auth) throw new Error('AuthContext is undefined');

  const { user } = auth;

  const fetchFoodLog = useCallback(
    async (date: Date) => {
      if (user !== null) {
        try {
          setIsLoading(true);
          const foodLogs = await foodLogsApi.getFoodLogs(user._id, date);
          setFoodLogData(foodLogs);
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'Failed to fetch food log data.');
        } finally {
          setIsLoading(false);
        }
      }
    },
    [user]
  );

  useEffect(() => {
    fetchFoodLog(currentDate);
  }, [currentDate, fetchFoodLog]);

  const handleSubtractDay = () =>
    setCurrentDate(prevDate => subDays(prevDate, 1));
  const handleAddDay = () => setCurrentDate(prevDate => addDays(prevDate, 1));

  const handleIncrease = () => {
    if (waterIntake < 8) setWaterIntake(waterIntake + 1);
  };

  const handleDecrease = () => {
    if (waterIntake > 0) setWaterIntake(waterIntake - 1);
  };

  return (
    <View style={styles.container}>
      <DateSegment
        currentDate={currentDate}
        onSubtractDay={handleSubtractDay}
        onAddDay={handleAddDay}
      />
      <ScrollView style={styles.scrollView}>
        <CalorieProgressCard
          goal={2372}
          burned={0}
          consumed={0}
          remaining={2372}
        />
        {foodLogData.length > 0 ? (
          <View style={styles.content}>
            {isLoading ? (
              <ActivityIndicator
                style={styles.spinner}
                size="large"
                color="black"
              />
            ) : (
              foodLogData.map((log, index) => (
                <FoodLogCard
                  key={index}
                  foodName={log.foodObj.foodName}
                  calories={log.foodObj.calories}
                />
              ))
            )}
          </View>
        ) : (
          <Text style={styles.noFoodLogText}>No food logs available.</Text>
        )}
        <ExerciseCard exerciseType="Weight Lifting" caloriesBurned={284} />
        <WaterIntakeCard
          waterIntake={waterIntake}
          handleIncrease={handleIncrease}
          handleDecrease={handleDecrease}
        />
      </ScrollView>
    </View>
  );
};
