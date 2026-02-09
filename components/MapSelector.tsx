import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import * as Location from 'expo-location';
import { MapPin, Navigation } from 'lucide-react-native';

interface MapSelectorProps {
  onLocationSelected: (location: {
    latitude: number;
    longitude: number;
  }) => void;
}

export default function MapSelector({ onLocationSelected }: MapSelectorProps) {
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Location permission is required to use this feature.'
        );
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(coords);
      setLoading(false);
    } catch (error) {
      console.error('Error getting location:', error);
      setLoading(false);
    }
  };

  const handleMapPress = (event: MapPressEvent) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation(coordinate);
  };

  const handleStartTracking = () => {
    if (selectedLocation) {
      onLocationSelected(selectedLocation);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation?.latitude || 37.78825,
          longitude: userLocation?.longitude || -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}
      >
        {userLocation && (
          <Marker coordinate={userLocation} title="Your Location">
            <View style={styles.userMarker}>
              <Navigation size={24} color="#007AFF" fill="#007AFF" />
            </View>
          </Marker>
        )}
        {selectedLocation && (
          <Marker coordinate={selectedLocation} title="Target Location">
            <View style={styles.targetMarker}>
              <MapPin size={32} color="#FF3B30" fill="#FF3B30" />
            </View>
          </Marker>
        )}
      </MapView>

      {selectedLocation && (
        <View style={styles.infoPanel}>
          <View style={styles.coordsContainer}>
            <Text style={styles.label}>Selected Location:</Text>
            <Text style={styles.coords}>
              Lat: {selectedLocation.latitude.toFixed(6)}
            </Text>
            <Text style={styles.coords}>
              Lon: {selectedLocation.longitude.toFixed(6)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.trackButton}
            onPress={handleStartTracking}
          >
            <Navigation size={20} color="#fff" />
            <Text style={styles.trackButtonText}>Start AR Tracking</Text>
          </TouchableOpacity>
        </View>
      )}

      {!selectedLocation && (
        <View style={styles.instructionPanel}>
          <MapPin size={24} color="#8E8E93" />
          <Text style={styles.instructionText}>
            Tap anywhere on the map to select a location
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#8E8E93',
  },
  map: {
    flex: 1,
  },
  userMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  targetMarker: {
    alignItems: 'center',
  },
  infoPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  coordsContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8,
  },
  coords: {
    fontSize: 15,
    color: '#000',
    marginTop: 4,
  },
  trackButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  instructionPanel: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    color: '#8E8E93',
  },
});
