import ListScreen from '@/app/map/list-view';
import MapScreen from '@/app/map/map-view';
import styles from '@/styles/styles';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

const LTA_API = 'FbWYu7fuSEaqkdCWxxf9uA==';

export default function MapView() {
    const [currentScreen, setCurrentScreen] = useState('Map');
    const [location, setLocation] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [carparks, setCarparks] = useState([]);

    //toggle screen
    const toggleScreen = () => {
        setCurrentScreen(currentScreen === 'Map' ? 'List' : 'Map');
    };

  useEffect(() => {
    (async() => {
      try {
        //if permission is denied, warn, set error message and exit
        let {status} = await Location.requestForegroundPermissionsAsync();
        if (status != 'granted') {
          console.warn('Permission access was denied');
          setErrorMsg('Location permission denied');
          setLoaded(false);
          return;
        }

      // else fetch GPS coordinates of the users
      let location = await Location.getCurrentPositionAsync({});
      console.log("Location fetched:", location.coords);
      setLocation(location.coords);

      // // Fetch carpark data from LTAdataMall
      //Iteration 1: only fetching the first 500
      // let responseData = await fetch('https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2', {
      //   headers: {
      //     AccountKey: LTA_API,
      //     accept: 'application/json',
      //   },
      // });

      // let data = await responseData.json();
      // console.log("Carpark data fetched", data.value.length);
      // setCarparks(data.value);
      
      // Fetch carpark data from LTA DataMall
      //Iteration 2: Fetching all the carparks
      //This adds alot of loading and rendernig time to our app
      let offset = 0;
      let fullList = [];
      while (true) {
        let responseData = await fetch(`https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2?$skip=${offset}`, {
          headers: {
            AccountKey: LTA_API,
            accept: 'application/json',
          },
        });

        let data = await responseData.json();
        let currList = data.value;
        console.log("Carpark data fetched", currList.length);
        if (currList.length == 0) {
          break;
        }

        console.log("First carpark of list fetched", currList[0]);
        console.log("First carpark of list fetched", currList[currList.length-1]);
        fullList = fullList.concat(currList);
        offset += currList.length;
        console.log("Full list length", offset);
      }
      //fetch all the carparks and set the fulllist into the carpark
      setCarparks(fullList);

    } catch (err) {
      //if there is an error, display error
      console.error("Location fetch error:", err);
      setErrorMsg('Error fetching location');
    } finally {
      //set the loaded status to true
      setLoaded(true);
    }
    }) ();
  }, []);

  if (!loaded) {
    return (
      //this creates a loading screen while waiting for permissions and 
      // while fetching and rendering the information
      <View style={styles.loadingContainer}>
        <ActivityIndicator /*color='black'*/ />
        <Text style={{ textalign: 'middle '}}> Fetching current location and carpark information...</Text>
      </View>
    );
  } else if (errorMsg) {
    return (
      //display the error if any
      <View style={styles.loadingContainer}>
        <Text> {errorMsg}</Text>
      </View>
    );
  } else if (!location) {
    return (
      //no location data available and prompt the user to try again
      <View style={styles.loadingContainer}>
        <Text> No location data available. Please try again</Text>
      </View>
    );
  }

    return (
         <View style={styles.container}>
      {currentScreen === 'Map' ? (
        //feed the information into the relevant information
  <MapScreen location={location} carparks={carparks} />
) : (
  <ListScreen location={location} carparks={carparks} />
)}

        <View style={styles.toggle_button_container}>
            <TouchableOpacity onPress={toggleScreen}>
                <View style={styles.circular_button}>
                    <Ionicons name={currentScreen === 'Map' ? 'list-outline' : 'map-outline'} size={30} />
                </View>
            </TouchableOpacity>
        </View>
    </View>
    );
}