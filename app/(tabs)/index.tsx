import { Redirect } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function Index() {
  return <Redirect href="/map" />;
}

// export default function Home() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Home Page</Text>
//     </View>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
});