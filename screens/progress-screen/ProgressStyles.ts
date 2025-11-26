import { StyleSheet } from 'react-native';
import { COLORS } from '@theme';

export const ProgressStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.backgroundColor,
    },
    card: {
      backgroundColor: COLORS.cardBackground,
      borderRadius: 10,
      marginHorizontal: 20,
      padding: 20,
      marginTop: 10,
      marginBottom: 10,
      overflow: 'hidden',
      elevation: 5,
    },
    cardHeader: {
      borderBottomColor: COLORS.cardBorder,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: COLORS.text,
    },
    unitToggleContainer: {
      flexDirection: 'row',
      backgroundColor: COLORS.secondaryColor,
      borderRadius: 20,
    },
    unitToggleText: {
      padding: 8,
      color: COLORS.primaryColor,
    },
    unitToggleTextActive: {
      fontWeight: 'bold',
    },
    axisLabel: {
      color: COLORS.text,
      fontSize: 12,
    },
    recordSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 20,
    },
    lastWeightText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: COLORS.text,
    },
    lastWeightValue: {
      fontSize: 18,
      color: COLORS.text,
    },
    recordButton: {
      // backgroundColor: 'red',
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    historyCard: {
      backgroundColor: COLORS.cardBackground,
      borderRadius: 10,
      marginHorizontal: 20,
      padding: 20,
      marginTop: 10,
    },
    historyTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: COLORS.text,
    },
    historyItem: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: COLORS.cardBorder,
      paddingVertical: 10,
    },
    historyDate: {
      color: COLORS.subText,
    },
    historyWeight: {
      fontWeight: 'bold',
      color: COLORS.text,
      marginEnd: 30,
    },
    historySpacer: {
      flex: 1,
    },
    tooltipContainer: {
      backgroundColor: 'rgba(0,0,0,0.8)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    tooltipDate: {
      color: '#fff',
      fontSize: 10,
    },
    tooltipValue: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
    },
  });
