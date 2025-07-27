// import styles from '@/styles/styles';
// import { Text, View } from 'react-native';
import { Redirect } from 'expo-router';

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