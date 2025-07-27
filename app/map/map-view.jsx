import styles from '@/styles/styles';
import { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import 'react-native-get-random-values';
import MapView from 'react-native-map-clustering';
import { Marker } from 'react-native-maps';

export default function MapScreen({ location, carparks, userSearch, searchTrigger }) {
    useEffect(() => {
      if (!searchTrigger) return;
    const conductSearch = async () => {
      const cleaned = userSearch.trim();
      if (!cleaned) return;

      try {
        const request = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cleaned)}&key=${API_KEY}`
        );
        const response = await request.json();

        if (response.status === 'OK' && response.results.length > 0) {
          const { lat, lng } = response.results[0].geometry.location;
          mapRef.current?.animateToRegion({
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
          });
        } else {
          Alert.alert('Location not found');
        }
      } catch (error) {
        Alert.alert('Search failed');
      } finally {
        Keyboard.dismiss();
      }
    };

    conductSearch();
  }, [searchTrigger]);

  if (!location) return <Text>No location data available right now</Text>;

  const mapRef = useRef(null);

  const API_KEY = 'AIzaSyDJXyWnsMeJS6iQl0Tm8kKGzmxJ4qxpg18';

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <MapView
          provider="google"
          ref={mapRef}
          style={styles.map}
          showsUserLocation={true}
          clusterColor="#007bff"
          radius={40}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
          }}
        >
          {carparks.map((carpark, index) => {
            if (!carpark.Location) return null;
            const loc = carpark.Location.split(' ');
            if (loc.length !== 2) return null;

            const lat = parseFloat(loc[0]);
            const lng = parseFloat(loc[1]);
            if (isNaN(lat) || isNaN(lng)) return null;

            return (
              <Marker
                key={`${carpark.CarParkID}-${index}`}
                coordinate={{ latitude: lat, longitude: lng }}
                title={carpark.Development}
                description={`Available: ${carpark.AvailableLots}`}
                tracksViewChanges={false}
              />
            );
          })}
        </MapView>
      </View>
      </View>
  );
}
