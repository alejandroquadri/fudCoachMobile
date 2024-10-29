import { StyleSheet } from 'react-native';
import { COLORS } from './Colors';

export const FoodLogStyles = () => {
  return StyleSheet.create({
    calorieColumn: {
      alignItems: 'center',
    },
    calorieLabel: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    calorieLabelText: {
      color: 'gray',
      fontSize: 14,
    },
    calorieProgressContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    calorieRemaining: {
      color: 'orange',
      fontSize: 18,
      fontWeight: 'bold',
    },
    calorieRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginBottom: 5,
    },
    calorieSign: {
      fontSize: 18,
      fontWeight: 'bold',
      marginHorizontal: 5,
    },
    chartCenterLabel: {
      fontSize: 10,
      fontWeight: 'bold',
    },
    chartContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 10,
    },
    container: {
      backgroundColor: COLORS.bgGrey,
      flex: 1,
    },
    content: {
      alignItems: 'stretch',
      flexDirection: 'column',
      flex: 1,
      justifyContent: 'flex-start',
    },
    cupsContainer: {
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'space-around',
      marginHorizontal: 10,
    },
    dateSegment: {
      alignItems: 'center',
      backgroundColor: COLORS.bgGrey,
      flexDirection: 'row',
      justifyContent: 'center',
      padding: 10,
    },
    dateText: {
      fontSize: 18,
      marginHorizontal: 10,
    },
    exerciseBurned: {
      color: 'gray',
      fontSize: 14,
    },
    exerciseCalories: {
      color: 'gray',
      fontSize: 14,
    },
    exerciseCard: {
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginHorizontal: 20,
      marginTop: 10,
      padding: 15,
    },
    exerciseDetails: {
      marginTop: 10,
    },
    exerciseHeader: {
      alignItems: 'center',
      borderBottomColor: '#E0E0E0',
      borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
      paddingBottom: 10,
    },
    exerciseTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    exerciseType: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    foodCalories: {
      color: 'gray',
      fontSize: 14,
    },
    foodDetails: {
      flex: 1,
      justifyContent: 'center',
      marginLeft: 10,
    },
    foodIcon: {
      alignItems: 'center',
      backgroundColor: '#E0F7FA',
      borderRadius: 20,
      height: 40,
      justifyContent: 'center',
      width: 40,
    },
    foodIconText: {
      color: '#00796B',
      fontSize: 16,
      fontWeight: 'bold',
    },
    foodImage: {
      borderRadius: 20,
      height: 40,
      width: 40,
    },
    foodItemContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 10,
    },
    foodName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    glassIcon: {
      marginHorizontal: 8,
    },
    mealCalories: {
      color: 'gray',
      fontSize: 14,
      marginLeft: 5,
    },
    mealCard: {
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginHorizontal: 20,
      marginTop: 10,
      padding: 15,
    },
    mealHeader: {
      alignItems: 'center',
      borderBottomColor: '#E0E0E0',
      borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
      paddingBottom: 10,
    },
    mealTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    noFoodLogText: {
      color: 'gray',
      fontSize: 16,
      marginTop: 20,
      textAlign: 'center',
    },
    progressCard: {
      backgroundColor: '#FFF',
      marginHorizontal: 20,
      marginTop: 10,
      padding: 15,
    },
    progressTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    scrollView: {
      flex: 1,
    },
    spinner: {
      flex: 1,
      justifyContent: 'center',
    },
    totalWater: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    waterCard: {
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginHorizontal: 20,
      marginTop: 10,
      padding: 15,
    },
    waterGoal: {
      color: 'gray',
      fontSize: 14,
    },
    waterHeader: {
      alignItems: 'center',
      borderBottomColor: '#E0E0E0',
      borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
      paddingBottom: 10,
    },
    waterRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    waterTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
};
