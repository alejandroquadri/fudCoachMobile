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
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '@rneui/themed';
import { COLORS } from '@theme';
import { coachMemoryApi, CoachMemory } from '../../api/CoachMemoryApi';
import { ConfigStackParamList } from './ConfigStack';

type Props = NativeStackScreenProps<ConfigStackParamList, 'CoachMemoryScreen'>;
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
  const [memory, setMemory] = useState<CoachMemory | null>(null);
  const [saved, setSaved] = useState<CoachMemory | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const dirty =
    !!memory && !!saved && fields.some(({ key }) => memory[key] !== saved[key]);

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
      const { revision, goals, relationships, preferences, context } = memory;
      const result = await coachMemoryApi.save({
        revision,
        goals,
        relationships,
        preferences,
        context,
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

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}>
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
          <ActivityIndicator accessibilityLabel="Loading coach memory" />
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
                placeholderTextColor="#737373"
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
        {!!error && (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        )}
        {!loading && !memory && (
          <Button
            title="Try again"
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
  screen: { flex: 1 },
  container: { padding: 20, paddingBottom: 48 },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primaryColor,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#525252',
    marginBottom: 16,
  },
  field: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  input: {
    minHeight: 110,
    borderWidth: 1,
    borderColor: '#d4d4d4',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
    color: '#171717',
    fontSize: 16,
    lineHeight: 23,
  },
  count: { textAlign: 'right', color: '#737373', fontSize: 12, marginTop: 4 },
  error: { color: COLORS.danger, marginBottom: 16 },
  save: { borderRadius: 12, backgroundColor: COLORS.accentColor },
  updated: {
    color: '#737373',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
  },
});
