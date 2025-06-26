import styles from '@/styles/styles';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';


// const MapScreen = () => (
//     <View style={styles.container}>
//         <Text style={styles.text}>Map Screen</Text>
//     </View>
// );

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [loaded, setLoaded] = useState(true);
  const [errorMsg, seErrorMsg] = useState(null);

  useEffect(() => {
    (async() => {
      try {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission access was denied');
        setErrorMsg('Permission denied');
        setLoaded(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      console.log("Location fetched:", location.coords);
      setLocation(location.coords);
    } catch (err) {
      console.error("Location fetch error:", err);
      setErrorMsg('Error fetching location');
    } finally {
      setLoaded(false);
    }
    }) ();
  }, []);

  if (loaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Fetching current location...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: 'red' }}>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: 'red' }}>No location data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation={true}
        initialRegion={{
          latitude: location.latitude,        // Default location
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={location} title="You are here" />
      </MapView>
    </View>
  );
}

