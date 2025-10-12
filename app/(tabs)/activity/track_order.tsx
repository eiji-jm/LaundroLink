import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TrackOrder() {
  const router = useRouter();
  const navigation = useNavigation();

  const steps = [
    { icon: "bag-check-outline", title: "Order Placed", time: "Sept 1, 01:45PM" },
    { icon: "water-outline", title: "Washing", time: "Sept 1, 02:30PM" },
    { icon: "shirt-outline", title: "Steam Pressing", time: "Sept 1, 03:15PM" },
    { icon: "layers-outline", title: "Folding", time: "Sept 1, 04:00PM" },
    { icon: "car-outline", title: "Out for Delivery", time: "Sept 1, 05:30PM" },
  ];

  // Current active step (example: 2 = "Steam Pressing")
  const activeStep = 2;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: "#89CFF0",
        borderBottomWidth: 1,
        borderBottomColor: "#5EC1EF",
      },
      headerTintColor: "#000000ff",
      headerShadowVisible: false,
      headerTitle: () => (
        <Text style={styles.headerTitle}>Track My Order</Text>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Scrollable content */}
      <ScrollView style={styles.scrollContent}>
        {/* Pickup Info Card */}
        <View style={styles.pickupCard}>
          <Ionicons name="time-outline" size={26} color="#004aad" style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.pickupTime}>01:45 - 02:00PM</Text>
            <Text style={styles.pickupNote}>
              Your order has been placed and will be picked up on Sept 1, 02:00PM.
            </Text>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.timeline}>
          {steps.map((step, index) => {
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;

            return (
              <View key={index} style={styles.step}>
                {/* Connector line */}
                {index !== steps.length - 1 && (
                  <View
                    style={[
                      styles.connector,
                      isCompleted ? styles.connectorActive : {},
                    ]}
                  />
                )}

                {/* Step Icon */}
                <View
                  style={[
                    styles.stepIconWrapper,
                    isActive ? styles.activeStep : isCompleted ? styles.completedStep : {},
                  ]}
                >
                  <Ionicons
                    name={step.icon as any}
                    size={22}
                    color={isActive || isCompleted ? "#fff" : "#888"}
                  />
                </View>

                {/* Step Content */}
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, isActive && styles.stepTitleActive]}>
                    {step.title}
                  </Text>
                  <Text style={styles.stepTime}>{step.time}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Fixed Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(tabs)/activity/order_details")}
        >
          <Text style={styles.buttonText}>View Order Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6faff" },
  scrollContent: { flex: 1 },

  // Header
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000ff",
  },

  // Pickup Card
  pickupCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  pickupTime: { fontSize: 16, fontWeight: "bold", color: "#004aad" },
  pickupNote: { fontSize: 13, color: "#555", marginTop: 4 },

  // Timeline
  timeline: { marginVertical: 20, marginLeft: 30, paddingRight: 20 },
  step: { flexDirection: "row", alignItems: "flex-start", marginBottom: 35, position: "relative" },

  connector: {
    position: "absolute",
    left: -15,
    top: 28,
    width: 2,
    height: "100%",
    backgroundColor: "#ccc",
  },
  connectorActive: {
    backgroundColor: "#004aad",
  },

  stepIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  activeStep: { backgroundColor: "#004aad" },
  completedStep: { backgroundColor: "#5EC1EF" },

  stepContent: { flex: 1 },
  stepTitle: { fontSize: 15, fontWeight: "500", color: "#444" },
  stepTitleActive: { color: "#004aad", fontWeight: "700" },
  stepTime: { fontSize: 12, color: "#777", marginTop: 3 },

  // Footer Button
  footer: {
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },

  button: {
    margin: 20,
    backgroundColor: "#004aad",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});