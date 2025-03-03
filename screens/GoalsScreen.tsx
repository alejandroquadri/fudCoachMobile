import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Icon } from '@rneui/themed';
import { LineChart } from 'react-native-gifted-charts';
import { GoalStyles } from '../theme';
import { WeightLogInterface } from '../types';
import { format } from 'date-fns';
import { AuthContext, AuthContextType } from '../navigation/Authcontext';
import { convertKilogramsToPounds, round } from '../services';
import { weightLogsApi } from '../api';

interface ChartDataInterface {
  label: string;
  value: number;
}
const createWeightLogs = (
  startingWeight: number,
  startDate: string,
  numLogs: number
): WeightLogInterface[] => {
  const weightLogs: WeightLogInterface[] = [];
  const currentDate = new Date(startDate);
  let currentWeight = startingWeight;

  for (let i = 0; i < numLogs; i++) {
    weightLogs.push({
      user_id: 'x1x1x1',
      date: currentDate.toISOString().split('T')[0],
      weightLog: currentWeight,
    });

    currentDate.setDate(currentDate.getDate() + 7);
    const random = Math.random() > 0.5 ? 1 : -1;
    currentWeight -= 3.5 * random;
  }

  return weightLogs;
};

const pruneLogs = (
  logs: WeightLogInterface[],
  q: number
): ChartDataInterface[] => {
  // only return last 7 values
  const values = logs.slice(-q);
  return values.map(value => ({
    label: format(new Date(value.date), 'dd/yy'),
    value: value.weightLog,
  }));
};

const calcMinValue = (logs: { label: string; value: number }[]) => {
  return Math.min(...logs.map(log => log.value));
};

export const Goals = () => {
  const styles = GoalStyles();
  const [unit, setUnit] = useState<string>('kg');
  const [weightData, setWeightData] = useState<WeightLogInterface[]>([]);
  const [chartData, setChartData] = useState<ChartDataInterface[]>([]);
  const [minValueWeight, setMinValueWeight] = useState<number>(0);
  const [focusedData, setFocusedData] = useState(null);

  const auth = useContext<AuthContextType | undefined>(AuthContext);

  if (!auth) throw new Error('AuthContext is undefined');

  const { user } = auth;

  const fetchWeightLogs = useCallback(async () => {
    if (user !== null) {
      try {
        // const mockData = createWeightLogs(95, '2022-01-01', 15);

        const weightLogs = await weightLogsApi.getWeightLogs(user._id!);
        setWeightData(weightLogs);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch food log data.');
      } finally {
        // TODO: something else
      }
    }
  }, [user]);

  // create ChartData

  // convert wieght logs to pounds
  const convertWeigthToPounds = (weightLogs: ChartDataInterface[]) => {
    return weightLogs.map(log => {
      const pounds = round(convertKilogramsToPounds(log.value), 0);
      return {
        label: log.label,
        value: pounds,
      };
    });
  };

  useEffect(() => {
    fetchWeightLogs();
  }, [fetchWeightLogs]);

  useEffect(() => {
    const buildChartData = (weightLogs: WeightLogInterface[]) => {
      let prunedData = pruneLogs(weightLogs, 5);
      if (unit === 'lb') {
        prunedData = convertWeigthToPounds(prunedData);
      }
      return prunedData;
    };

    // Rebuild chart data whenever the unit or weightData changes
    if (weightData.length > 0) {
      const newChartData = buildChartData(weightData);
      setChartData(newChartData);
      const newMinValue = calcMinValue(newChartData);
      setMinValueWeight(newMinValue - 3);
    }
  }, [unit, weightData]);

  const handleUnitToggle = (newUnit: string) => {
    if (newUnit !== unit) {
      setUnit(newUnit);
    }
  };

  const getLogInCurrentUnit = (log: number, unit: string) => {
    if (unit === 'lb') {
      return round(convertKilogramsToPounds(log), 0);
    } else {
      return log;
    }
  };

  const handleDeleteLog = async (logId: string) => {
    try {
      await weightLogsApi.deleteWeightLog(logId);
      fetchWeightLogs();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete weight log.');
    }
  };

  const handleDataPointPress = (item, index) => {
    setFocusedData(item);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Weight Progress Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Weight Progress</Text>

          {/* Toggle Button for Units */}
          <View style={styles.unitToggleContainer}>
            <TouchableOpacity onPress={() => handleUnitToggle('lb')}>
              <Text
                style={[
                  styles.unitToggleText,
                  unit === 'lb' && styles.unitToggleTextActive,
                ]}>
                lb
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleUnitToggle('kg')}>
              <Text
                style={[
                  styles.unitToggleText,
                  unit === 'kg' && styles.unitToggleTextActive,
                ]}>
                kg
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Weight Line Chart */}
        {chartData.length > 0 && (
          <LineChart
            data={chartData}
            height={220}
            color={'#177AD5'}
            yAxisColor={'white'}
            xAxisColor={'white'}
            thickness={2}
            dataPointsColor={'#177AD5'}
            dataPointsRadius={5}
            curved
            yAxisOffset={minValueWeight}
            noOfSections={4} // Number of sections on the Y-axis
          />
        )}
        {/* Last Recorded Weight and Record Button */}
        <View style={styles.recordSection}>
          <Text style={styles.lastWeightText}>
            Last <Text style={styles.lastWeightValue}>83.8 kg</Text>
          </Text>
        </View>
      </View>

      {/* Weight History */}
      <View style={styles.historyCard}>
        <Text style={styles.historyTitle}>History</Text>

        {weightData.map((entry, index) => (
          <View key={index} style={styles.historyItem}>
            <Text style={styles.historyDate}>
              {format(new Date(entry.date), 'MMMM dd, yyyy')}
            </Text>
            <View style={styles.historySpacer}></View>
            <Text style={styles.historyWeight}>
              {getLogInCurrentUnit(entry.weightLog, unit)} {unit}
            </Text>
            <Icon
              onPress={() => handleDeleteLog(entry._id!)}
              size={20}
              name="close"
              type="material"
              color="gray"
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
