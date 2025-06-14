import ListScreen from '@/app/list-view';
import MapScreen from '@/app/map-view';

import styles from '@/styles/styles';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

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
                        <Text style={styles.small_font}>
                            {currentScreen === 'Map' ? 'List' : 'Map'}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}