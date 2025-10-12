import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AvailableServices() {
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  const services = [
    { id: 1, name: "Wash, Dry, and Fold" },
    { id: 2, name: "Wash, Dry, and Press" },
    { id: 3, name: "Wash and Dry" },
    { id: 4, name: "Press only" },
    { id: 5, name: "Full Service (Wash, Dry, Press, and Fold)" },
  ];

  const serviceNames = services
    .filter((service) => selectedServices.includes(service.id))
    .map((service) => service.name);

  const toggleService = (id: number) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#89CFF0",
          },
          headerShadowVisible: false,
          headerTintColor: "#2d2d2dff",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons
                name="arrow-back"
                size={24}
                color="#000"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
          headerTitle: () => (
            <Text style={styles.headerTitle}>Available Services</Text>
          ),
        }}
      />

      {/* Content */}
      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.shopSection}>
            <Image
              source={require("@/assets/images/washndry.png")}
              style={styles.shopImage}
            />
            <Text style={styles.shopName}>Wash n’ Dry</Text>
          </View>

          <Text style={styles.instruction}>
            Please select the service(s) you need:
          </Text>

          <View style={styles.servicesList}>
            {services.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.serviceOption,
                  selectedServices.includes(service.id) &&
                    styles.serviceOptionSelected,
                ]}
                onPress={() => toggleService(service.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={
                    selectedServices.includes(service.id)
                      ? "checkbox"
                      : "square-outline"
                  }
                  size={22}
                  color={selectedServices.includes(service.id) ? "#004aad" : "#444"}
                  style={{ marginRight: 12 }}
                />
                <Text
                  style={[
                    styles.serviceText,
                    selectedServices.includes(service.id) && styles.serviceTextSelected,
                  ]}
                >
                  {service.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Next Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            selectedServices.length === 0 && styles.nextButtonDisabled,
          ]}
          disabled={selectedServices.length === 0}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/homepage/laundry_details",
              params: { services: JSON.stringify(serviceNames) },
            })
          }
        >
          <Text style={styles.nextText}>
            {selectedServices.length === 0 ? "Select a service" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
  container: {
    alignItems: "center",
    padding: 20,
    paddingBottom: 120,
  },
  wrapper: {
    flex: 1,
  },
  headerTitle: {
    color: "#2d2d2dff",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 20,
  },
  shopSection: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  shopImage: {
    width: 130,
    height: 130,
    resizeMode: "contain",
    borderRadius: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  shopName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginTop: 10,
  },
  instruction: {
    textAlign: "center",
    marginVertical: 15,
    fontSize: 15,
    color: "#444",
    fontWeight: "500",
  },
  servicesList: {
    marginTop: 10,
    width: "100%",
  },
  serviceOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  serviceOptionSelected: {
    borderColor: "#004aad",
    backgroundColor: "#E6F0FF",
  },
  serviceText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  serviceTextSelected: {
    color: "#004aad",
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: "#f6f6f6",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  nextButton: {
    backgroundColor: "#004aad",
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  nextButtonDisabled: {
    backgroundColor: "#aaa",
  },
  nextText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});