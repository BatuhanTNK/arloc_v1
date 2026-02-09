import { useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import MapSelector from '@/components/MapSelector';
import ARCamera from '@/components/ARCamera';

export default function HomeScreen() {
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [showARCamera, setShowARCamera] = useState(false);

  const handleLocationSelected = (location: {
    latitude: number;
    longitude: number;
  }) => {
    setSelectedLocation(location);
    setShowARCamera(true);
  };

  const handleBackToMap = () => {
    setShowARCamera(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {showARCamera && selectedLocation ? (
        <ARCamera
          targetLocation={selectedLocation}
          onBack={handleBackToMap}
        />
      ) : (
        <MapSelector onLocationSelected={handleLocationSelected} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
