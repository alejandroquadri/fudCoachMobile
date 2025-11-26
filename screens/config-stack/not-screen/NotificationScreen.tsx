import { useCurrentUser } from '@hooks';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomSheet, Button, Card, Icon, Switch, Text } from '@rneui/themed';
import { getNotificationSettings, updateNotSetting } from '@services';
import { COLORS, SharedStyles } from '@theme';
import {
  NotificationKey,
  NotificationSetting,
  NotificationSettingDoc,
} from '@types';
import { getIana, hhmmToDate } from '@utils';
import { format, setHours, setMinutes } from 'date-fns';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { ConfigStackParamList } from '../ConfigStack';
import { notStyles } from './NotScreenStyles';

type Props = NativeStackScreenProps<
  ConfigStackParamList,
  'NotificationsScreen'
>;

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

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const byKey = await getNotificationSettings(user._id);
        console.log(byKey);
        if (!alive || !byKey) return;

        // Helper to map a doc to your local shape
        const pick = (
          doc?: NotificationSettingDoc,
          fallback?: NotificationSetting
        ): NotificationSetting =>
          doc
            ? {
                enabled: doc.enabled,
                hourLocal: doc.hourLocal,
                timezone: doc.timezone,
              }
            : (fallback as NotificationSetting);

        setDailyPlanner(prev => pick(byKey.dailyPlanner, prev));
        setLunchReminder(prev => pick(byKey.lunchLogReminder, prev));
        setDinnerReminder(prev => pick(byKey.dinnerLogReminder, prev));
      } catch (err) {
        console.warn('Failed to load notification settings', err);
        // keep defaults
      }
    })();

    return () => {
      alive = false;
    };
  }, [user._id]);

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
        await updateNotSetting(user._id, key, {
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
      await updateNotSetting(user._id, key, {
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
            color={COLORS.accentColor}
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
              titleStyle={notStyles.btnCancelText}
              buttonStyle={notStyles.btnCancel}
            />
            <Button
              title="Save"
              type="clear"
              onPress={saveTime}
              titleStyle={notStyles.btnSaveText}
              buttonStyle={notStyles.btnSave}
            />
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};
