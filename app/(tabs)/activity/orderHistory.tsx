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
        <Ionicons name="checkmark-done-circle" size={95} color="#004aad" />
        <Text style={styles.successText}>Payment Successful</Text>
      </View>

      {/* Receipt Info */}
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Receipt #</Text>
          <Text style={styles.value}>RCPT-2025-0911-001</Text>
        </View>
        <View style={styles.divider} />
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
      <View style={[styles.card, styles.contactCard]}>
        <Text style={styles.contactText}>
          📞 Need help? Call <Text style={styles.highlight}>(123) 456-7890</Text>{" "}
          or send us a direct message.
        </Text>
      </View>

      {/* Done Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Done</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f8fe" },

  header: { alignItems: "center", marginVertical: 25 },
  successText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#004aad",
    marginTop: 10,
    letterSpacing: 0.5,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 18,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: { fontSize: 14, color: "#555" },
  value: { fontSize: 14, fontWeight: "600", color: "#000" },

  subHeader: {
    fontWeight: "bold",
    fontSize: 17,
    marginBottom: 12,
    color: "#004aad",
    textAlign: "center",
  },

  row: { flexDirection: "row", justifyContent: "space-between", marginVertical: 6 },
  item: { fontSize: 14, color: "#444" },
  price: { fontSize: 14, fontWeight: "500", color: "#111" },

  totalRow: {
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 10,
  },
  totalText: { fontWeight: "700", fontSize: 15, color: "#004aad" },

  thankYou: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
    color: "#004aad",
  },
  note: { fontSize: 13, textAlign: "center", color: "#666", lineHeight: 18 },

  contactCard: { backgroundColor: "#f8fbff", borderColor: "#cde7ff", borderWidth: 1 },

  contactText: {
    fontSize: 13,
    textAlign: "center",
    color: "#333",
    lineHeight: 18,
  },
  highlight: { fontWeight: "bold", color: "#004aad" },

  button: {
    marginHorizontal: 20,
    marginVertical: 25,
    backgroundColor: "#004aad",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16, letterSpacing: 0.3 },
});