import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Icon } from '@rneui/themed';
import { COLORS, SharedStyles } from '@theme';
import {
  coachMemoryApi,
  CoachMemory,
  MealRoutine,
} from '../../api/CoachMemoryApi';
import { ConfigStackParamList } from './ConfigStack';

type Props = NativeStackScreenProps<ConfigStackParamList, 'CoachMemoryScreen'>;
const meals: { key: MealRoutine['meal']; title: string }[] = [
  { key: 'breakfast', title: 'Breakfast' },
  { key: 'lunch', title: 'Lunch' },
  { key: 'snack', title: 'Snack' },
  { key: 'dinner', title: 'Dinner' },
];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const filledRoutines = (routines: MealRoutine[]) =>
  routines.filter(routine => routine.description.trim().length > 0);

const fields = [
  {
    key: 'goals',
    title: 'Goals and important dates',
    hint: 'What you are working toward, why it matters, and any event dates.',
  },
  {
    key: 'relationships',
    title: 'Important people',
    hint: 'Family, friends, and the people who support you.',
  },
  {
    key: 'preferences',
    title: 'Tastes and preferences',
    hint: 'Foods you enjoy or dislike, and how you like to be supported.',
  },
  {
    key: 'context',
    title: 'What else helps your coach',
    hint: 'Routines, challenges, and personal context you want remembered.',
  },
] as const;

export const CoachMemoryScreen = ({ navigation }: Props) => {
  const sharedStyles = SharedStyles();
  const [memory, setMemory] = useState<CoachMemory | null>(null);
  const [saved, setSaved] = useState<CoachMemory | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const dirty =
    !!memory &&
    !!saved &&
    (fields.some(({ key }) => memory[key] !== saved[key]) ||
      JSON.stringify(filledRoutines(memory.routines ?? [])) !==
        JSON.stringify(filledRoutines(saved.routines ?? [])));

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await coachMemoryApi.get();
      setMemory(result);
      setSaved(result);
    } catch {
      setError('Could not load your coach memory. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );
  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', event => {
        if (!dirty || saving) return;
        event.preventDefault();
        Alert.alert('Discard changes?', 'Your edits have not been saved.', [
          { text: 'Keep editing', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.dispatch(event.data.action),
          },
        ]);
      }),
    [navigation, dirty, saving]
  );

  const save = async () => {
    if (!memory || saving) return;
    setSaving(true);
    setError('');
    try {
      const { revision, goals, relationships, preferences, context, routines } =
        memory;
      const result = await coachMemoryApi.save({
        revision,
        goals,
        relationships,
        preferences,
        context,
        routines: filledRoutines(routines ?? []),
      });
      setMemory(result);
      setSaved(result);
      Alert.alert(
        'Memory saved',
        'Your coach will use your updated notes in the next message.'
      );
    } catch (failure) {
      if (
        (failure as { response?: { status?: number } }).response?.status === 409
      ) {
        Alert.alert(
          'Your memory has changed',
          'The coach updated these notes while you were editing. Your draft is still here. Reload to see the latest notes before editing again.',
          [
            { text: 'Keep draft', style: 'cancel' },
            {
              text: 'Reload',
              onPress: () => {
                void load();
              },
            },
          ]
        );
      } else
        setError(
          'Could not save your notes. Your edits are still here. Please try again.'
        );
    } finally {
      setSaving(false);
    }
  };

  const updateRoutine = (
    routine: MealRoutine,
    changes: Partial<MealRoutine>
  ) => {
    setMemory(current => {
      if (!current) return current;
      const existing = current.routines ?? [];
      const found = existing.some(item => item.id === routine.id);
      return {
        ...current,
        routines: found
          ? existing.map(item =>
              item.id === routine.id ? { ...item, ...changes } : item
            )
          : [...existing, { ...routine, ...changes }],
      };
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}>
        <View style={sharedStyles.header}>
          <View style={sharedStyles.backButtonContainer}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Back to settings"
              onPress={() => navigation.goBack()}>
              <Icon
                name="chevron-left"
                type="feather"
                size={28}
                color={COLORS.primaryColor}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.title}>What your coach remembers</Text>
        <Text style={styles.description}>
          Your coach adds useful details you share in chat to help support you.
          Review, correct, or remove anything here. These notes complement your
          profile and onboarding answers.
        </Text>
        <Text style={styles.description}>
          After you save an edit, your coach starts with fresh chat context and
          these notes. Your chat history stays visible.
        </Text>
        {loading ? (
          <ActivityIndicator
            accessibilityLabel="Loading coach memory"
            color={COLORS.accentColor}
          />
        ) : (
          memory &&
          fields.map(({ key, title, hint }) => (
            <View key={key} style={styles.field}>
              <Text style={styles.label}>{title}</Text>
              <TextInput
                accessibilityLabel={title}
                value={memory[key]}
                onChangeText={text =>
                  setMemory(current =>
                    current ? { ...current, [key]: text } : current
                  )
                }
                placeholder={hint}
                placeholderTextColor={COLORS.subText}
                multiline
                maxLength={2000}
                editable={!saving}
                textAlignVertical="top"
                style={styles.input}
              />
              <Text style={styles.count}>{memory[key].length}/2000</Text>
            </View>
          ))
        )}
        {!!memory && !loading && (
          <View style={styles.field}>
            <Text style={styles.label}>Usual meals</Text>
            <Text style={styles.description}>
              Your coach adds meals you describe in chat. You can also add or
              edit them here.
            </Text>
            {meals.map(({ key, title }) => {
              const existing = (memory.routines ?? []).filter(
                routine => routine.meal === key
              );
              const displayed: MealRoutine[] = existing.length
                ? existing
                : [
                    {
                      id: `manual-${key}`,
                      meal: key,
                      weekdays: [],
                      description: '',
                    },
                  ];
              return (
                <View key={key} style={styles.field}>
                  <Text style={styles.label}>{title}</Text>
                  {displayed.map(routine => (
                    <View key={routine.id} style={styles.routine}>
                      <TextInput
                        accessibilityLabel={`${title} foods and portions`}
                        placeholder={`Add your usual ${title.toLowerCase()}`}
                        placeholderTextColor={COLORS.subText}
                        value={routine.description}
                        maxLength={500}
                        multiline
                        editable={!saving}
                        textAlignVertical="top"
                        style={styles.input}
                        onChangeText={description =>
                          updateRoutine(routine, { description })
                        }
                      />
                      <Text style={styles.dayHint}>
                        {routine.weekdays.length
                          ? 'Selected days'
                          : 'Every day'}
                      </Text>
                      <View style={styles.days}>
                        {days.map((day, index) => {
                          const selected = routine.weekdays.includes(index + 1);
                          return (
                            <TouchableOpacity
                              key={day}
                              accessibilityRole="checkbox"
                              accessibilityLabel={`${day} for ${title}`}
                              accessibilityState={{
                                checked: selected,
                                disabled: saving,
                              }}
                              disabled={saving}
                              style={[
                                styles.day,
                                selected && styles.daySelected,
                              ]}
                              onPress={() =>
                                updateRoutine(routine, {
                                  weekdays: selected
                                    ? routine.weekdays.filter(
                                        value => value !== index + 1
                                      )
                                    : [...routine.weekdays, index + 1].sort(
                                        (a, b) => a - b
                                      ),
                                })
                              }>
                              <Text
                                style={[
                                  styles.dayText,
                                  selected && styles.dayTextSelected,
                                ]}
                                numberOfLines={1}
                                adjustsFontSizeToFit>
                                {day}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                      {!!routine.description && (
                        <Button
                          title="Remove usual meal"
                          type="clear"
                          titleStyle={styles.link}
                          disabled={saving}
                          onPress={() =>
                            setMemory(current =>
                              current
                                ? {
                                    ...current,
                                    routines: current.routines.filter(
                                      item => item.id !== routine.id
                                    ),
                                  }
                                : current
                            )
                          }
                        />
                      )}
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
        )}
        {!!error && (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        )}
        {!loading && !memory && (
          <Button
            title="Try again"
            buttonStyle={styles.save}
            onPress={() => {
              void load();
            }}
          />
        )}
        {!!memory && !loading && (
          <>
            <Button
              title="Save memory"
              loading={saving}
              disabled={!dirty || saving}
              onPress={save}
              buttonStyle={styles.save}
            />
            <Button
              title="Clear all notes"
              type="clear"
              titleStyle={styles.link}
              disabled={saving}
              onPress={() =>
                Alert.alert(
                  'Clear coach memory?',
                  'This clears these personal notes when you save. Your profile and onboarding answers stay available.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Clear notes',
                      style: 'destructive',
                      onPress: () =>
                        setMemory(current =>
                          current
                            ? {
                                ...current,
                                goals: '',
                                relationships: '',
                                preferences: '',
                                context: '',
                                routines: [],
                              }
                            : current
                        ),
                    },
                  ]
                )
              }
            />
            {!!saved?.updatedAt && (
              <Text style={styles.updated}>
                Last updated: {new Date(saved.updatedAt).toLocaleString()}
              </Text>
            )}
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.backgroundColor },
  container: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 48 },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primaryColor,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.subText,
    marginBottom: 16,
  },
  field: { marginBottom: 20 },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: COLORS.text,
  },
  routine: { marginBottom: 12 },
  dayHint: { color: COLORS.subText, marginTop: 8, marginBottom: 8 },
  days: { flexDirection: 'row', gap: 4 },
  day: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: COLORS.accentColor,
    borderRadius: 6,
  },
  daySelected: { backgroundColor: COLORS.accentColor },
  dayText: { color: COLORS.accentColor, fontSize: 12 },
  dayTextSelected: { color: COLORS.primaryContrast },
  link: { color: COLORS.accentColor },
  input: {
    minHeight: 110,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 12,
    padding: 12,
    backgroundColor: COLORS.cardBackground,
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 23,
  },
  count: {
    textAlign: 'right',
    color: COLORS.subText,
    fontSize: 12,
    marginTop: 4,
  },
  error: { color: COLORS.danger, marginBottom: 16 },
  save: { borderRadius: 12, backgroundColor: COLORS.accentColor },
  updated: {
    color: COLORS.subText,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
  },
});
