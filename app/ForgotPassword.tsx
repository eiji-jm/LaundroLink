import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState(""); // phone or email

  const handleSendOtp = async () => {
    if (!identifier.trim()) {
      Alert.alert("Error", "Please enter your phone number or email");
      return;
    }

    try {
      const res = await fetch("http://192.168.1.70:5000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        Alert.alert(
          "OTP Sent",
          `OTP has been sent to ${identifier}. Check your server console.`
        );
        // Navigate to ResetPassword screen with userId
        router.push({
          pathname: "/ResetPassword",
          params: { userId: String(data.userId) },
        });
      } else {
        Alert.alert("Error", data.error || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your phone number or email"
        keyboardType="default"
        value={identifier}
        onChangeText={setIdentifier}
      />

      <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#89CFF0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#003366",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 15,
    borderRadius: 6,
  },
  button: {
    width: "100%",
    backgroundColor: "#004080",
    padding: 15,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
