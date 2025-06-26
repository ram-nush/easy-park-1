import ListScreen from '@/app/list-view';
import MapScreen from '@/app/map-view';

import styles from '@/styles/styles';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

export default function MapView() {
    const [currentScreen, setCurrentScreen] = useState('Map');

    const toggleScreen = () => {
        setCurrentScreen(currentScreen === 'Map' ? 'List' : 'Map');
    };

    return (
        <View style={styles.container}>
        {currentScreen === 'Map' ? <MapScreen /> : <ListScreen />}


            <View style={styles.toggle_button_container}>
                <TouchableOpacity onPress={toggleScreen}>
                    <View style={styles.circular_button}>
                        <Ionicons
                        name={currentScreen === 'Map' ? 'list-outline' : 'map-outline'}
                        size={30}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}