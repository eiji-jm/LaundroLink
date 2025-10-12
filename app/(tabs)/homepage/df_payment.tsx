import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function DeliveryPayment() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { services, fabrics, addons, instructions } = useLocalSearchParams();

  const options = [
    {
      id: "dropoff",
      title: "Drop-off at Shop",
      description:
        "You will bring your laundry directly to the shop. No pickup or delivery fees.",
      icon: <Ionicons name="storefront" size={36} color="#004aad" />,
      fee: "₱ 0.00",
    },
    {
      id: "pickup",
      title: "Pickup Only",
      description:
        "Shop will book a rider to pick up your laundry. You’ll return to the shop to collect it. Rider fee will be confirmed.",
      icon: <FontAwesome5 name="truck" size={36} color="#004aad" />,
      fee: "To be confirmed",
    },
    {
      id: "delivery",
      title: "Pickup & Delivery",
      description:
        "Shop will book a rider to pick up your laundry and deliver it back to your doorstep. Rider fee will be confirmed.",
      icon: <Ionicons name="bicycle" size={36} color="#004aad" />,
      fee: "To be confirmed",
    },
  ];

  const selectedDetails = options.find((opt) => opt.id === selectedOption);

  const handleOrder = () => {
    if (selectedDetails) {
      router.push({
        pathname: "/(tabs)/homepage/order_summary",
        params: {
          services: services,
          fabrics: fabrics,
          addons: addons,
          instructions: instructions,
          deliveryOption: selectedDetails.title,
        },
      });
    }
  };

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
            <Text style={styles.headerTitle}>Delivery Option</Text>
          ),
        }}
      />

      {/* Content */}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.instruction}>
          Select how you want to use the service. You can drop it off yourself,
          or have the shop handle pickup and delivery!
        </Text>

        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.card,
              selectedOption === option.id && styles.cardSelected,
            ]}
            onPress={() => setSelectedOption(option.id)}
            activeOpacity={0.9}
          >
            <View style={styles.cardContent}>
              {option.icon}
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text
                  style={[
                    styles.cardTitle,
                    selectedOption === option.id && { color: "#004aad" },
                  ]}
                >
                  {option.title}
                </Text>
                <Text style={styles.cardDesc}>{option.description}</Text>
              </View>

              {/* Checkmark if selected */}
              {selectedOption === option.id && (
                <Ionicons name="checkmark-circle" size={22} color="#004aad" />
              )}
            </View>
            <Text
              style={[
                styles.feeText,
                selectedOption === option.id && { color: "#004aad" },
              ]}
            >
              {option.fee}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Order Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.paymentButton,
            !selectedOption && { backgroundColor: "#ccc" },
          ]}
          onPress={handleOrder}
          disabled={!selectedOption}
        >
          <Text style={styles.paymentText}>
            {selectedDetails
              ? `${selectedDetails.fee}   |   Confirm Order`
              : "Select an option"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 20, paddingBottom: 120 },
  headerTitle: {
    color: "#2d2d2dff",
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 20,
  },
  instruction: {
    textAlign: "center",
    marginVertical: 15,
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardSelected: {
    borderColor: "#004aad",
    borderWidth: 2,
    backgroundColor: "#E3F2FD", // ✅ subtle highlight
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#000" },
  cardDesc: { fontSize: 13, color: "#555", marginTop: 2 },
  feeText: { fontSize: 14, fontWeight: "600", color: "#e67e22" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  paymentButton: {
    backgroundColor: "#004aad",
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
  },
  paymentText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});