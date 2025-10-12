import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function OrderSummaryScreen() {
  const router = useRouter();
  const { services, fabrics, addons, instructions, deliveryOption } =
    useLocalSearchParams();

  // Parse arrays safely (if passed as JSON strings)
  const parsedServices = services ? JSON.parse(services as string) : [];
  const parsedFabrics = fabrics ? JSON.parse(fabrics as string) : [];
  const parsedAddons = addons ? JSON.parse(addons as string) : [];
  const parsedInstructions = instructions
    ? JSON.parse(instructions as string)
    : [];

  // Generate a mock Order ID
  const orderId = "#LAU" + Math.floor(Math.random() * 900000 + 100000);

  // Format today's date
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <SafeAreaView style={styles.safeArea}>
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
                color="#000000ff"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
          headerTitle: () => (
            <Text style={styles.headerTitle}>Order Summary</Text>
          ),
        }}
      />

      {/* Scrollable content */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* Order Info */}
        <View style={[styles.card, styles.highlightCard]}>
          <View style={styles.rowBetween}>
            <Text style={styles.orderId}>{orderId}</Text>
            <Text style={styles.date}>{formattedDate}</Text>
          </View>
        </View>

        {/* Selected Services */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🧺 Selected Services</Text>
          <View style={styles.listGroup}>
            {parsedServices.length > 0 ? (
              parsedServices.map((service: string, index: number) => (
                <Text key={index} style={styles.listItem}>
                  • {service}
                </Text>
              ))
            ) : (
              <Text style={styles.emptyText}>• No services selected</Text>
            )}
          </View>
        </View>

        {/* Laundry Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🧾 Laundry Details</Text>

          {/* Fabrics */}
          <Text style={styles.subTitle}>Fabric Type(s)</Text>
          <View style={styles.listGroup}>
            {parsedFabrics.length > 0 ? (
              parsedFabrics.map((fabric: string, index: number) => (
                <Text key={index} style={styles.listItem}>
                  • {fabric}
                </Text>
              ))
            ) : (
              <Text style={styles.emptyText}>• None</Text>
            )}
          </View>

          {/* Add-ons */}
          <Text style={styles.subTitle}>Add-ons</Text>
          <View style={styles.listGroup}>
            {parsedAddons.length > 0 ? (
              parsedAddons.map((addon: string, index: number) => (
                <Text key={index} style={styles.listItem}>
                  • {addon}
                </Text>
              ))
            ) : (
              <Text style={styles.emptyText}>• None</Text>
            )}
          </View>

          {/* Special Instructions */}
          <Text style={styles.subTitle}>Special Instructions</Text>
          <View style={styles.listGroup}>
            {parsedInstructions.length > 0 ? (
              parsedInstructions.map((instruction: string, index: number) => (
                <Text key={index} style={styles.listItem}>
                  • {instruction}
                </Text>
              ))
            ) : (
              <Text style={styles.emptyText}>• None</Text>
            )}
          </View>
        </View>

        {/* Delivery Option */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🚛 Delivery Option</Text>
          <View style={styles.listGroup}>
            <Text style={[styles.listItem, styles.deliveryOption]}>
              • {deliveryOption || "Not selected"}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Order Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.paymentButton}
          activeOpacity={0.9}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/homepage/order_confirm",
              params: {
                services: JSON.stringify(parsedServices),
                fabrics: JSON.stringify(parsedFabrics),
                addons: JSON.stringify(parsedAddons),
                instructions: JSON.stringify(parsedInstructions),
                deliveryOption: deliveryOption || "Not selected",
              },
            })
          }
        >
          <Text style={styles.paymentText}>Confirm Order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f7f9fc" },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 30 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  highlightCard: {
    borderColor: "#004aad",
    borderWidth: 1.5,
    backgroundColor: "#eaf2ff",
  },
  orderId: { fontSize: 18, fontWeight: "700", color: "#004aad" },
  date: { fontSize: 14, color: "#666", fontWeight: "500" },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 10,
    color: "#004aad",
  },
  subTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
    color: "#333",
  },
  listGroup: { marginLeft: 10 },
  listItem: {
    fontSize: 14,
    marginBottom: 6,
    color: "#444",
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    marginBottom: 6,
    fontStyle: "italic",
  },
  deliveryOption: { fontWeight: "600", color: "#004aad" },

  headerTitle: {
    color: "#000000ff",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 20,
  },
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
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  paymentText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});