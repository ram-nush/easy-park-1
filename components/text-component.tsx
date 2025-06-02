import { useState } from 'react';
import { Button, TextInput, View } from 'react-native';
import styles from '../styles/styles';

const TextComponent = ({ name }: {name: string}) => {
    const [number, setNumber] = useState(0);
    const [text, setText] = useState('');

    const onChangeText = (text: string) => {
        setText(text);
        console.log(text);
    };

    const submit = () => {
        console.log("your text is being sent to the database", text);
    };

    return (
        <View style={styles.container}>
            <TextInput placeholder="Enter your name" value={text} onChangeText={onChangeText} />
            <Button title="Submit" onPress={submit} />
        </View>
    );
}

export default TextComponent;