import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Button, Card, Icon, Text } from '@rneui/themed';
import { PieChart } from 'react-native-gifted-charts';
import { subDays, addDays, format } from 'date-fns';
import { COLORS } from '../theme';
import { AuthContext, AuthContextType } from '../navigation/Authcontext';
import { foodLogsApi } from '../api';
import { FoodLog as FLog } from '../types';

export const FoodLog = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [foodLogData, setFoodLogData] = useState<FLog[]>([]);
  const auth = useContext<AuthContextType | undefined>(AuthContext);

  const pieData = [
    { value: 70, color: '#177AD5' },
    { value: 30, color: 'lightgray' },
  ];

  if (!auth) {
    throw new Error('SignIn must be used within an AuthProvider');
  }
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

  const handleSubtractDay = () => {
    setCurrentDate(prevDate => subDays(prevDate, 1));
  };

  const handleAddDay = () => {
    setCurrentDate(prevDate => addDays(prevDate, 1));
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateSegment}>
        <Button
          onPress={handleSubtractDay}
          icon={<Icon name="chevron-left" type="feather" size={24} />}
          type="clear"
        />
        <Text style={styles.dateText}>
          {format(currentDate, 'PPP')} {/* Format date as needed */}
        </Text>
        <Button
          onPress={handleAddDay}
          icon={<Icon name="chevron-right" type="feather" size={24} />}
          type="clear"
        />
      </View>
      <Card containerStyle={styles.chartCardContainer}>
        <PieChart
          donut
          innerRadius={80}
          data={pieData}
          centerLabelComponent={() => {
            return <Text style={styles.centerLabel}>70%</Text>;
          }}
        />
      </Card>
      <View style={styles.content}>
        {/* Content based on currentDate */}
        {isLoading ? (
          <ActivityIndicator
            style={styles.spinner}
            size="large"
            color={COLORS.black}
          />
        ) : (
          <View>
            {foodLogData.map((log, index) => (
              <Card key={index} containerStyle={styles.cardContainer}>
                <Card.Title>
                  <Text>{format(new Date(log.date), 'hh mm')} - </Text>
                  <Text>{log.foodObj.foodName} </Text>
                </Card.Title>
                <Card.Divider />
                <Text>{log.foodObj.calories}</Text>
              </Card>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 20,
  },
  centerLabel: {
    fontSize: 30, // Adjust as needed
  },
  chartCardContainer: {
    marginHorizontal: 20,
    marginTop: 20, // Adjust as needed
  },
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'stretch',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'flex-start',
  },
  dateSegment: {
    alignItems: 'center',
    backgroundColor: COLORS.bgGrey,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10, // Set your desired color
  },
  dateText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
  },
});
