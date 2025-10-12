import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // ✅ ADDED
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    try {
      // Note: This now uses the consistent '/auth/forgot-password' endpoint
      const res = await fetch("http://192.168.1.70:5000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        Alert.alert("Success", `If an account for ${email} exists, an OTP has been sent.`);
        setTimer(60); // Start 60-second timer
      } else {
        Alert.alert("Error", data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  const handleResetPassword = async () => {
    // ✅ UPDATED: Validation includes confirmPassword
    if (!email.trim() || !otp.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match.");
        return;
    }

    try {
      const res = await fetch("http://192.168.1.70:5000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.trim(),
          newPassword: newPassword.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        Alert.alert("Success", "Password reset successful! Please log in.");
        router.replace("/");
      } else {
        Alert.alert("Error", data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity
        style={[styles.button, timer > 0 && styles.buttonDisabled]}
        onPress={handleSendOtp}
        disabled={timer > 0}
      >
        <Text style={styles.buttonText}>
          {timer > 0 ? `Resend OTP in ${timer}s` : "Send OTP"}
        </Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter new password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      {/* ✅ ADDED: Confirm Password input */}
      <TextInput
        style={styles.input}
        placeholder="Confirm new password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>

      {/* ✅ ADDED: Back to Login link */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/")}>
        <Text style={styles.backButtonText}>Back to Login</Text>
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
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: "#7a8ca0",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
      marginTop: 15,
  },
  backButtonText: {
      color: '#003366',
      textDecorationLine: 'underline'
  }
});