import { tr, useLanguageUpdates } from '../../../localization';
import React from 'react';
import { View } from 'react-native';
import { Card, Button, Text } from '@rneui/themed';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { WaterLogStyles } from '../LogStyles';
import { WaterLog } from '@types';
import { COLORS } from '@theme';
import { color } from '@rneui/base';

interface WaterIntakeCardProps {
  waterLog?: WaterLog;
  handleIncrease: () => void;
  handleDecrease: () => void;
}

export const WaterIntakeCard: React.FC<WaterIntakeCardProps> = ({
  waterLog,
  handleIncrease,
  handleDecrease,
}) => {
  useLanguageUpdates();
  const styles = WaterLogStyles();
  const waterCups = waterLog?.waterCups ?? 0;
  return (
    <Card containerStyle={styles.waterCard}>
      <View style={styles.waterHeader}>
        <Text style={styles.waterTitle}>{tr('Water')}</Text>
        <Text style={styles.waterGoal}>{tr('Goal: 8 cups')}</Text>
        <Text style={styles.totalWater}>
          {tr('Total Water:')}
          {waterCups} {tr('cups')}
        </Text>
      </View>

      <View style={styles.waterRow}>
        <Button
          title="-"
          titleStyle={{ color: COLORS.secondaryColor, fontWeight: 'bold' }}
          type="clear"
          onPress={handleDecrease}
        />
        <View style={styles.cupsContainer}>
          {Array.from({ length: 8 }, (_, index) => (
            <MaterialIcons
              key={index}
              name="local-drink"
              size={23}
              color={
                index < waterCups ? COLORS.accentColor : COLORS.secondaryColor
              }
              style={styles.glassIcon}
            />
          ))}
        </View>
        <Button
          title="+"
          type="clear"
          onPress={handleIncrease}
          titleStyle={{ color: COLORS.secondaryColor, fontWeight: 'bold' }}
        />
      </View>
    </Card>
  );
};
