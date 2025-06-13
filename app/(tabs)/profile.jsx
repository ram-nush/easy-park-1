import styles from '@/styles/styles';
import { NunitoSans_300Light } from "@expo-google-fonts/nunito-sans";
import { Raleway_400Regular } from "@expo-google-fonts/raleway";

import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

//import PORT from '@/server/index';

import { useFonts } from "expo-font";
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Profile() {
    const [fontsLoaded] = useFonts({
        Raleway_400Regular,
        NunitoSans_300Light,
    });

    if (!fontsLoaded) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading fonts...</Text>
            </View>
        );
    }

  return (
    <View style={styles.container}>
        <Header />
        <ProfileForm />
    </View>
  );
}

const getOrCreateDeviceId = async () => {
  let id = await AsyncStorage.getItem('device_id');
  if (!id) {
    id = uuid.v4().toString();
    await AsyncStorage.setItem('device_id', id);
  }
  return id;
};

const Header = () => {
    return (
        <View style={styles.first_pane}>
            <Text style={styles.big_font}>My Profile</Text>
        </View>
    );
}

const Bar = ({ label, placeholder, value, onChangeText }) => {
    return (
        <View style={styles.pane}>
            <Text style={styles.middle_font}>{label}</Text>
            <View style={styles.pane}>
                <TextInput
                    placeholder={placeholder} 
                    placeholderTextColor="gray" 
                    value={value} 
                    onChangeText={onChangeText} 
                    style={styles.search_field}
                />
            </View>
        </View>
    );
}

const ProfileForm = () => {
    const [profileData, setProfileData] = useState({
        name: '',
        brand: '',
        model: '',
        plate: ''
    })

    const onFieldChange = (field) => (text) => {
        setProfileData(prev => ({
            ...prev,
            [field]: text,
        }));
        console.log(field, "changed to", text);
    }

    // Save the profile information
    const savePressed = async () => {
        try {
            // Get the device ID
            const deviceId = await getOrCreateDeviceId();
            console.log(deviceId);

            // Create request and retrieve response
            const response = await fetch(`http://172.20.10.13:3000/api/profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    deviceId: deviceId,
                    profileData: profileData,
                }),
            });

            // Parse JSON response
            const data = await response.json();

            // If status code is 200-299, show user that profile has been saved
            // Otherwise, return the error
            if (response.ok) {
                Alert.alert('Success', 'Profile saved!');
            } else {
                if (data.message) {
                    Alert.alert('Error', data.message);
                } else {
                    Alert.alert('Error', 'Failed to save profile');
                }
            }
        } catch (error) {
            console.error('Save error:', error);
            Alert.alert('Error', 'Network error while saving profile');
        }
    };

    // Retrieve profile information using device ID
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const deviceId = await getOrCreateDeviceId();
                const response = await fetch(`http://172.20.10.13:3000/api/profile/${deviceId}`);
                const data = await response.json();

                if (response.ok && data) {
                    setProfileData(data.profileData);
                }
            } catch (error) {
                console.error('Fetch error:', error);
                Alert.alert('Error', 'Network error while fetching profile');
            }
        };

        // Call function immediately, so the fetch starts when the component mounts
        fetchProfile();
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
