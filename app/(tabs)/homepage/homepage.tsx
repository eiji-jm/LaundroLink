import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, Stack, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";

// This interface should match the one in your profile.tsx
interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  picture: string | null;
  address: string | null;
}

const shops = [
  {
    id: "1",
    name: "Wash n’ Dry - Lahug",
    distance: "1.7km",
    rating: "4.5",
    image: require("@/assets/images/washndry.png"),
    description: "Experience top-notch laundry facilities equipped with state-of-the-art machines and a clean, comfortable environment.",
    addDescription: "We accept a wide variety of fabrics, including cotton, linen, polyester, denim, wool, and delicate materials like silk and lace. Whether it's everyday wear or specialty garments, your laundry is in good hands.",
    address: "Wilson St., Lahug, Cebu City",
    contact: "09223324839",
    hours: "8am-6pm",
    availability: "Available",
  },
  {
    id: "2",
    name: "Sparklean - Apas",
    distance: "1km",
    rating: "4.0",
    image: require("@/assets/images/sparklean.jpg"),
    description: "Offering comprehensive laundry services with a focus on quality and customer satisfaction.",
    addDescription: "From wash and fold to dry cleaning, we handle all types of laundry with care. Our eco-friendly detergents ensure your clothes are not only clean but also safe for the environment.",
    address: "Apas, Cebu City",
    contact: "09171234567",
    hours: "9am-7pm",
    availability: "Available",
  },
  // ... other shops
];

export default function Homepage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  // ✅ This hook re-fetches user data every time the screen comes into focus.
  // This ensures the profile picture is always up-to-date.
  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        try {
          const storedUser = await AsyncStorage.getItem("user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } catch (error) {
          console.error("Failed to load user from storage", error);
        }
      };

      loadUser();
    }, [])
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#89CFF0",
            borderBottomWidth: 1.5,
            borderBottomColor: "#5EC1EF",
          },
          headerTintColor: "#2d2d2dff",
          headerShadowVisible: false,
          headerLeft: () => null,
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="location-outline" size={20} color="#2d2d2dff" />
              <Text style={{ color: "#2d2d2dff", marginLeft: 5, fontSize: 20, fontWeight: "600", }}>
                Home ▼
              </Text>
            </View>
          ),
          // ✅ UPDATED: Header right now conditionally shows the user's picture
          headerRight: () => (
            <Pressable onPress={() => router.push("/(tabs)/homepage/profile" as any)}>
              {user && user.picture ? (
                <Image
                  source={{ uri: user.picture }}
                  style={styles.headerAvatar}
                />
              ) : (
                <Ionicons
                  name="person-circle-outline"
                  size={32}
                  color="#2d2d2dff"
                  style={{ marginRight: 10 }}
                />
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

        <FlatList
          data={shops}
          numColumns={2}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.shopList}
          renderItem={({ item }) => (
            <Link
              href={{
                pathname: "./about_laundry",
                params: {
                  id: item.id,
                  name: item.name,
                  distance: item.distance,
                  rating: item.rating,
                  // Note: Passing complex data like image require might not work as expected
                  // It's better to pass an image URI or an identifier
                  description: item.description,
                  addDescription: item.addDescription,
                  address: item.address,
                  contact: item.contact,
                  hours: item.hours,
                  availability: item.availability,
                },
              }}
              asChild
            >
              <Pressable style={styles.shopCard}>
                <Image source={item.image} style={styles.shopImage} />
                <Text style={styles.shopName}>{item.name}</Text>
                <Text style={styles.shopDetails}>
                  {item.distance} • ⭐ {item.rating}
                </Text>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: item.availability === "Available" ? "#4CAF50" : "#FF5252" },
                  ]}
                >
                  <Text style={styles.badgeText}>{item.availability}</Text>
                </View>
              </Pressable>
            </Link>
          )}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  // ✅ ADDED: Style for the header avatar
  headerAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#5EC1EF'
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fb",
    paddingTop: 30,
    paddingHorizontal: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 22,
  },
  icon: {
    marginRight: 8,
  },
  placeholder: {
    fontSize: 16,
    color: "#777",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: "#2d2d2d",
  },
  shopList: {
    paddingBottom: 20,
  },
  shopCard: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 8,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  shopImage: {
    width: 110,
    height: 110,
    borderRadius: 12,
    marginBottom: 10,
  },
  shopName: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
  },
  shopDetails: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  badge: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
});