import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

const TestScreen = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const cameraRef = useRef(null);
  const device = useCameraDevices('back'); // Use the back camera

  // Requesting camera permission
  useEffect(() => {
    const getCameraPermission = async () => {
      const status = await Camera.requestCameraPermission();
      if (status === 'denied') {
        Alert.alert('Permission Denied', 'Camera permission is required to take photos');
      }
      setHasPermission(status === 'authorized');
    };

    getCameraPermission();
  }, []);

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePhoto({
        qualityPrioritization: 'balanced',
      });
      setPhotoUri(photo.path); // Save the photo URI for displaying
    }
  };

//   Show loading if camera device is not ready or permissions not granted
  if (device == null || !hasPermission) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading Camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {photoUri ? (
        <Image source={{ uri: 'file://' + photoUri }} style={styles.image} />
      ) : (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          ref={cameraRef}
          photo={true}
        />
      )}

      <TouchableOpacity onPress={takePhoto} style={styles.captureButton}>
        <Text style={styles.captureText}>Take Photo</Text>
      </TouchableOpacity>

      {photoUri && (
        <TouchableOpacity
          onPress={() => setPhotoUri(null)}
          style={styles.clearButton}
        >
          <Text style={styles.clearText}>Retake Photo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color:'black'
  },
  captureButton: {
    position: 'absolute',
    bottom: 50,
    width: 150,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureText: {
    color: 'white',
    fontSize: 18,
  },
  clearButton: {
    position: 'absolute',
    bottom: 120,
    width: 150,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearText: {
    color: 'white',
    fontSize: 18,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
});

export default TestScreen;
