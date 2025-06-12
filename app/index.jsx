import styles from '@/styles/styles.js';
import { NunitoSans_300Light } from "@expo-google-fonts/nunito-sans";
import { Raleway_400Regular } from "@expo-google-fonts/raleway";

import { useFonts } from "expo-font";
import { useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";

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
        <Body />
    </View>
  );
}

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
            <View style={styles.pane}>
                <Text style={styles.middle_font}>{label}</Text>
            </View>
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

const Body = () => {
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

    const savePressed = async () => {
        console.log('Save button pressed', profileData);
    };

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
