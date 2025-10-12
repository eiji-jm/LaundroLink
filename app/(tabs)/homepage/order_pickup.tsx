import { FontAwesome5 } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function OrderPickup() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#89CFF0" },
          headerShadowVisible: false,
          headerTintColor: "#2d2d2dff",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            </TouchableOpacity>
          ),
          headerTitle: () => <Text style={styles.headerTitle}>Pickup Confirmed</Text>,
        }}
      />

      {/* Content */}
      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <FontAwesome5 name="truck" size={70} color="#004aad" />
        </View>

        <Text style={styles.title}>Pickup Only</Text>
        <Text style={styles.message}>
          A rider will be booked by the shop to{"\n"}
          pick up your laundry. {"\n\n"}
          <Text style={{ fontWeight: "600", color: "#000" }}>
            Delivery fee will be confirmed and sent to you.
          </Text>
        </Text>

       <TouchableOpacity
  style={styles.button}
  onPress={() => router.replace("/(tabs)/homepage/homepage")}
>
  <Text style={styles.buttonText}>Back to Home</Text>
</TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },

  backButton: {
    marginLeft: 10,
    padding: 4,
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  iconWrapper: {
    backgroundColor: "#e6f0ff",
    padding: 25,
    borderRadius: 100,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2d2d2dff",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    color: "#004aad",
    textAlign: "center",
  },

  message: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
    color: "#555",
    lineHeight: 22,
  },

  button: {
    backgroundColor: "#004aad",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },

  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});