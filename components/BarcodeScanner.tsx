import { tr, useLanguageUpdates } from '../localization';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CameraView } from 'expo-camera';
import { v4 as uuidv4 } from 'uuid';
import type { IMessage } from 'react-native-gifted-chat';
import { aiApi } from '../api';
import type { BarcodeProduct } from '../api/AiApi';
import { sendBarcodeMeal } from '../services/ChatService';
import { COLORS } from '@theme';
import Ionicons from '@react-native-vector-icons/ionicons';

type Props = {
  onClose: () => void;
  onLogged: (message: IMessage, description: string) => void;
};

export const BarcodeScanner = ({ onClose, onLogged }: Props) => {
  useLanguageUpdates();
  const [product, setProduct] = useState<BarcodeProduct | null>(null);
  const [grams, setGrams] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastCode, setLastCode] = useState('');
  const [attempted, setAttempted] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const busy = useRef(false);
  const requestId = useRef(uuidv4());

  const lookup = async (barcode: string) => {
    if (busy.current) return;
    busy.current = true;
    setLoading(true);
    setError('');
    setLastCode(barcode);
    try {
      const found = await aiApi.lookupBarcode(barcode);
      setProduct(found);
      setImageFailed(false);
      setGrams(found.servingGrams ? String(found.servingGrams) : '');
      setAttempted(false);
      requestId.current = uuidv4();
    } catch (e) {
      const code = (e as { response?: { data?: { code?: string } } }).response
        ?.data?.code;
      setError(
        code === 'not_found'
          ? tr(
              "We couldn't find this product. Try another barcode or use a photo instead."
            )
          : code === 'incomplete'
            ? tr(
                "This product doesn't have enough nutrition information. Try another barcode or use a photo instead."
              )
            : tr('Product lookup is unavailable. Please try again.')
      );
    } finally {
      busy.current = false;
      setLoading(false);
    }
  };

  const log = async () => {
    const amount = Number(grams.replace(',', '.'));
    if (!product || busy.current) return;
    if (!Number.isFinite(amount) || amount <= 0 || amount > 10000) {
      setError(tr('Enter an amount between 0 and 10,000 g.'));
      return;
    }
    busy.current = true;
    setLoading(true);
    setAttempted(true);
    setError('');
    try {
      const answer = await sendBarcodeMeal(
        product,
        amount,
        requestId.current,
        note.trim()
      );
      onLogged(
        answer,
        tr('Log {{grams}} g of {{product}} (barcode {{barcode}}).', {
          grams: amount,
          product: [product.brand, product.name].filter(Boolean).join(' - '),
          barcode: product.barcode,
        }) + (note.trim() ? ` ${note.trim()}` : '')
      );
    } catch (e) {
      const code = (e as { response?: { data?: { code?: string } } }).response
        ?.data?.code;
      setError(
        code === 'changed'
          ? tr(
              'The product information changed. Scan it again to review the updated information.'
            )
          : tr('Could not log this product. Retry to send the same amount.')
      );
    } finally {
      busy.current = false;
      setLoading(false);
    }
  };

  if (!product)
    return (
      <View style={styles.container}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          autofocus="off"
          barcodeScannerSettings={{
            barcodeTypes: ['ean13', 'ean8', 'upc_a'],
          }}
          onBarcodeScanned={
            !loading && !error ? result => void lookup(result.data) : undefined
          }
        />
        <View style={styles.scanOverlay}>
          <Text style={styles.scanTitle}>{tr('Scan a food barcode')}</Text>
          <View style={styles.frame} />
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.scanText}>
              {error || 'Place the barcode inside the frame.'}
            </Text>
          )}
          {Boolean(error && lastCode) && (
            <TouchableOpacity
              onPress={() => void lookup(lastCode)}
              style={styles.button}>
              <Text style={styles.buttonText}>{tr('Retry lookup')}</Text>
            </TouchableOpacity>
          )}
          {Boolean(error) && (
            <TouchableOpacity
              onPress={() => setError('')}
              style={styles.outline}>
              <Text style={styles.buttonText}>
                {tr('Scan another barcode')}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onClose} style={styles.outline}>
            <Text style={styles.buttonText}>{tr('Back to camera')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{tr('Confirm product')}</Text>
        <Text style={styles.subtitle}>
          {tr('Check the details before logging your food.')}
        </Text>
        <View style={styles.productCard}>
          {product.imageUrl && !imageFailed && (
            <Image
              source={{ uri: product.imageUrl }}
              style={styles.image}
              resizeMode="contain"
              onError={() => setImageFailed(true)}
            />
          )}
          <View style={styles.productInfo}>
            <Text style={styles.product}>{product.name}</Text>
            {!!product.brand && (
              <Text style={styles.brand}>{product.brand}</Text>
            )}
          </View>
        </View>
        <View style={styles.nutritionCard}>
          <Text style={styles.sectionTitle}>
            {tr('Nutrition')}
            <Text style={styles.perAmount}>{tr('per 100 g')}</Text>
          </Text>
          <View style={styles.nutrientRow}>
            {(
              [
                ['Calories', product.per100g.calories, 'kcal'],
                [tr('Protein'), product.per100g.protein, 'g'],
                [tr('Carbs'), product.per100g.carbs, 'g'],
                [tr('Fat'), product.per100g.fat, 'g'],
              ] as const
            ).map(([label, value, unit]) => (
              <View key={label} style={styles.nutrient}>
                <Text style={styles.nutrientValue}>
                  {Number(value.toFixed(1))}
                  <Text style={styles.nutrientUnit}> {unit}</Text>
                </Text>
                <Text style={styles.nutrientLabel}>{tr(label)}</Text>
              </View>
            ))}
          </View>
        </View>
        <Text style={styles.source}>
          {tr('Product data: Open Food Facts. Check it against the package.')}
        </Text>
        <Text style={styles.label}>{tr('How much did you eat? (g)')}</Text>
        <TextInput
          style={styles.input}
          value={grams}
          onChangeText={setGrams}
          keyboardType="decimal-pad"
          editable={!loading && !attempted}
          accessibilityLabel={tr('Amount eaten in grams')}
          placeholder={tr('e.g. 150')}
        />
        {product.servingGrams && (
          <Text style={styles.detail}>
            {tr('Listed serving:')}
            {product.servingGrams} g
          </Text>
        )}
        <Text style={styles.label}>{tr('Note (optional)')}</Text>
        <TextInput
          style={styles.input}
          value={note}
          onChangeText={setNote}
          editable={!loading && !attempted}
          maxLength={1000}
          multiline
          accessibilityLabel={tr('Meal note')}
          placeholder={tr('Add any details for your coach')}
        />
        {!!error && <Text style={styles.error}>{error}</Text>}
        <View style={styles.actions}>
          <TouchableOpacity
            disabled={loading}
            onPress={() => void log()}
            style={styles.logButton}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>
                {attempted ? tr('Retry') : tr('Log food')}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            disabled={loading}
            onPress={() => {
              setProduct(null);
              setError('');
              setLastCode('');
            }}
            style={styles.secondary}>
            <Ionicons name="barcode-outline" size={20} color={COLORS.text} />
            <Text style={styles.secondaryText}>
              {tr('Scan another barcode')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={loading}
            onPress={onClose}
            style={styles.backButton}>
            <Ionicons name="arrow-back" size={18} color={COLORS.subText} />
            <Text style={styles.secondaryText}>{tr('Back to camera')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  scanOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 18,
  },
  scanTitle: { color: 'white', fontSize: 22, fontWeight: '600' },
  scanText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.65)',
    padding: 8,
  },
  frame: {
    width: '85%',
    height: 160,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 12,
  },
  page: { flex: 1, backgroundColor: 'white' },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    gap: 12,
  },
  title: { fontSize: 26, fontWeight: '700', color: COLORS.text },
  subtitle: { color: COLORS.subText, fontSize: 15, marginBottom: 8 },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: COLORS.backgroundColor,
    borderRadius: 16,
  },
  image: {
    width: 78,
    height: 78,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  productInfo: { flex: 1 },
  product: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  brand: { fontSize: 15, color: COLORS.subText, marginTop: 4 },
  nutritionCard: {
    marginTop: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 16,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  perAmount: { color: COLORS.subText, fontSize: 13, fontWeight: '400' },
  nutrientRow: { flexDirection: 'row' },
  nutrient: { flex: 1 },
  nutrientValue: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  nutrientUnit: { fontSize: 11, fontWeight: '400', color: COLORS.subText },
  nutrientLabel: { color: COLORS.subText, fontSize: 12, marginTop: 4 },
  detail: { fontSize: 15, color: '#444', lineHeight: 22 },
  source: { fontSize: 12, color: '#666' },
  label: { fontSize: 15, color: COLORS.text, fontWeight: '600', marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 12,
    padding: 12,
    color: '#222',
    fontSize: 16,
  },
  error: { color: '#aa2626' },
  button: {
    backgroundColor: '#238b88',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 150,
  },
  buttonText: { color: 'white', fontWeight: '600' },
  outline: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
    borderRadius: 10,
  },
  actions: { gap: 10, marginTop: 16 },
  logButton: {
    backgroundColor: '#238b88',
    minHeight: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondary: {
    minHeight: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  secondaryText: { color: COLORS.text, fontWeight: '600' },
});
