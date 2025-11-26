import { StepProgressBar } from '@components';
import { Button, Icon } from '@rneui/themed';
import { COLORS, SharedStyles } from '@theme';
import { kgToLbs } from '@utils';
import { addDays, format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

interface ChartToGoalProps {
  currentWeight: number;
  goalWeight: number;
  pace: number;
  unit: 'metric' | 'imperial';
  onNext: () => void;
  onBack: () => void;
  showProgressBar?: boolean;
  step?: number;
  totalSteps?: number;
}

interface ChartDataInterface {
  label: string;
  value: number;
  dataPointText?: string;
  date?: Date;
  dataPointLabelShiftY?: number;
  dataPointLabelShiftX?: number;
  textShiftX?: number;
  textShiftY?: number;
  showVerticalLine?: boolean;
  verticalLineThickness?: number;
  textFontSize?: number;
  textColor?: string;
}

// Logistic function
const sigmoid = (x: number, k: number = 10, x0: number = 0.5): number => {
  return 1 / (1 + Math.exp(-k * (x - x0)));
};

const detUnitType = (unit: string) => (unit === 'metric' ? 'kg' : 'lbs');

export const generateChartData = (
  currentWeight: number,
  goalWeight: number,
  pace: number,
  unit: string
): ChartDataInterface[] => {
  if (unit === 'imperial') {
    currentWeight = kgToLbs(currentWeight);
    goalWeight = kgToLbs(goalWeight);
  }
  const totalWeightLoss = currentWeight - goalWeight;
  const totalWeeks = totalWeightLoss / pace;
  const totalDays = totalWeeks * 7;

  const today = new Date();
  const intervals = 5; // 6 points = 5 intervals
  const dayStep = totalDays / intervals;

  // Sample sigmoid at normalized time values
  const xValues = Array.from({ length: 6 }, (_, i) => i / intervals);
  const rawY = xValues.map(x => sigmoid(x));
  const minY = rawY[0];
  const maxY = rawY[rawY.length - 1];
  const normalizedY = rawY.map(y => (y - minY) / (maxY - minY)); // scale 0-1

  const points: ChartDataInterface[] = normalizedY.map((fraction, index) => {
    const date = addDays(today, index * dayStep);
    const weight = currentWeight - totalWeightLoss * fraction;

    const obj: ChartDataInterface = {
      date,
      showVerticalLine: true,
      verticalLineThickness: 1,
      label:
        index === 0
          ? 'Now'
          : index === normalizedY.length - 1
            ? format(date, 'MMM')
            : '',
      value: parseFloat(weight.toFixed(1)),
      dataPointText:
        index === 0
          ? `${currentWeight} ${detUnitType(unit)}`
          : index === normalizedY.length - 1
            ? `${goalWeight} ${detUnitType(unit)}`
            : undefined,
      textShiftY:
        index === 0 ? 30 : index === normalizedY.length - 1 ? -10 : undefined,
      textShiftX:
        index === 0 ? -10 : index === normalizedY.length - 1 ? -25 : undefined,
      textFontSize: 20,
      textColor: COLORS.fontGrey,
    };
    return obj;
  });

  return points;
};

export const ChartToGoalScreen = ({
  currentWeight,
  goalWeight,
  pace,
  unit,
  onNext,
  onBack,
  showProgressBar = false,
  step = 0,
  totalSteps = 0,
}: ChartToGoalProps) => {
  const styles = SharedStyles();

  const [chartData, setChartData] = useState<ChartDataInterface[]>([]);
  const [minValue, setMinValue] = useState<number>(0);
  const [goalDate, setGoalDate] = useState<string>();
  const [calcGoalWeight, setCalcGoalWeight] = useState<number>();
  const [unitType, setUnitType] = useState<'kg' | 'lbs'>();

  useEffect(() => {
    const data = generateChartData(currentWeight, goalWeight, pace, unit);
    const minValue = data[data.length - 1].value;
    const goalDate = format(data[data.length - 1].date!, 'dd MMMM');
    const calcGoalWeight = unit === 'metric' ? goalWeight : kgToLbs(goalWeight);
    setChartData(data);
    setMinValue(minValue);
    setGoalDate(goalDate);
    setCalcGoalWeight(calcGoalWeight);
    setUnitType(detUnitType(unit));
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={onBack}>
            <Icon
              name="chevron-left"
              type="feather"
              size={28}
              color={COLORS.primaryColor}
            />
          </TouchableOpacity>
        </View>

        {showProgressBar && (
          <View style={styles.progressBar}>
            <StepProgressBar step={step} totalSteps={totalSteps} />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          After getting to know you better, we predict that you'll be{' '}
          {calcGoalWeight} {unitType} by <Text>{goalDate}</Text>
        </Text>

        <View style={chartGoalStyles.chartGoalContainer}>
          <LineChart
            data={chartData}
            height={150}
            curved
            thickness={6}
            color={COLORS.accentColor}
            hideRules
            // hideYAxisText
            yAxisTextStyle={chartGoalStyles.yAxisText}
            // backgroundColor="#414141"
            yAxisColor="transparent"
            xAxisColor="transparent"
            showDataPointOnFocus
            // dataPointsColor="#6A8DFF"
            // dataPointsRadius={5}
            // textColor="#FFF"
            // textFontSize={12}
            yAxisOffset={minValue - 5}
            // spacing={50}
            // showValuesAsDataPointsText
            // textShiftY={-15}
            // textShiftX={-25}
          />
        </View>
      </View>

      <Button
        title="Next"
        onPress={onNext}
        buttonStyle={styles.nextButton}
        titleStyle={styles.nextButtonText}
      />
    </ScrollView>
  );
};

const chartGoalStyles = StyleSheet.create({
  chartGoalContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundColor,
    paddingVertical: 35,
    borderRadius: 10,
  },
  yAxisText: {
    color: 'transparent',
  },
});
