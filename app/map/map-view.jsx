import styles from '@/styles/styles';
import { useRef, useState } from 'react';
import { Alert, Keyboard, Text, TextInput, View } from 'react-native';
import 'react-native-get-random-values';
//import GooglePlacesTextInput from 'react-native-google-places-textinput';
import MapView, { Marker } from 'react-native-maps';

export default function MapScreen({ location, carparks}) {
if(!location) 
  return <Text> No location data available right now</Text>;
const [userSearch, setUserSearch] = useState(''); 
const mapRef = useRef(null);

const API_KEY = 'AIzaSyDJXyWnsMeJS6iQl0Tm8kKGzmxJ4qxpg18'

const conductSearch = async () => {
  const cleaned = userSearch.trim();
  if (!cleaned) return;
//if (!description) return;

try {
  const request = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent( userSearch )}&key=${ API_KEY }`
  );

  const response = await request.json();

  if (response.status === 'OK' && 
      response.results.length > 0) {
      const { lat, lng} = response.results[0].geometry.location;
      console.log("done-1");

      mapRef.current.animateToRegion(
      {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      },
      100
    );
  } else {
    Alert.alert('Location was not found')
  }
} catch (error) {
  Alert.alert('Error')
} finally {
  Keyboard.dismiss();
}
};

  return (
    <View style={ styles.screen}>
      <View style={styles.search_pane}>
        <TextInput
            placeholder="Search by address..."
            placeholderTextColor="grey"
            value={userSearch} 
            onChangeText={setUserSearch} 
            onSubmitEditing={conductSearch}
            style={styles.search_field}
        />
        </View>
        {/* <GooglePlacesTextInput
          apiKey = 'AIzaSyDJXyWnsMeJS6iQl0Tm8kKGzmxJ4qxpg18'
          fetchDetails={true}
          style={styles.search_field}
          query={{
            language: 'en',
            components: 'country:SG', 
          onPlaceSelect={(place) => conductSearch(place.description)}
          /> */}
    <View style={styles.container}>
      <MapView
      provider='google'
      ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        initialRegion={
          {
          latitude: location.latitude,        
          longitude: location.longitude,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        }
      }
      >
      {carparks.map((carpark, index) => {
        if (!carpark.Location) return null;
        let loc = carpark.Location.split(" ");
        const lat = parseFloat(loc[0]);
        const lng = parseFloat(loc[1]);
        if (!lat) return null;
        if (!lng) return null;
        //create and render all the markers on the map
        return (
          <Marker
            key={index}
            coordinate={{ latitude: lat, longitude: lng }}
            title={carpark.Development}
            description={`Available: ${carpark.AvailableLots}`} />
        );
      }
      )
      }
      </MapView>
    </View>
  </View>
  );
}

