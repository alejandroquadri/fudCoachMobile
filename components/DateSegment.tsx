import React from 'react';
import { View } from 'react-native';
import { Button, Card, Icon, Text } from '@rneui/themed';
import { format } from 'date-fns';
import { DateSegmentStyles } from '../theme';

interface DateSegmentProps {
  currentDate: Date;
  onSubtractDay: () => void;
  onAddDay: () => void;
}

export const DateSegment: React.FC<DateSegmentProps> = ({
  currentDate,
  onSubtractDay,
  onAddDay,
}) => {
  const styles = DateSegmentStyles();
  return (
    <View style={styles.dateSegment}>
      <Button
        onPress={onSubtractDay}
        icon={<Icon name="chevron-left" type="feather" size={24} />}
        type="clear"
      />
      <Text style={styles.dateText}>{format(currentDate, 'PPP')}</Text>
      <Button
        onPress={onAddDay}
        icon={<Icon name="chevron-right" type="feather" size={24} />}
        type="clear"
      />
    </View>
  );
};
