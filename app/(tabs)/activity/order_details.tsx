import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useLayoutEffect } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function OrderDetails() {
  const navigation = useNavigation();
  const router = useRouter();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: "#89CFF0",
        borderBottomWidth: 1.5,
        borderBottomColor: "#5EC1EF",
      },
      headerTintColor: "#000",
      headerShadowVisible: false,
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              color: "#2d2d2d",
              marginLeft: 5,
              fontSize: 20,
              fontWeight: "600",
            }}
          >
            Order Details
          </Text>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.card}>
          {/* Customer Info */}
          <View style={styles.section}>
            <View style={styles.row}>
              <Ionicons name="person-circle-outline" size={28} color="#004aad" />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.customerName}>MJ Dimpas</Text>
                <Text style={styles.customerPhone}>0917-123-4567</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Order Info */}
          <View style={styles.section}>
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.sectionTitle}>Order Information</Text>
                <Text style={[styles.detailText, { fontWeight: "600" }]}>
                  Order ID: <Text style={{ color: "#004aad" }}>#LAU123456</Text>
                </Text>
              </View>
              <Text style={styles.detailText}>01 Sept 2025</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Service Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Details</Text>

            <View style={styles.rowBetween}>
              <MaterialIcons name="local-laundry-service" size={18} color="#666" />
              <Text style={styles.label}>Service Type:</Text>
              <Text style={styles.value}>Wash & Fold</Text>
            </View>

            <View style={styles.rowBetween}>
              <Ionicons name="time-outline" size={18} color="#666" />
              <Text style={styles.label}>Pickup:</Text>
              <Text style={styles.value}>Sept 1, 2:00 PM</Text>
            </View>

            <View style={styles.rowBetween}>
              <Ionicons name="calendar-outline" size={18} color="#666" />
              <Text style={styles.label}>Delivery:</Text>
              <Text style={styles.value}>Sept 2, 6:00 PM</Text>
            </View>

            <View style={styles.rowBetween}>
              <FontAwesome5 name="money-bill-wave" size={16} color="#004aad" />
              <Text style={styles.label}>Total Amount:</Text>
              <Text style={[styles.value, { color: "#004aad", fontWeight: "700" }]}>
                ₱ 370.00
              </Text>
            </View>

            <View style={styles.rowBetween}>
              <Ionicons name="card-outline" size={18} color="#666" />
              <Text style={styles.label}>Payment Method:</Text>
              <Text style={[styles.value, { fontWeight: "600" }]}>GCash</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Delivery Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Information</Text>
            <View style={styles.rowBetween}>
              <Ionicons name="cube-outline" size={18} color="#666" />
              <Text style={styles.label}>Type:</Text>
              <Text style={styles.value}>Pickup & Delivery</Text>
            </View>
            <View style={styles.rowBetween}>
              <Ionicons name="location-outline" size={18} color="#666" />
              <Text style={styles.label}>Address:</Text>
              <Text style={[styles.value, { flex: 1, textAlign: "right" }]}>
                123 Jasmine St., Cebu City
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Done Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.dismissAll()} 
        >
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  card: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  section: {
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  customerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  customerPhone: {
    fontSize: 14,
    color: "#555",
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
    marginVertical: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: "#004aad",
  },
  detailText: {
    fontSize: 14,
    color: "#333",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
    gap: 6,
  },
  label: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111",
  },
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
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});