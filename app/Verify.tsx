import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Verify() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  
  // ✅ ADDED: This log will appear in your APP'S terminal (where you ran npx expo start)
  console.log("USER ID RECEIVED ON VERIFY SCREEN:", userId);

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const sendOtp = async () => {
    if (!userId) {
      console.log("Cannot send OTP because userId is missing.");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch("http://192.168.1.70:5000/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert("OTP Sent", "An OTP has been sent to your email.");
      } else {
        Alert.alert("Error", data.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("❌ Send OTP error:", error);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    sendOtp();
  }, [userId]);

  const handleVerify = async () => {
    if (!otp) {
      Alert.alert("Missing OTP", "Please enter the OTP from your email.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("http://192.168.1.70:5000/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert("Success", "Your account has been verified!");
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        router.replace("/homepage/homepage");
      } else {
        Alert.alert("Verification Failed", data.message || "Please try again.");
      }
    } catch (error) {
      console.error("❌ OTP verification error:", error);
      Alert.alert("Error", "Something went wrong during verification.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator size="large" color="#fff" style={StyleSheet.absoluteFill} />}
      <Text style={styles.title}>Verify Your Account</Text>
      <Text style={styles.subtitle}>Enter the OTP sent to your email to activate your account.</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        placeholderTextColor="#aaa"
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
        maxLength={6}
      />

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={sendOtp}>
        <Text style={styles.resendText}>Resend OTP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#89CFF0", alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#003366", marginBottom: 10 },
  subtitle: { color: "#003366", fontSize: 14, marginBottom: 20, textAlign: 'center' },
  input: { width: "100%", backgroundColor: "#fff", borderRadius: 6, padding: 12, marginBottom: 15, borderWidth: 1, borderColor: "#ddd", textAlign: "center", fontSize: 18, letterSpacing: 4 },
  button: { width: "100%", backgroundColor: "#004080", padding: 15, borderRadius: 6, alignItems: "center", marginVertical: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  resendText: { color: "#003366", textDecorationLine: "underline", marginTop: 15, fontSize: 14 },
});