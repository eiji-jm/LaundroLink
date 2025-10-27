import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, Stack, useFocusEffect, useRouter } from "expo-router";
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import axios from "axios";

const API_URL = "https://necole-greathearted-vernell.ngrok-free.dev";

interface UserProfile {
  id: number;
  picture: string | null;
}

interface Shop {
  id: string;
  name: string;
  distance: number;
  image_url: string;
  description: string;
  addDescription: string;
  address: string;
  contact: string;
  hours: string;
  availability: string;
  rating?: string;
}

export default function Homepage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Set initial loading to false
  const [locationPermission, setLocationPermission] = useState(false);

  // Check for location permission on load
  useEffect(() => {
    const checkPermission = async () => {
      let { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationPermission(true);
      }
    };
    checkPermission();
  }, []);

  const fetchNearbyShops = async () => {
    setIsLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please enable location services in your settings to find nearby shops.');
        setLocationPermission(false);
        return;
      }
      setLocationPermission(true);

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const response = await axios.get(`${API_URL}/api/shops/nearby`, {
        params: { lat: latitude, lon: longitude }
      });

      if (response.data.success) {
        setShops(response.data.shops);
      } else {
        Alert.alert('Error', 'Could not fetch nearby shops.');
      }
    } catch (error) {
      console.error("Failed to fetch shops:", error);
      Alert.alert('Server Error', 'Could not connect to the server to find shops.');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
      };
      loadUser();
    }, [])
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#89CFF0" },
          headerTintColor: "#2d2d2dff",
          headerLeft: () => null,
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="location-outline" size={20} color="#2d2d2dff" />
              <Text style={{ color: "#2d2d2dff", marginLeft: 5, fontSize: 20, fontWeight: "600" }}>
                Home ▼
              </Text>
            </View>
          ),
          headerRight: () => (
            <Pressable onPress={() => router.push("/(tabs)/homepage/profile" as any)}>
              {user && user.picture ? (
                <Image source={{ uri: user.picture }} style={styles.headerAvatar} />
              ) : (
                <Ionicons name="person-circle-outline" size={32} color="#2d2d2dff" style={{ marginRight: 10 }} />
              )}
            </Pressable>
          ),
        }}
      />

      <View style={styles.container}>
        <Link href="./search_laundry" asChild>
          <Pressable style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#888" style={styles.icon} />
            <Text style={styles.placeholder}>Search laundry shops</Text>
          </Pressable>
        </Link>

        <Text style={styles.sectionTitle}>Laundry Shops Nearby</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color="#004aad" />
        ) : shops.length > 0 ? (
          <FlatList
            data={shops}
            numColumns={2}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.shopList}
            renderItem={({ item }) => (
              <Link href={{ pathname: "./about_laundry", params: { ...item, image: item.image_url } }} asChild>
                <Pressable style={styles.shopCard}>
                  <Image source={{ uri: item.image_url }} style={styles.shopImage} />
                  <Text style={styles.shopName}>{item.name}</Text>
                  <Text style={styles.shopDetails}>
                    {item.distance.toFixed(2)} km • ⭐ {item.rating || 'N/A'}
                  </Text>
                  <View style={[ styles.badge, { backgroundColor: item.availability === "Available" ? "#4CAF50" : "#FF5252" } ]}>
                    <Text style={styles.badgeText}>{item.availability || 'Unknown'}</Text>
                  </View>
                </Pressable>
              </Link>
            )}
          />
        ) : (
          // ✅ ADDED: This view shows the button to trigger the location search
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Press the button to find shops near you.</Text>
            <TouchableOpacity style={styles.findButton} onPress={fetchNearbyShops}>
                <Ionicons name="navigate-outline" size={20} color="#fff" />
                <Text style={styles.findButtonText}>Find Shops Near Me</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerAvatar: { width: 34, height: 34, borderRadius: 17, marginRight: 10, borderWidth: 1, borderColor: '#5EC1EF' },
  container: { flex: 1, backgroundColor: "#f8f9fb", paddingTop: 30, paddingHorizontal: 16 },
  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", width: "100%", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 25, elevation: 2, marginBottom: 22, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2 },
  icon: { marginRight: 8 },
  placeholder: { fontSize: 16, color: "#777", fontWeight: "500" },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 16, color: "#2d2d2d" },
  shopList: { paddingBottom: 20 },
  shopCard: { flex: 1, backgroundColor: "#fff", margin: 8, borderRadius: 16, padding: 14, alignItems: "center", elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3 },
  shopImage: { width: 110, height: 110, borderRadius: 12, marginBottom: 10, backgroundColor: '#eee' },
  shopName: { fontSize: 14, fontWeight: "600", textAlign: "center", color: "#333" },
  shopDetails: { fontSize: 12, color: "#666", marginTop: 4 },
  badge: { marginTop: 8, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: "center", elevation: 2, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 2 },
  badgeText: { fontSize: 12, fontWeight: "600", color: "#fff" },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#888',
    fontSize: 16,
  },
  findButton: {
    flexDirection: 'row',
    backgroundColor: '#004aad',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 3,
  },
  findButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  }
});