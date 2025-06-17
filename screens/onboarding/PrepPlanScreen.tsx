import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { StepProgressBar } from '@components';
import { Icon, Button, Card } from '@rneui/themed';
import { PieChart } from 'react-native-gifted-charts';
import { COLORS, SharedStyles } from '@theme';
import { OnboardingState } from './context/OnboardingContext';
import { userAPI } from '@api/AuthApi';
import { NutritionGoals } from '@types'; // adjust if NutritionGoals lives elsewhere

interface PrepPlanScreenProps {
  currentState: OnboardingState;
  onNext: (nutritionGoals: NutritionGoals) => void;
  onBack: () => void;
  showProgressBar?: boolean;
  step?: number;
  totalSteps?: number;
}

export const PrepPlanScreen: React.FC<PrepPlanScreenProps> = ({
  currentState,
  onNext,
  onBack,
  showProgressBar = false,
  step = 0,
  totalSteps = 0,
}) => {
  const styles = SharedStyles();
  const [loading, setLoading] = useState(true);
  const [nutGoals, setNutGoals] = useState<NutritionGoals | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const nutritionGoals = await userAPI.calculatePlan(currentState);
        console.log(nutritionGoals);
        setNutGoals(nutritionGoals);
      } catch (e) {
        setError('Failed to load plan. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, []);

  const handleOnNext = () => {
    if (nutGoals) {
      onNext(nutGoals!);
    }
  };

  const renderMacrosChart = () => {
    if (!nutGoals) return null;
    console.log(nutGoals);

    const { dailyCarbsTarget, dailyProteinTarget, dailyFatTarget } = nutGoals;
    const total = dailyCarbsTarget + dailyProteinTarget + dailyFatTarget;

    const pieData = [
      { value: dailyCarbsTarget, color: '#F39C12', label: 'Carbs' },
      { value: dailyProteinTarget, color: '#27AE60', label: 'Protein' },
      { value: dailyFatTarget, color: '#2980B9', label: 'Fat' },
    ];

    return (
      <Card containerStyle={prepPlanStyles.card}>
        <Text style={prepPlanStyles.cardTitle}>Daily Targets</Text>

        <PieChart
          data={pieData}
          donut
          radius={70}
          innerRadius={60}
          centerLabelComponent={() => (
            <Text style={prepPlanStyles.pieChartText}>
              {nutGoals.dailyCaloricTarget} kcal
            </Text>
          )}
        />

        <View style={prepPlanStyles.labelsContainer}>
          {pieData.map(d => (
            <View key={d.label} style={prepPlanStyles.labelContainer}>
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: d.color,
                  marginBottom: 4,
                }}
              />
              <Text>{d.label}</Text>
              <Text style={prepPlanStyles.textValue}>{d.value}g</Text>
            </View>
          ))}
        </View>
      </Card>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButtonContainer}>
          <Icon
            name="chevron-left"
            type="feather"
            size={28}
            color={COLORS.primaryColor}
          />
        </TouchableOpacity>

        {showProgressBar && (
          <View style={styles.progressBar}>
            <StepProgressBar step={step} totalSteps={totalSteps} />
          </View>
        )}
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {loading && (
          <>
            <Text style={styles.title}>
              We are preparing your personalized plan
            </Text>
            <ActivityIndicator size="large" color={COLORS.primaryColor} />
          </>
        )}

        {error && <Text style={prepPlanStyles.errorText}>{error}</Text>}

        {!loading && nutGoals && (
          <>
            <Text style={styles.title}>Your personalized plan is ready 🎉</Text>
            {/* If you have goal target text, add it here */}
            {/* <Text style={styles.subtitle}>You should lose: 6 kg by February 21</Text> */}
            {renderMacrosChart()}
          </>
        )}
      </View>

      {/* Bottom Button */}
      {!loading && nutGoals && (
        <Button
          title="Let's get started!"
          onPress={handleOnNext}
          buttonStyle={styles.nextButton}
          titleStyle={styles.nextButtonText}
        />
      )}
    </ScrollView>
  );
};

const prepPlanStyles = StyleSheet.create({
  card: { borderRadius: 16 },
  cardTitle: { textAlign: 'center', fontWeight: 'bold', marginBottom: 16 },
  pieChartText: { fontSize: 18, fontWeight: 'bold' },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  labelContainer: { alignItems: 'center' },
  textValue: { fontWeight: 'bold' },
  errorText: { color: 'red', textAlign: 'center' },
});
