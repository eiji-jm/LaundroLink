import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Payment() {
  const router = useRouter();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const totalAmount = 500.0;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: "#87CEFA",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
      },
      headerTintColor: "#000",
      headerTitle: () => <Text style={styles.headerTitle}>Select Payment Method</Text>,
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()} style={{ paddingHorizontal: 10 }}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleGCashPayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setModalMessage("✅ Payment Successful via GCash!");
      setSuccessModal(true);
    }, 2000);
  };

  const handleCODPayment = () => {
    setModalMessage(
      `Cash on Delivery selected.\nPlease prepare the exact amount upon pickup. 💵`
    );
    setSuccessModal(true);
  };

  const closeModal = () => {
    setSuccessModal(false);
    router.back(); // return to message_pay
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.amountTitle}>Total Amount Due</Text>
        <Text style={styles.amount}>₱{totalAmount.toFixed(2)}</Text>

        <Text style={styles.subtitle}>Choose your payment method:</Text>

        {/* GCash Option */}
        <TouchableOpacity
          style={[styles.optionCard, loading && { opacity: 0.6 }]}
          onPress={handleGCashPayment}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Image
            source={{
              uri: "https://tse3.mm.bing.net/th/id/OIP.rEo8KqIw3Wjue1ENEPdZUAHaDt?pid=Api&P=0&h=180",
            }}
            style={styles.logo}
          />
          <Text style={styles.optionText}>GCash</Text>
          {loading && <ActivityIndicator style={{ marginLeft: 10 }} color="#1E90FF" />}
        </TouchableOpacity>

        {/* Cash on Delivery */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={handleCODPayment}
          activeOpacity={0.7}
        >
          <Ionicons name="cash-outline" size={28} color="#2ecc71" style={styles.icon} />
          <Text style={styles.optionText}>Cash on Delivery (pickup only)</Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal
        visible={successModal}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Ionicons name="checkmark-circle-outline" size={64} color="#1E90FF" />
            <Text style={styles.modalTitle}>{modalMessage}</Text>
            <Text style={styles.modalAmount}>₱{totalAmount.toFixed(2)}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#000" },
  content: { padding: 20 },
  amountTitle: { fontSize: 16, color: "#555", marginBottom: 5 },
  amount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1E90FF",
    marginBottom: 20,
    textShadowColor: "#aaa",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  subtitle: { fontSize: 16, fontWeight: "600", marginVertical: 15 },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  optionText: { fontSize: 16, fontWeight: "600", marginLeft: 12, color: "#333" },
  logo: { width: 40, height: 40, resizeMode: "contain" },
  icon: { marginRight: 5 },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginVertical: 10 },
  modalAmount: { fontSize: 24, fontWeight: "bold", color: "#1E90FF", marginBottom: 20 },
  modalButton: {
    backgroundColor: "#1E90FF",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 20,
  },
  modalButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});