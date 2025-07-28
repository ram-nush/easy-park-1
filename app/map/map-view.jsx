import styles from '@/styles/styles';
import { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import 'react-native-get-random-values';
import MapView from 'react-native-map-clustering';
import { Marker } from 'react-native-maps';

export default function MapScreen({ location, facilities, userSearch, searchTrigger }) {
  //takes user input and cleans it  
  useEffect(() => {
      if (!searchTrigger) return;
    const conductSearch = async () => {
      const cleaned = userSearch.trim();
      if (!cleaned) return;
      //feed it into google map API to get lat and lng
      try {
        const request = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cleaned)}&key=${API_KEY}`
        );
        const response = await request.json();

        if (response.status === 'OK' && response.results.length > 0) {
          const { lat, lng } = response.results[0].geometry.location;
          //animate to the region once we get the lat and lng of the search query
          mapRef.current?.animateToRegion({
            latitude: lat,
            longitude: lng,
            //sets zoom level
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
    //search is triggered by the searchbox query
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
          {facilities.map((carpark, index) => {
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
                title={carpark.Name}
                description={
                  `Available: ${carpark.AvailableLots} \n` +
                  `Sheltered: ${carpark.Sheltered === '1' ? "Yes" : "No" }\n` +
                  `Ramps: ${carpark.Ramps === '1' ? "Yes" : "No" }\n` +
                  `Electric: ${carpark.Electric === '1' ? "Yes" : "No" }`
                }
                tracksViewChanges={false}
                pinColor={carpark.Electric === '1' ? 'green' : undefined}
              />
            );
          })}
        </MapView>
      </View>
      </View>
  );
}
