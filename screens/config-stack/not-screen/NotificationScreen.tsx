// @screens/config/NotificationsScreen.tsx
import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Text, Switch, Icon, Card, BottomSheet, Button } from '@rneui/themed';
import { COLORS, SharedStyles } from '@theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ConfigStackParamList } from '../ConfigStack';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { format, setHours, setMinutes } from 'date-fns';
import { NotificationKey } from '@types';
import { useCurrentUser } from '@hooks';
import { updateNotSetting } from '@services';
import { getIana, hhmmToDate } from '@utils';

// Fake API client — swap with your real one
const updateNotificationSetting = async (
  userId: string,
  key: NotificationKey,
  patch: Partial<NotificationSetting>
) => {
  // Example: PUT /config/notifications/:key
  await updateNotSetting(userId, key, patch);
  return;
};

type Props = NativeStackScreenProps<
  ConfigStackParamList,
  'NotificationsScreen'
>;

type NotificationSetting = {
  enabled: boolean;
  hourLocal: string;
  timezone: string;
};

export const NotificationsScreen = ({ navigation }: Props) => {
  const styles = SharedStyles();
  const user = useCurrentUser();

  const { tz } = getIana();

  const now = useMemo(() => new Date(), []);
  const [dailyPlanner, setDailyPlanner] = useState<NotificationSetting>({
    enabled: true,
    hourLocal: format(setMinutes(setHours(now, 9), 0), 'HH:mm'),
    timezone: tz,
  });
  const [lunchLogReminder, setLunchReminder] = useState<NotificationSetting>({
    enabled: true,
    hourLocal: format(setMinutes(setHours(now, 9), 0), 'HH:mm'),
    timezone: tz,
  });
  const [dinnerLogReminder, setDinnerReminder] = useState<NotificationSetting>({
    enabled: false,
    hourLocal: format(setMinutes(setHours(now, 9), 0), 'HH:mm'),
    timezone: tz,
  });

  // Map helpers so generic handlers can touch the right slice
  const setters: Record<
    NotificationKey,
    React.Dispatch<React.SetStateAction<NotificationSetting>>
  > = {
    dailyPlanner: setDailyPlanner,
    lunchLogReminder: setLunchReminder,
    dinnerLogReminder: setDinnerReminder,
  };
  const stateByKey: Record<NotificationKey, NotificationSetting> = {
    dailyPlanner,
    lunchLogReminder,
    dinnerLogReminder,
  };

  // ========== ONE public handler for toggles ==========
  const handleToggle = useCallback(
    async (key: NotificationKey, enabled: boolean) => {
      const prev = stateByKey[key];
      // optimistic UI
      setters[key](s => ({ ...s, enabled }));

      try {
        await updateNotificationSetting(user._id, key, {
          enabled,
          timezone: tz,
        });
      } catch (err) {
        // rollback on failure
        setters[key](s => ({ ...s, enabled: prev.enabled }));
        console.warn('Toggle failed:', err);
      }
    },
    [setters, stateByKey]
  );

  // ======= BottomSheet time picker  =======
  const [activePicker, setActivePicker] = useState<NotificationKey | null>(
    null
  );
  const [tempTime, setTempTime] = useState<Date>(now);

  const openPicker = (key: NotificationKey, enabled: boolean) => {
    if (!enabled) return;
    setTempTime(hhmmToDate(stateByKey[key].hourLocal));
    setActivePicker(key);
  };
  const closeSheet = () => setActivePicker(null);

  const onChangeTempTime = (_e: DateTimePickerEvent, date?: Date) => {
    if (date) setTempTime(date);
  };

  const saveTime = useCallback(async () => {
    if (!activePicker) return;
    const key = activePicker;
    const prev = stateByKey[key];

    // optimistic UI
    const hourLocal = format(tempTime, 'HH:mm');
    setters[key](s => ({ ...s, hourLocal: hourLocal }));

    // hourLocal is just the selected time formatted in the device's local zone
    // const hourLocal = format(tempTime, 'HH:mm'); // e.g., "09:00"

    try {
      // Persist as ISO; backend should store UTC
      await updateNotificationSetting(user._id, key, {
        hourLocal: hourLocal,
        timezone: tz,
      });
      closeSheet();
    } catch (err) {
      // rollback
      setters[key](s => ({ ...s, hourLocal: prev.hourLocal }));
      console.warn('Time update failed:', err);
      closeSheet();
    }
  }, [activePicker, tempTime, setters, stateByKey]);

  // ======= Card renderer (now dumb; uses the outside handlers) =======
  const renderCard = (
    key: NotificationKey,
    title: string,
    setting: NotificationSetting
  ) => {
    const disabled = !setting.enabled;
    return (
      <Card containerStyle={notStyles.card}>
        <View style={notStyles.rowTop}>
          <Text style={notStyles.cardTitle}>{title}</Text>
          <Switch
            value={setting.enabled}
            onValueChange={v => handleToggle(key, v)} // <-- uses outside handler
          />
        </View>

        <TouchableOpacity
          activeOpacity={disabled ? 1 : 0.6}
          onPress={() => openPicker(key, setting.enabled)}
          disabled={disabled}
          style={[notStyles.rowBottom, disabled && notStyles.rowDisabled]}>
          <Text
            style={[notStyles.timeLabel, disabled && notStyles.textDisabled]}>
            Time
          </Text>
          <View style={notStyles.timeRight}>
            <Text
              style={[notStyles.timeValue, disabled && notStyles.textDisabled]}>
              {setting.hourLocal}
            </Text>
            {!disabled && (
              <Icon
                name="clock"
                type="feather"
                size={18}
                color={COLORS.primaryColor}
                containerStyle={{ marginLeft: 6 }}
              />
            )}
          </View>
        </TouchableOpacity>
      </Card>
    );
  };

  return (
    <View style={notStyles.container}>
      <View style={styles.header}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name="chevron-left"
              type="feather"
              size={28}
              color={COLORS.primaryColor}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text h4 style={notStyles.title}>
        Notifications
      </Text>

      {renderCard('dailyPlanner', 'Daily planner', dailyPlanner)}
      {renderCard('lunchLogReminder', 'Lunch log reminder', lunchLogReminder)}
      {renderCard(
        'dinnerLogReminder',
        'Dinner log reminder',
        dinnerLogReminder
      )}

      <BottomSheet isVisible={!!activePicker} onBackdropPress={closeSheet}>
        <View style={notStyles.sheetContainer}>
          <View style={notStyles.sheetHandle} />
          <Text style={notStyles.sheetTitle}>Select time</Text>

          <View style={notStyles.pickerWrapper}>
            <DateTimePicker
              value={tempTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeTempTime}
            />
          </View>

          <View style={notStyles.sheetButtons}>
            <Button
              type="clear"
              title="Cancel"
              onPress={closeSheet}
              buttonStyle={notStyles.btnCancel}
            />
            <Button
              title="Save"
              onPress={saveTime}
              buttonStyle={notStyles.btnSave}
            />
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

const notStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    flexGrow: 1,
  },
  title: { marginBottom: 16 },
  card: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 0,
    marginBottom: 14,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  rowBottom: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowDisabled: { opacity: 0.4 },
  timeLabel: { fontSize: 14 },
  timeRight: { flexDirection: 'row', alignItems: 'center' },
  timeValue: { fontSize: 16, fontWeight: '600' },
  textDisabled: { color: '#999' },
  sheetContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ddd',
    marginBottom: 8,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  pickerWrapper: { alignItems: 'center', paddingVertical: 6 },
  sheetButtons: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnCancel: { paddingHorizontal: 18 },
  btnSave: { paddingHorizontal: 18 },
});
