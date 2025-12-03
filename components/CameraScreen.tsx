import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, Feather } from '@expo/vector-icons';

interface CameraScreenProps {
  onPictureTaken: (uri: string) => void;
  onClose: () => void;
}

interface CameraRef {
  takePictureAsync: () => Promise<{ uri: string }>;
}

export const CameraScreen: React.FC<CameraScreenProps> = ({
  onPictureTaken,
  onClose,
}) => {
  const cameraRef = useRef<CameraRef | null>(null);

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      onPictureTaken(photo.uri);
    }
  };

  const pickFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      onPictureTaken(result.assets[0].uri);
    }
  };

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
