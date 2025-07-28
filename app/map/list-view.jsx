import { useEffect, useState } from 'react';
import { Alert, FlatList, Keyboard, Text, View } from 'react-native';


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

export default function ListScreen ({ location, facilities, userSearch, searchTrigger, showElectric, showShelter }) {
  const [nearbyCarparks, setNearbyCarparks] = useState([]); 
  //const [showElectric, setShowElectric] = useState(false);

  //function to generate nearbycarparks
  const getNearbyCarparks = (latt, long) => {
    const nearbyCPs = facilities.map((carpark) => {
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

  //further filter the list depending on the toggles given by the app user
  //filters by electric and or shelter
  if (showElectric && showShelter) {
    setNearbyCarparks(nearbyCPs.filter(a=> a.Electric==="1" && a.Sheltered==="1"))
  } else if (showElectric && !showShelter) {
     setNearbyCarparks(nearbyCPs.filter(a=>a.Electric==="1"));
  } else if (!showElectric && showShelter) {
    setNearbyCarparks(nearbyCPs.filter(a=> a.Sheltered==="1"))
  } else {
    setNearbyCarparks(nearbyCPs)
  };
};

  useEffect(() => {
    //clean the input and make a API query
      const cleaned = userSearch.trim();
      const conductSearch = async () => { 
        if (!cleaned) return;
  
        try {
          const request = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cleaned)}&key=${API_KEY}`
          );
          const response = await request.json();
          //if response is ok, use it to get carparks
          if (response.status === 'OK' && response.results.length > 0) {
            const { lat, lng } = response.results[0].geometry.location;
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

  if (cleaned === '') {
    // If the search box is empty
    // Fall back to user's current location

    if (location || nearbyCarparks.length === 0) {
      //Get the information from the GPS to populate nearby carparks
      getNearbyCarparks(location.latitude, location.longitude);
      }
  } else {
    //If the search box is not empty, do the search sequence
    conductSearch();
  }
  //the effect is to be triggered each time the state changes for any of the following params
  }, [location, searchTrigger, showElectric, showShelter]);

    return (
      <View style={{ flex: 1, position: 'relative', paddingHorizontal: 10 }}>
        <FlatList
      data={nearbyCarparks}
      //we ran into an issue of having multiple carparks with the same id
      //therefore, we implemented an index to have unique ids for multiple carparks with the same id
      keyExtractor={(item, index) => `${item.CarParkID}-${index}`}
      contentContainerStyle={{ padding: 10, width : '100%' }}
      renderItem={({ item }) => (
        <View style={{ marginBottom: 10, backgroundColor: '#f0f0f0', padding: 10, borderRadius: 8, width : '100%', alignSelf: 'stretch'}}>
          <Text style={{ fontWeight: 'bold' }}>{item.Name}</Text>
          <Text>CarkPark ID: {item.ID} | Distance: {item.distance.toFixed(2)} km</Text>
          <Text>Available Lots: {item.AvailableLots}</Text>
          <Text>Facilities: Sheltered: {item.Sheltered === '1' ? "Yes" : "No" } | Ramps: {item.Ramps === '1' ? "Yes" : "No" } | Electric: {item.Electric === '1' ? "Yes" : "No" }</Text>
        </View>
      )}
    />
    </View>
  );}
