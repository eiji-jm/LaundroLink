import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";
import { Text, View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0b63afff',
        tabBarStyle: {
          backgroundColor: '#ffffffff',
        }
      }}
    >
      <Tabs.Screen 
        name="homepage" 
        options={{ 
          title: 'Home',
          headerShown: false,    
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="location-outline" size={20} color="#fff" />
              <Text style={{ color: "#fff", marginLeft: 5, fontSize: 16, fontWeight: "600" }}>
                Home ▼
              </Text>
            </View>
          ),
          headerRight: () => (
            <Ionicons name="person-circle-outline" size={32} color="#fff" style={{ marginRight: 10 }} />
          ),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={24} />
          ),
        }} 
      />
      
      <Tabs.Screen 
        name="activity" 
        options={{ 
          headerShown: false,
          title: 'Activity',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'time' : 'time-outline'} color={color} size={24} />
          ),
        }} 
      />

      <Tabs.Screen 
        name="payment" 
        options={{ 
          headerShown: false,
          title: 'Payment',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'card' : 'card-outline'} color={color} size={24} />
          ),
        }} 
      />

      <Tabs.Screen 
        name="message" 
        options={{
          headerShown: false, 
          title: 'Messages',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'chatbubble' : 'chatbubble-outline'} color={color} size={24} />
          ),
        }} 
      />
    </Tabs>
  );
}