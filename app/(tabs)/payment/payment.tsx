import { router, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Payment() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: { 
        backgroundColor: "#89CFF0",
        borderBottomWidth: 1.5,       
        borderBottomColor: "#5EC1EF", 
      },
      headerTintColor: "#5EC1EF",
      headerShadowVisible: false, 
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              color: "#2d2d2dff",
              marginLeft: 5,
              fontSize: 20,
              fontWeight: "700",
            }}
          >
            Payment
          </Text>
        </View>
      ),
    });
  }, [navigation]);

  // Payment history data
  const historyData = [
    { date: "Apr 30", amount: "₱ 450.00", status: "Paid", invoice: "#LAU123456" },
    { date: "Apr 02", amount: "₱ 250.00", status: "Cancelled", invoice: "#ABC078365" },
    { date: "Mar 15", amount: "₱ 300.00", status: "Paid", invoice: "#IJE638975" },
    { date: "Feb 27", amount: "₱ 400.00", status: "Refunded", invoice: "#CBI927648" },
    { date: "Feb 10", amount: "₱ 350.00", status: "Paid", invoice: "#XYZ123456" },
    { date: "Jan 25", amount: "₱ 500.00", status: "Paid", invoice: "#LMN654321" },
    { date: "Jan 10", amount: "₱ 275.00", status: "Cancelled", invoice: "#QRS987654" },
    { date: "Dec 30", amount: "₱ 600.00", status: "Paid", invoice: "#TUV321987" },
    { date: "Dec 15", amount: "₱ 425.00", status: "Refunded", invoice: "#GHI456789" },
    { date: "Nov 28", amount: "₱ 375.00", status: "Paid", invoice: "#JKL789123" },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Paid":
        return { backgroundColor: "#d4edda", color: "#2e7d32" };
      case "Cancelled":
        return { backgroundColor: "#f8d7da", color: "#c62828" };
      case "Refunded":
        return { backgroundColor: "#fff3cd", color: "#ff8f00" };
      default:
        return { backgroundColor: "#e0e0e0", color: "#555" };
    }
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Recent Payment */}
      <Text style={styles.sectionTitle}>Recent Payment</Text>
      <View style={styles.recentCard}>
        <View style={styles.recentRow}>
          <Text style={styles.date}>Apr 30, 2025</Text>
          <Text style={styles.amount}>₱ 450.00</Text>
        </View>
        <View style={styles.recentRow}>
          <Text style={styles.invoice}>#LAU123456</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusStyle("Paid").backgroundColor }]}>
            <Text style={[styles.statusText, { color: getStatusStyle("Paid").color }]}>Paid</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/payment/invoice",
              params: { invoice: "#LAU123456", amount: "₱ 450.00", status: "Paid", date: "Apr 30, 2025" },
            })
          }
        >
          <Text style={styles.buttonText}>View Invoice</Text>
        </TouchableOpacity>
      </View>

      {/* Payment History */}
      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Payment History</Text>
      {historyData.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.historyCard}
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/payment/invoice",
              params: { invoice: item.invoice, amount: item.amount, status: item.status, date: item.date },
            })
          }
        >
          <View style={styles.historyRow}>
            <Text style={styles.historyDate}>{item.date}</Text>

            {/* Right side grouped */}
            <View style={styles.rightContainer}>
              <Text style={styles.historyAmount}>{item.amount}</Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusStyle(item.status).backgroundColor }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: getStatusStyle(item.status).color }
                ]}>
                  {item.status}
                </Text>
              </View>
            </View>
          </View>
          <Text style={styles.historyInvoice}>{item.invoice}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    color: "#000",
  },
  recentCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  recentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    alignItems: "center",
  },
  date: { fontSize: 16, fontWeight: "500" },
  amount: { fontSize: 16, fontWeight: "700", color: "#004aad" },
  invoice: { fontSize: 14, color: "#555" },

  // Button
  button: {
    backgroundColor: "#004aad",
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },

  // History
  historyCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8, 
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0", 
  },

  historyDate: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    flex: 1, 
  },

  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    minWidth: 140,
  },

  historyAmount: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "right",
    color: "#174EA6",
    letterSpacing: 0.3,
    marginRight: 8,
  },

  historyInvoice: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
    fontStyle: "italic",   
  },

  // Status badge
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: "center",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#333",
  },
});