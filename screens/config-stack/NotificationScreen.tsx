// @screens/config/NotificationsScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Switch } from '@rneui/themed';

export const NotificationsScreen = () => {
  // wire real state later
  const [enabled, setEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <Text h4 style={styles.title}>
        Notifications
      </Text>

      <View style={styles.row}>
        <Text>Daily check-in reminder</Text>
        <Switch value={enabled} onValueChange={setEnabled} />
      </View>

      {/* More toggles, time pickers, etc. */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, backgroundColor: '#F2F2F2' },
  title: { marginBottom: 16 },
  row: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
