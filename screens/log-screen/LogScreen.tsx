import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { subDays, addDays, parse, format } from 'date-fns';
import { AuthContext, AuthContextType } from '../../navigation/Authcontext';
import { foodLogsApi } from '../../api';
import {
  CalorieProgressCard,
  DateSegment,
  FoodLogCard,
  ExerciseCard,
  WaterIntakeCard,
  EmptyCard,
} from '../../components';
import { LogStyles } from '../../theme';
import { FoodLog, ExerciseLog, WaterLog } from '../../types';

// Grouping function for food logs

const groupFoodLogsByMeal = (foodLogs: FoodLog[]) => {
  const groupedLogs = {
    breakfast: [] as FoodLog[],
    lunch: [] as FoodLog[],
    dinner: [] as FoodLog[],
    snack: [] as FoodLog[],
  };

  let totalCalories = 0;

  foodLogs.forEach(log => {
    const parsedDate = parse(log.hour, 'HH:mm', new Date());
    const hour = parsedDate.getHours();

    if (hour >= 7 && hour < 12) {
      groupedLogs.breakfast.push(log);
    } else if (hour >= 12 && hour < 15) {
      groupedLogs.lunch.push(log);
    } else if (hour >= 19 && hour <= 24) {
      groupedLogs.dinner.push(log);
    } else {
      groupedLogs.snack.push(log);
    }

    totalCalories += log.foodObj.calories;
  });

  return { logs: groupedLogs, totalCalories };
};

export const LogScreen = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoadingFoodLog, setIsLoadingFoodLog] = useState(false);
  const [isLoadingExerciseLog, setIsLoadingExerciseLog] = useState(false);

  const [groupedFoodLogs, setGroupedFoodLogs] = useState({
    breakfast: [] as FoodLog[],
    lunch: [] as FoodLog[],
    dinner: [] as FoodLog[],
    snack: [] as FoodLog[],
  });
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [waterLog, setWaterLog] = useState<WaterLog>();
  const [consumedCalories, setConsumedCalories] = useState<number>();
  const [burnedCalories, setBurnedCalories] = useState<number>();

  const auth = useContext<AuthContextType | undefined>(AuthContext);

  const styles = LogStyles();
  if (!auth) throw new Error('AuthContext is undefined');

  const { user } = auth;

  const fetchFoodLog = useCallback(
    async (date: Date) => {
      if (user !== null) {
        try {
          setIsLoadingFoodLog(true);
          const formattedDate = format(date, 'yyyy-MM-dd');
          const foodLogs = await foodLogsApi.getFoodLogs(
            user._id,
            formattedDate
          );

          // Group logs by meal
          const groupedLogs = groupFoodLogsByMeal(foodLogs);
          setGroupedFoodLogs(groupedLogs.logs);
          setConsumedCalories(groupedLogs.totalCalories);
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'Failed to fetch food log data.');
        } finally {
          setIsLoadingFoodLog(false);
        }
      }
    },
    [user]
  );

  const fetchExerciseLog = useCallback(
    async (date: Date) => {
      if (user !== null) {
        try {
          setIsLoadingExerciseLog(true);
          let burned = 0;
          const formattedDate = format(date, 'yyyy-MM-dd');
          const exerciseLogs = await foodLogsApi.getExerciseLogs(
            user._id,
            formattedDate
          );
          exerciseLogs.forEach(log => {
            burned += log.caloriesBurned;
          });
          setBurnedCalories(burned);
          setExerciseLogs(exerciseLogs);
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'Failed to fetch exercise log data.');
        } finally {
          setIsLoadingExerciseLog(false);
        }
      }
    },
    [user]
  );

  const fetchWaterLog = useCallback(
    async (date: Date) => {
      if (user !== null) {
        try {
          const formattedDate = format(date, 'yyyy-MM-dd');
          const waterLogs = await foodLogsApi.getWaterLogs(
            user._id,
            formattedDate
          );
          setWaterLog(waterLogs);
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'Failed to fetch exercise log data.');
        }
      }
    },
    [user]
  );

  useEffect(() => {
    fetchFoodLog(currentDate);
    fetchExerciseLog(currentDate);
    fetchWaterLog(currentDate);
  }, [currentDate, fetchFoodLog, fetchExerciseLog, fetchWaterLog]);

  const handleSubtractDay = () =>
    setCurrentDate(prevDate => subDays(prevDate, 1));
  const handleAddDay = () => setCurrentDate(prevDate => addDays(prevDate, 1));

  const handleIncrease = async () => {
    try {
      if (user?._id === undefined) {
        throw new Error('User Logged out');
      }
      let updatedWaterLog: WaterLog;

      if (!waterLog) {
        // Create a new WaterLog if none exists
        updatedWaterLog = {
          user_id: user._id,
          date: format(currentDate, 'yyyy-MM-dd'),
          waterCups: 1,
        };
      } else if (waterLog.waterCups < 8) {
        // Increment water cups if waterLog already exists
        updatedWaterLog = {
          ...waterLog,
          waterCups: waterLog.waterCups + 1,
        };
      } else {
        // Do nothing if water cups are already at the maximum
        return;
      }

      // Update the state
      setWaterLog(updatedWaterLog);

      // Update the backend
      await foodLogsApi.upsertWaterLog(updatedWaterLog);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update water intake.');
    }
  };

  const handleDecrease = async () => {
    if (!waterLog || waterLog.waterCups <= 0) return;

    try {
      const updatedWaterLog: WaterLog = {
        ...waterLog,
        waterCups: waterLog.waterCups - 1,
      };
      setWaterLog(updatedWaterLog);
      await foodLogsApi.upsertWaterLog(updatedWaterLog);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update water intake.');
    }
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
          goal={user!.tdee}
          burned={burnedCalories!}
          consumed={consumedCalories!}
          remaining={user!.tdee + burnedCalories! - consumedCalories!}
        />

        {/* Render the grouped logs by meal */}
        {isLoadingFoodLog ? (
          <EmptyCard cardType={{ type: 'Food' }} isLoading={isLoadingFoodLog} />
        ) : (
          <>
            {/* Render Breakfast Logs */}
            {groupedFoodLogs.breakfast.length > 0 && (
              <FoodLogCard
                mealType="Breakfast"
                logs={groupedFoodLogs.breakfast}
              />
            )}

            {/* Render Lunch Logs */}
            {groupedFoodLogs.lunch.length > 0 && (
              <FoodLogCard mealType="Lunch" logs={groupedFoodLogs.lunch} />
            )}

            {/* Render Dinner Logs */}
            {groupedFoodLogs.dinner.length > 0 && (
              <FoodLogCard mealType="Dinner" logs={groupedFoodLogs.dinner} />
            )}

            {/* Render Snack Logs */}
            {groupedFoodLogs.snack.length > 0 && (
              <FoodLogCard mealType="Snack" logs={groupedFoodLogs.snack} />
            )}

            {/* If no food logs */}
            {groupedFoodLogs.breakfast.length === 0 &&
              groupedFoodLogs.lunch.length === 0 &&
              groupedFoodLogs.dinner.length === 0 &&
              groupedFoodLogs.snack.length === 0 && (
                <EmptyCard
                  cardType={{ type: 'Food' }}
                  isLoading={isLoadingFoodLog}
                />
              )}
          </>
        )}

        {exerciseLogs.length === 0 ? (
          <EmptyCard
            cardType={{ type: 'Exerecise' }}
            isLoading={isLoadingExerciseLog}
          />
        ) : (
          <ExerciseCard logs={exerciseLogs} />
        )}

        <WaterIntakeCard
          waterLog={waterLog}
          handleIncrease={handleIncrease}
          handleDecrease={handleDecrease}
        />
      </ScrollView>
    </View>
  );
};
