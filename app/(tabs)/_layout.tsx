import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Carparks',
          tabBarIcon: ({ color, size }) => ( <Ionicons name="car-outline" size={size} color={color} /> ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'My info',
          tabBarIcon: ({ color, size }) => ( <Ionicons name="person-outline" size={size} color={color} /> ),
        }}
      />
    </Tabs>
  );
}
