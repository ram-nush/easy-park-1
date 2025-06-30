import styles from '@/styles/styles';
import { NunitoSans_300Light } from "@expo-google-fonts/nunito-sans";
import { Raleway_400Regular } from "@expo-google-fonts/raleway";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from "expo-font";
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Profile() {
    const [fontsLoaded] = useFonts({
        Raleway_400Regular,
        NunitoSans_300Light,
    });

    // check if fonts are loaded before showing screen
    // throws error if this is not done
    if (!fontsLoaded) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
                <Text>Loading fonts...</Text>
            </View>
        );
    }

  return (
    <View style={styles.container}>
        <ProfileForm />
    </View>
  );
}

// const Header = () => {
//     return (
//         <View style={styles.first_pane}>
//             <Text style={styles.big_font}>My Profile</Text>
//         </View>
//     );
// }

// formatting for each component
const Bar = ({ label, placeholder, value, onChangeText }) => {
    return (
        <View style={styles.pane}>
            <Text style={styles.middle_font}>{label}</Text>
            <View style={styles.pane}>
                <TextInput
                    placeholder={placeholder} 
                    placeholderTextColor="grey" 
                    value={value} 
                    onChangeText={onChangeText} 
                    style={styles.search_field}
                />
            </View>
        </View>
    );
}

const ProfileForm = () => {
    // create profile data variable
    // take in 5 key information
    const [profileData, setProfileData] = useState({
        name: '',
        brand: '',
        model: '',
        type: '',
        plate: ''
    })

    // listener to track current value of any field in profile data
    const onFieldChange = (field) => (text) => {
        setProfileData(prev => ({
            ...prev,
            [field]: text,
        }));
        console.log(field, "changed to", text);
    }

    // save the profile information to AsyncStorage
    const savePressed = async () => {
        try {
            // Save to local storage
            const jsonProfile = JSON.stringify(profileData);
            await AsyncStorage.setItem('user_profile', jsonProfile);
            Alert.alert('Success', 'Profile saved');
        } catch (error) {
            console.error('Save error:', error);
            Alert.alert('Error', 'Failed to save profile locally');
        }
    };

    // load profile information from local storage
    useEffect(() => {
        const loadProfile = async () => {
            try {
                //retrieve the profile
                const jsonProfile = await AsyncStorage.getItem('user_profile');

                //if there is no profile, set up a new one
                if (jsonProfile != null) {
                    setProfileData(JSON.parse(jsonProfile));
                }
            } catch (error) {
                console.error('Load error:', error);
                Alert.alert('Error', 'Failed to load profile from device');
            }
        };

        // call function immediately, so loading happens when the component mounts
        loadProfile();
    }, []); // Ensures effect runs only once

    return (
        <View style={styles.list}>
            <Bar
                label="Name"
                placeholder="Enter name"
                value={profileData.name}
                onChangeText={onFieldChange('name')}
            />
            
            <Bar
                label="Vehicle Brand"
                placeholder="Enter vehicle brand"
                value={profileData.brand}
                onChangeText={onFieldChange('brand')}
            />

            <Bar
                label="Vehicle Model"
                placeholder="Enter vehicle model"
                value={profileData.model}
                onChangeText={onFieldChange('model')}
            />

            <Bar
                label="Vehicle Type"
                placeholder="Enter vehicle type"
                value={profileData.type}
                onChangeText={onFieldChange('type')}
            />

            <Bar
                label="License Plate"
                placeholder="Enter license plate"
                value={profileData.plate}
                onChangeText={onFieldChange('plate')}
            />
            <View style={styles.pane}>
                <TouchableOpacity onPress={savePressed}>
                    <View style={styles.button_field}>
                        <Text style={styles.middle_font}>Save</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}
