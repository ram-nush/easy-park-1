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

export default function ListScreen ({ location, carparks}) {
    const nearbyCarparks = carparks.map((carpark) => {
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
    const distance = getDistance(location.latitude, location.longitude, lat, lng);
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
          <Text>Available Lots: {item.AvailableLots}</Text>
          <Text>Distance: {item.distance.toFixed(2)} km</Text>
        </View>
      )}
    />
  );}