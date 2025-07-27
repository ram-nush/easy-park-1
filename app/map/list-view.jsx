import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
//Haversine formula function to get the distance between two points 
//(described by its longtitude and latitude)


function getDistance(lat1, lon1, lat2, lon2) {
    let R = 6371;
    let distanceLat = (lat2 - lat1) * Math.PI / 180;
    let distanceLon = (lon2 - lon1) * Math.PI / 180;
    let a = Math.pow(Math.sin(distanceLat/2), 2) + 
    Math.cos(lat1 * Math.PI / 180) *  
    Math.cos(lat2 * Math.PI / 180) *
    Math.pow(Math.sin(distanceLon/2), 2);
    
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let d = R * c;
    return d;
}

const API_KEY = 'AIzaSyDJXyWnsMeJS6iQl0Tm8kKGzmxJ4qxpg18';

export default function ListScreen ({ location, carparks, userSearch, searchTrigger }) {
  const [nearbyCarparks, setNearbyCarparks] = useState([]); 
  const getNearbyCarparks = (latt, long) => {
    const nearbyCPs = carparks.map((carpark) => {
    //if no carpark location, return null
      if (!carpark.Location) return null;
    const loc = carpark.Location.split(' ');
    //check the array, if it not of length 2,
    //i.e. there is no lat or lng information
    //return null
    if (loc.length !== 2) return null;

    const lat = parseFloat(loc[0]);
    const lng = parseFloat(loc[1]);
    if (isNaN(lat)) return null;
    if (isNaN(lng)) return null;

    //find the distance
    const distance = getDistance(latt, long, lat, lng);
    //filter by distance
    //two step filter (by setting values to be null to be filtered later)
    if (distance > 1) return null;

    return {
      ...carpark,
      lat,
      lng,
      distance,
    };
  })
  //filters the null
  .filter(a => a)
  //sorts in accending order
  .sort((a, b) => a.distance - b.distance);

  setNearbyCarparks(nearbyCPs);
};
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
              //change this code for list;
              getNearbyCarparks(lat, lng);
          } else {
            Alert.alert('Location not found');
          }
        } catch (error) {
          Alert.alert('Search failed');
        } finally {
          Keyboard.dismiss();
        }
      };
      console.log("Triggered search with:", userSearch);
      conductSearch();
    }, [searchTrigger]);

    useEffect(() => {
    if (location && nearbyCarparks.length === 0) {
      getNearbyCarparks(location.latitude, location.longitude);
    }
  }, [location]);
  
  
    return (

         <FlatList
      data={nearbyCarparks}
      //we ran into an issue of having multiple carparks with the same id
      //therefore, we implemented an index to have unique ids for multiple carparks with the same id
      keyExtractor={(item, index) => `${item.CarParkID}-${index}`}
      contentContainerStyle={{ padding: 10 }}
      renderItem={({ item }) => (
        <View style={{ marginBottom: 10, backgroundColor: '#f0f0f0', padding: 12, borderRadius: 8 }}>
          <Text style={{ fontWeight: 'bold' }}>{item.Development}</Text>
          <Text>CarkPark ID: {item.CarParkID}</Text>
          <Text>Available Lots: {item.AvailableLots}</Text>
          <Text>Distance: {item.distance.toFixed(2)} km</Text>
        </View>
      )}
    />
  );}