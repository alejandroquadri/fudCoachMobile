import { Card, Text } from '@rneui/themed';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { EmtpyCardStyles } from '../LogStyles';
import { EmptyCardInterface } from '@types';

interface EmptyCardProps {
  cardType: EmptyCardInterface;
  isLoading: boolean;
}

export const EmptyCard: React.FC<EmptyCardProps> = ({
  cardType,
  isLoading,
}) => {
  const styles = EmtpyCardStyles();
  return (
    <Card containerStyle={styles.emptyCard}>
      <View style={styles.emptyHeader}>
        <Text style={styles.emptyTitle}>{cardType.type}</Text>
        {isLoading && (
          <ActivityIndicator
            style={styles.spinner}
            size="small"
            color="black"
          />
        )}
      </View>

      <View style={styles.emptyTextContainer}>
        <Text>No logs yet</Text>
      </View>
    </Card>
  );
};
