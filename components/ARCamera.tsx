import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import {
  Magnetometer,
  Accelerometer,
  Gyroscope,
} from 'expo-sensors';
import { ArrowLeft, Navigation } from 'lucide-react-native';
import {
  getBearing,
  getDistance,
  formatDistance,
  normalizeAngle,
} from '@/utils/geospatial';

interface ARCameraProps {
  targetLocation: {
    latitude: number;
    longitude: number;
  };
  onBack: () => void;
}

const { width, height } = Dimensions.get('window');
const FOV = 60;

export default function ARCamera({ targetLocation, onBack }: ARCameraProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [heading, setHeading] = useState(0);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [targetBearing, setTargetBearing] = useState(0);
  const [distance, setDistance] = useState(0);
  const [markerPosition, setMarkerPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const magnetometerSubscription = useRef<any>(null);
  const locationSubscription = useRef<any>(null);

  useEffect(() => {
    setupSensors();
    setupLocation();

    return () => {
      if (magnetometerSubscription.current) {
        magnetometerSubscription.current.remove();
      }
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (userLocation) {
      const bearing = getBearing(
        userLocation.latitude,
        userLocation.longitude,
        targetLocation.latitude,
        targetLocation.longitude
      );
      const dist = getDistance(
        userLocation.latitude,
        userLocation.longitude,
        targetLocation.latitude,
        targetLocation.longitude
      );

      setTargetBearing(bearing);
      setDistance(dist);
      updateMarkerPosition(bearing);
    }
  }, [userLocation, heading, targetLocation]);

  const setupSensors = async () => {
    Magnetometer.setUpdateInterval(100);
    magnetometerSubscription.current = Magnetometer.addListener((data) => {
      const angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
      const normalizedHeading = normalizeAngle(angle);
      setHeading(normalizedHeading);
    });
  };

  const setupLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Location permission is required for AR tracking.'
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 1,
        },
        (location) => {
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      );
    } catch (error) {
      console.error('Error setting up location:', error);
    }
  };

  const updateMarkerPosition = (bearing: number) => {
    let angleDiff = bearing - heading;

    if (angleDiff > 180) {
      angleDiff -= 360;
    } else if (angleDiff < -180) {
      angleDiff += 360;
    }

    const halfFOV = FOV / 2;
    const visible = Math.abs(angleDiff) <= halfFOV;
    setIsVisible(visible);

    if (visible) {
      const normalizedAngle = angleDiff / halfFOV;
      const x = (width / 2) + (normalizedAngle * (width / 2));
      const y = height / 2;

      setMarkerPosition({ x, y });
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          Camera permission is required for AR tracking
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back">
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ArrowLeft size={24} color="#fff" />
            <Text style={styles.backButtonText}>Back to Map</Text>
          </TouchableOpacity>

          <View style={styles.infoContainer}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Distance</Text>
              <Text style={styles.infoValue}>{formatDistance(distance)}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Bearing</Text>
              <Text style={styles.infoValue}>{targetBearing.toFixed(0)}°</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Heading</Text>
              <Text style={styles.infoValue}>{heading.toFixed(0)}°</Text>
            </View>
          </View>

          {isVisible && (
            <View
              style={[
                styles.markerContainer,
                {
                  left: markerPosition.x - 30,
                  top: markerPosition.y - 60,
                },
              ]}
            >
              <View style={styles.marker}>
                <View style={styles.markerArrow} />
                <Text style={styles.markerText}>{formatDistance(distance)}</Text>
              </View>
            </View>
          )}

          {!isVisible && (
            <View style={styles.notVisibleContainer}>
              <Navigation size={32} color="#fff" />
              <Text style={styles.notVisibleText}>
                Turn around to see the target
              </Text>
              <Text style={styles.notVisibleSubtext}>
                Target is {targetBearing.toFixed(0)}° from north
              </Text>
            </View>
          )}

          <View style={styles.centerCrosshair}>
            <View style={styles.crosshairLine} />
            <View style={[styles.crosshairLine, styles.crosshairLineVertical]} />
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  infoCard: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  infoLabel: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 4,
  },
  infoValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  markerContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  marker: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
    borderRadius: 8,
    padding: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  markerArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff',
    marginBottom: 4,
  },
  markerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  notVisibleContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 16,
    padding: 20,
  },
  notVisibleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  notVisibleSubtext: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  centerCrosshair: {
    position: 'absolute',
    top: height / 2 - 15,
    left: width / 2 - 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crosshairLine: {
    position: 'absolute',
    width: 30,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  crosshairLineVertical: {
    width: 2,
    height: 30,
  },
  permissionText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
