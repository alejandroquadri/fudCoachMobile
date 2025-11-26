import { COLORS } from '@theme';
import { StyleSheet } from 'react-native';

export const LogStyles = () => {
  return StyleSheet.create({
    container: {
      backgroundColor: COLORS.bgGrey,
      flex: 1,
    },
    scrollView: {
      flex: 1,
      backgroundColor: COLORS.backgroundColor,
    },
    spinner: {
      flex: 1,
      justifyContent: 'center',
    },
    noFoodLogText: {
      color: 'gray',
      fontSize: 16,
      marginTop: 20,
      textAlign: 'center',
    },
  });
};

export const EmtpyCardStyles = () => {
  return StyleSheet.create({
    emptyCard: {
      backgroundColor: COLORS.cardBackground,
      borderRadius: 10,
      marginHorizontal: 20,
      marginTop: 10,
      padding: 15,
    },
    emptyHeader: {
      alignItems: 'center',
      borderBottomColor: COLORS.cardBorder,
      borderBottomWidth: 1,
      flexDirection: 'row',
      // justifyContent: 'space-between',
      marginBottom: 10,
      paddingBottom: 10,
    },
    emptyTitle: {
      // flex: 1,
      fontSize: 18,
      fontWeight: 'bold',
      marginEnd: 10,
    },
    spinner: {
      alignSelf: 'flex-start',
    },
    emptyTextContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 10,
    },
  });
};
export const DateSegmentStyles = () => {
  return StyleSheet.create({
    dateSegment: {
      alignItems: 'center',
      backgroundColor: COLORS.backgroundColor,
      flexDirection: 'row',
      justifyContent: 'center',
      padding: 10,
    },
    dateText: {
      fontSize: 18,
      marginHorizontal: 10,
    },
  });
};

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
      marginTop: 3,
    },
    calorieProgressContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    calorieRemaining: {
      color: COLORS.accentColor,
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
      marginHorizontal: 8,
    },
    chartCenterLabel: {
      fontSize: 10,
      fontWeight: 'bold',
    },
    content: {
      alignItems: 'stretch',
      flexDirection: 'column',
      flex: 1,
      justifyContent: 'flex-start',
    },
    foodItemContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 10,
    },
    foodIcon: {
      alignItems: 'center',
      backgroundColor: COLORS.secondaryColor,
      borderRadius: 20,
      height: 40,
      justifyContent: 'center',
      width: 40,
    },
    foodDetails: {
      flex: 1,
      justifyContent: 'center',
      marginLeft: 10,
    },
    foodNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      // gap: 6,
      // flex: 1,
      // agregados
      justifyContent: 'space-between',
      flexWrap: 'nowrap',
    },
    foodNameText: {
      fontSize: 16,
      fontWeight: 'bold',
      // agregados
      flexShrink: 1, // allow text to shrink to make room for time chip
      flexWrap: 'wrap', // allow wrapping to next line
      marginRight: 8, // add small spacing before the chip
    },
    timeChip: {
      backgroundColor: COLORS.secondaryColor,
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 2,
      // agregados
      flexShrink: 0, // prevent the chip from shrinking
      alignSelf: 'center', // keep it aligned at the top if text wraps
    },
    timeChipText: {
      fontSize: 12,
      color: COLORS.primaryColor,
    },
    foodCalories: {
      color: 'gray',
      fontSize: 14,
    },
    foodIconText: {
      color: COLORS.primaryColor,
      fontSize: 16,
      fontWeight: 'bold',
      flexWrap: 'wrap',
    },
    foodImage: {
      borderRadius: 20,
      height: 40,
      width: 40,
    },
    foodName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    mealCalories: {
      color: 'gray',
      fontSize: 14,
      marginLeft: 5,
    },
    chartContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 10,
    },
    mealCard: {
      backgroundColor: COLORS.cardBackground,
      borderRadius: 10,
      marginHorizontal: 20,
      marginTop: 10,
      padding: 15,
    },
    mealHeader: {
      alignItems: 'center',
      borderBottomColor: COLORS.cardBorder,
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
    progressCard: {
      backgroundColor: COLORS.cardBackground,
      marginHorizontal: 20,
      marginTop: 10,
      padding: 15,
      borderRadius: 10,
    },
    progressTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
  });
};

export const ExerciseLogStyles = () => {
  return StyleSheet.create({
    exerciseBurned: {
      color: 'gray',
      fontSize: 14,
    },
    exerciseCalories: {
      color: 'gray',
      fontSize: 14,
    },
    exerciseCard: {
      backgroundColor: COLORS.cardBackground,
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
      borderBottomColor: COLORS.cardBorder,
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
    exerciseItemContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      // marginVertical: 0,
    },
  });
};

export const WaterLogStyles = () => {
  return StyleSheet.create({
    totalWater: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    waterCard: {
      backgroundColor: COLORS.cardBackground,
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
      borderBottomColor: COLORS.cardBorder,
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
    cupsContainer: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    glassIcon: {
      marginHorizontal: 0,
    },
  });
};
