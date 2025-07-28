import ListScreen from '@/app/map/list-view';
import MapScreen from '@/app/map/map-view';
import styles from '@/styles/styles';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import Papa from 'papaparse';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';

const LTA_API = 'FbWYu7fuSEaqkdCWxxf9uA==';



export default function MapView() {
  //track different states
    const [currentScreen, setCurrentScreen] = useState('Map');
    const [userSearch, setUserSearch] = useState('');
    const [location, setLocation] = useState(null);
    const [searchTrigger, setSearchTrigger] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [carparks, setCarparks] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [showElectric, setShowElectric] = useState(false);
    const [showShelter, setShowShelter] = useState(false);

    //toggle screen between map view and list view
    const toggleScreen = () => {
        setCurrentScreen(currentScreen === 'Map' ? 'List' : 'Map');
    };
    
    //a function to handle search
    const handleSearchSubmit = () => {
    setSearchTrigger(false);
    setTimeout(() => setSearchTrigger(true),0);
    console.log("Submitting search", userSearch);
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
      //Iterates in batches of 500
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
        console.log("Last carpark of list fetched", currList[currList.length-1]);
        fullList = fullList.concat(currList);
        offset += currList.length;
        console.log("Full list length", offset);
      }
      //fetch all the carparks and set the fulllist into the carpark
      setCarparks(fullList);
      console.log("LAST FROM API", fullList[2774]);

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
  //combines the infomation with electric charging point, shelter and ramp data to create one dataset
  useEffect(() => {
    const loadCSV = async () => {
      try {
        const responseGIT = await fetch('https://raw.githubusercontent.com/ram-nush/easy-park-1/refs/heads/main/assets/databases/carparks.csv');

        const file = await responseGIT.text();
        const parsed = Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
        });
        setFacilities(parsed.data);
        console.log("Completed: Successfully Parsed data!");
        console.log("LAST FROM CSV: ", parsed.data[2774]);
      } catch (error) {
        console.error("Error: CSV load error:", error);
      }
    };
    loadCSV();
  }, []);

  for (let i = 0; i < carparks.length; i++) {
    facilities[i]["AvailableLots"] = carparks[i]["AvailableLots"];
    facilities[i]["Location"] = carparks[i]["Location"];
  }
  //console.log(facilities[0]);
  // facilities is the combined information of carparks

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
      //adds a search box
      <View style={styles.screen}>
      <View style={styles.search_pane}>
        <TextInput
          placeholder="Search by address..."
          placeholderTextColor="grey"
          value={userSearch}
          onChangeText={setUserSearch}
          onSubmitEditing={handleSearchSubmit}
          style={styles.search_field}
        />
      </View>
         <View style={styles.container}>
      {currentScreen === 'Map' ? (
        //feed the information into the relevant information to the child pages
        //adds three buttons, two for filtering and one for toggling
  <MapScreen location={location} facilities={facilities} userSearch={userSearch} searchTrigger={searchTrigger} showElectric={showElectric} showShelter={showShelter}/>
) : (
  <ListScreen location={location} facilities={facilities} userSearch={userSearch} searchTrigger={searchTrigger} showElectric={showElectric} showShelter={showShelter}/>
)}
        <View style={styles.toggle_button_container}>
          <TouchableOpacity onPress={() => setShowShelter(prev => !prev)}>
            <View style={[styles.circular_button, {bottom: 30, right: 5}]}>
              <Ionicons name={'umbrella'} size={30} color={showShelter ? 'green' : 'black'} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowElectric(prev => !prev)}>
            <View style={[styles.circular_button, {bottom: 20, right: 5}]}>
              <Ionicons name={'flash'} size={30} color={showElectric ? 'green' : 'black'} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleScreen}>
            <View style={[styles.circular_button, {bottom: 10, right: 5}]}>
              <Ionicons name={currentScreen === 'Map' ? 'list-outline' : 'map-outline'} size={30} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}