import { router, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Activity() {
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
              fontWeight: "600",
            }}
          >
            Activity
          </Text>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {/* Recent Order */}
      <Text style={styles.sectionTitle}>Recent Order</Text>
      <View style={styles.card}>
        <Image source={require("@/assets/images/washndry.png")} style={styles.logo} />
        <View style={styles.details}>
          <View style={styles.rowBetween}>
            <Text style={styles.orderId}>#LAU123456</Text>
            <View style={styles.statusBadgeProgress}>
              <Text style={styles.statusText}>IN PROGRESS</Text>
            </View>
          </View>
          <Text style={styles.orderText}>Pickup: Apr 30, 02:00PM</Text>
          <Text style={styles.orderText}>Delivery: May 1, 03:00PM</Text>
          <Text style={styles.orderTotal}>Total: ₱ 450.00</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/(tabs)/activity/receipt")}
          >
            <Text style={styles.buttonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Order History */}
      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Order History</Text>
      {[
        { id: "#CBI927648", date: "Feb 27", logo: require("@/assets/images/sparklean.jpg") },
        { id: "#IJE638975", date: "Mar 15", logo: require("@/assets/images/washnwait.jpg") },
        { id: "#ABC078365", date: "Apr 02", logo: require("@/assets/images/laundry.avif") },
      ].map((item, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={0.8}
          onPress={() => router.push("/(tabs)/activity/orderHistory" as any)}
        >
          <View style={styles.historyCard}>
            <Image source={item.logo} style={styles.historyLogo} />
            <View style={styles.historyDetails}>
              <Text style={styles.historyId}>{item.id}</Text>
              <Text style={styles.historyDate}>{item.date}</Text>
            </View>
            <View style={styles.deliveredBadge}>
              <Text style={styles.deliveredText}>DELIVERED</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6faff",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 20,
  },
  logo: {
    width: 85,
    height: 85,
    borderRadius: 10,
    marginRight: 14,
  },
  details: {
    flex: 1,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  orderId: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  statusBadgeProgress: {
    backgroundColor: "#E6FCD9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#3EBE2A",
  },
  statusText: {
    fontWeight: "700",
    fontSize: 12,
    color: "#2d2d2dff",
  },
  orderText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 3,
  },
  orderTotal: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 4,
    color: "#004aad",
  },
  button: {
    backgroundColor: "#004aad",
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  historyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  historyLogo: {
    width: 65,
    height: 65,
    borderRadius: 10,
    marginRight: 14,
  },
  historyDetails: {
    flex: 1,
  },
  historyId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  historyDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  deliveredBadge: {
    backgroundColor: "#D9F1FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#0D47A1",
  },
  deliveredText: {
    color: "#004aad",
    fontWeight: "700",
    fontSize: 12,
  },
});