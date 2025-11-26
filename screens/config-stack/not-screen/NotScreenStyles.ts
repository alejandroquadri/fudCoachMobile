import { COLORS } from '@theme';
import { StyleSheet } from 'react-native';

export const notStyles = StyleSheet.create({
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
  textDisabled: { color: COLORS.subText },
  sheetContainer: {
    backgroundColor: COLORS.cardBackground,
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
    backgroundColor: COLORS.cardBackground,
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
  btnCancelText: { color: COLORS.subText },
  btnSave: { paddingHorizontal: 18 },
  btnSaveText: { color: COLORS.accentColor, fontWeight: 'bold' },
});
