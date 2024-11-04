import { StyleSheet } from 'react-native';

export const GoalStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F5F5',
    },
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      marginHorizontal: 20,
      padding: 20,
      marginTop: 10,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      overflow: 'hidden',
      elevation: 5,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    unitToggleContainer: {
      flexDirection: 'row',
      backgroundColor: '#F0F0F0',
      borderRadius: 20,
    },
    unitToggleText: {
      padding: 8,
      color: 'gray',
    },
    unitToggleTextActive: {
      color: '#333',
      fontWeight: 'bold',
    },
    axisLabel: {
      color: '#666',
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
      color: '#333',
    },
    lastWeightValue: {
      fontSize: 18,
      color: '#333',
    },
    recordButton: {
      backgroundColor: '#2196F3',
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    historyCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      marginHorizontal: 20,
      padding: 20,
      marginTop: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
    },
    historyTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333',
    },
    historyItem: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
      paddingVertical: 10,
    },
    historyDate: {
      color: '#666',
    },
    historyWeight: {
      fontWeight: 'bold',
      color: '#333',
      marginEnd: 30,
    },
    historySpacer: {
      flex: 1,
    },
  });
