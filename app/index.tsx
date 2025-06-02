import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from '../styles/styles';

export default function Profile() {
  return (
    <View style={styles.container}>
        <Header />
        <Filter />
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

const Filter = () => {
    const [nameText, setNameText] = useState('');
    const [brandText, setBrandText] = useState('');
    const [modelText, setModelText] = useState('');
    const [plateText, setPlateText] = useState('');

    const onNameChangeText = (text: string) => {
        setNameText(text);
        console.log(nameText);
    }

    const onBrandChangeText = (text: string) => {
        setBrandText(text);
        console.log(brandText);
    }

    const onModelChangeText = (text: string) => {
        setModelText(text);
        console.log(modelText);
    }

    const onPlateChangeText = (text: string) => {
        setPlateText(text);
        console.log(plateText);
    }

    const savePressed = async () => {
        console.log('Save button pressed', nameText, brandText, modelText, plateText);
    };

    return (
        <View style={styles.list}>
            <View style={styles.pane}>
                <View style={styles.pane}>
                    <Text style={styles.middle_font}>Name</Text>
                </View>
                <View style={styles.pane}>
                    <TextInput 
                        placeholder="Enter Name" 
                        value={nameText} 
                        onChangeText={onNameChangeText}
                        style={styles.search_field} />
                </View>
            </View>

            <View style={styles.pane}>
                <View style={styles.pane}>
                    <Text style={styles.middle_font}>Vehicle Brand</Text>
                </View>
                <View style={styles.pane}>
                    <TextInput 
                        placeholder="Enter Vehicle Brand" 
                        value={brandText} 
                        onChangeText={onBrandChangeText}
                        style={styles.search_field} />
                </View>
            </View>

            <View style={styles.pane}>
                <View style={styles.pane}>
                    <Text style={styles.middle_font}>Vehicle Model</Text>
                </View>
                <View style={styles.pane}>
                    <TextInput 
                        placeholder="Enter Vehicle Model" 
                        value={modelText} 
                        onChangeText={onModelChangeText}
                        style={styles.search_field} />
                </View>
            </View>

            <View style={styles.pane}>
                <View style={styles.pane}>
                    <Text style={styles.middle_font}>License Plate</Text>
                </View>
                <View style={styles.pane}>
                    <TextInput 
                        placeholder="Enter License Plate" 
                        value={plateText} 
                        onChangeText={onPlateChangeText}
                        style={styles.search_field} />
                </View>
            </View>

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
