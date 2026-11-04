import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Platform,
  Image,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { CameraView } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Feather from '@react-native-vector-icons/feather';
import Ionicons from '@react-native-vector-icons/ionicons';
import { v4 as uuidv4 } from 'uuid';

interface CameraScreenProps {
  onPictureTaken: (uri: string, caption: string, requestId: string) => void;
  onClose: () => void;
}

export const CameraScreen: React.FC<CameraScreenProps> = ({
  onPictureTaken,
  onClose,
}) => {
  const cameraRef = useRef<CameraView | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [requestId, setRequestId] = useState('');
  const sendingRef = useRef(false);

  const selectPhoto = (uri: string) => {
    setPhotoUri(uri);
    setRequestId(uuidv4());
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) {
        selectPhoto(photo.uri);
      }
    }
  };

  const pickFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      selectPhoto(result.assets[0].uri);
    }
  };

  const sendPhoto = () => {
    if (!photoUri || sendingRef.current) return;
    sendingRef.current = true;
    onPictureTaken(photoUri, caption, requestId);
  };

  if (photoUri) {
    return (
      <KeyboardAvoidingView
        style={styles.previewContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Image
          source={{ uri: photoUri }}
          style={styles.previewImage}
          resizeMode="contain"
        />
        <View style={styles.previewControls}>
          <Text style={styles.previewTitle}>Add a note (optional)</Text>
          <TextInput
            style={styles.captionInput}
            placeholder="e.g. Chicken cooked in olive oil, about 150 g"
            placeholderTextColor="#777"
            multiline
            maxLength={1500}
            value={caption}
            onChangeText={setCaption}
            accessibilityLabel="Meal photo note"
          />
          <View style={styles.previewActions}>
            <TouchableOpacity
              onPress={() => setPhotoUri(null)}
              style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Retake or replace</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={sendPhoto} style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Send to coach</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={'back'}
        autofocus={'on'}
      />

      {/* Cancel button (top-right) */}
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Feather name="x" size={28} color="white" />
      </TouchableOpacity>

      {/* Snap + Library controls */}
      <View style={styles.bottomControls}>
        {/* Snap button (center) */}
        <TouchableOpacity onPress={takePhoto} style={styles.snapButtonOuter}>
          <View style={styles.snapButtonInner} />
        </TouchableOpacity>
        {/* Library button (bottom-right) */}
        <TouchableOpacity
          onPress={pickFromLibrary}
          style={styles.libraryButton}>
          <Ionicons name="images-outline" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  previewContainer: { flex: 1, backgroundColor: '#fff' },
  previewImage: { flex: 1, backgroundColor: 'black' },
  previewControls: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  previewTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
    color: '#222',
  },
  captionInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    minHeight: 72,
    maxHeight: 120,
    padding: 10,
    color: '#222',
    textAlignVertical: 'top',
  },
  previewActions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  secondaryButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#40bebb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: { color: '#238b88', fontWeight: '600' },
  sendButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#238b88',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: { color: 'white', fontWeight: '600' },
  cancelButton: { alignItems: 'center', paddingTop: 14 },
  camera: { flex: 1 },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    zIndex: 10,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  snapButtonOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },

  snapButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  libraryButton: {
    position: 'absolute',
    left: 30,
    bottom: 20,
  },
  message: {
    marginTop: 100,
    textAlign: 'center',
    color: 'white',
  },
  permissionButton: {
    color: 'dodgerblue',
    textAlign: 'center',
    marginTop: 20,
  },
});
