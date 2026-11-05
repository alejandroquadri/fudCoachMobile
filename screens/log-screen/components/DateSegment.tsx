import { useLanguageUpdates, localeTag } from '../../../localization';
import React from 'react';
import { View } from 'react-native';
import { Button, Icon, Text } from '@rneui/themed';
import { DateSegmentStyles } from '../LogStyles';

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
  useLanguageUpdates();
  const styles = DateSegmentStyles();
  return (
    <View style={styles.dateSegment}>
      <Button
        onPress={onSubtractDay}
        icon={<Icon name="chevron-left" type="feather" size={24} />}
        type="clear"
      />
      <Text style={styles.dateText}>
        {currentDate.toLocaleDateString(localeTag(), { dateStyle: 'long' })}
      </Text>
      <Button
        onPress={onAddDay}
        icon={<Icon name="chevron-right" type="feather" size={24} />}
        type="clear"
      />
    </View>
  );
};
