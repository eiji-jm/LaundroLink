import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Receipt() {
  const router = useRouter();
  const navigation = useNavigation();

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
            Receipt
          </Text>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      {/* Success Icon */}
      <View style={styles.header}>
        <Ionicons name="checkmark-done-circle" size={90} color="#004aad" />
        <Text style={styles.successText}>Payment Successful</Text>
      </View>

      {/* Receipt Info */}
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Receipt #</Text>
          <Text style={styles.value}>RCPT-2025-0911-001</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Date Issued</Text>
          <Text style={styles.value}>01 Sept 2025</Text>
        </View>
      </View>

      {/* Payment Summary */}
      <View style={styles.card}>
        <Text style={styles.subHeader}>Payment Summary</Text>
        <View style={styles.row}>
          <Text style={styles.item}>Laundry (Wash & Fold – 5kg)</Text>
          <Text style={styles.price}>₱250</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.item}>Service Fee</Text>
          <Text style={styles.price}>₱50</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.item}>Delivery Fee</Text>
          <Text style={styles.price}>₱70</Text>
        </View>
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalText}>Total Paid</Text>
          <Text style={styles.totalText}>₱370</Text>
        </View>
      </View>

      {/* Thank You */}
      <View style={styles.card}>
        <Text style={styles.thankYou}>Thank you for using LaundroLink!</Text>
        <Text style={styles.note}>
          We appreciate your trust and look forward to serving you again.
        </Text>
      </View>

      {/* Contact */}
      <View style={styles.card}>
        <Text style={styles.contactText}>
          📞 Need help? Call <Text style={styles.highlight}>(123) 456-7890</Text> or send us a direct message.
        </Text>
      </View>

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(tabs)/activity/track_order")}
      >
        <Text style={styles.buttonText}>Track My Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f8fc" },

  header: { alignItems: "center", marginVertical: 20 },
  successText: { fontSize: 20, fontWeight: "bold", color: "#004aad", marginTop: 10 },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 18,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: { fontSize: 14, color: "#555" },

  value: { fontSize: 14, fontWeight: "600", color: "#000" },

  subHeader: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 12,
    color: "#004aad",
    textAlign: "center",
  },

  row: { flexDirection: "row", justifyContent: "space-between", marginVertical: 6 },

  item: { fontSize: 14, color: "#444" },

  price: { fontSize: 14, color: "#000" },

  totalRow: { marginTop: 12, borderTopWidth: 1, borderColor: "#ddd", paddingTop: 10 },

  totalText: { fontWeight: "bold", fontSize: 15, color: "#000" },

  thankYou: { fontWeight: "bold", fontSize: 15, marginBottom: 5, textAlign: "center", color: "#004aad" },
  
  note: { fontSize: 13, textAlign: "center", color: "#666" },

  contactText: { fontSize: 13, textAlign: "center", color: "#333", lineHeight: 18 },
  highlight: { fontWeight: "bold", color: "#004aad" },

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