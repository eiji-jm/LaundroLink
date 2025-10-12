import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function Index() {
  const [identifier, setIdentifier] = useState(""); // phone or email
  const [password, setPassword] = useState("");
  const router = useRouter();

  const redirectUri = AuthSession.makeRedirectUri({ useProxy: false });
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "323428340651-rprfrcvs3cqtrjtrdrj4ffh8u2ikjn3d.apps.googleusercontent.com",
    webClientId: "323428340651-rprfrcvs3cqtrjtrdrj4ffh8u2ikjn3d.apps.googleusercontent.com",
    redirectUri,
  });

  const getUserInfo = async (token: string) => {
    try {
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await res.json();
      const backendRes = await fetch("http://192.168.1.70:5000/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          google_id: user.sub,
          email: user.email,
          name: user.name,
          picture: user.picture,
        }),
      });
      const data = await backendRes.json();
      if (backendRes.ok && data.success) {
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        router.replace("/homepage/homepage");
      } else {
        Alert.alert("Error", data.message || "Failed to verify your Google account.");
      }
    } catch (error) {
      console.error("Google login error:", error);
      Alert.alert("Error", "Failed to sign in with Google. Please try again.");
    }
  };

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.accessToken) {
        getUserInfo(authentication.accessToken);
      }
    }
  }, [response]);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert("Missing Fields", "Please enter your phone/email and password.");
      return;
    }
    try {
      const response = await fetch("http://192.168.1.70:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Login Failed", data.message || "Invalid credentials");
        return;
      }
      
      if (data.success && data.userId) {
        router.push({ pathname: "/Verify", params: { userId: String(data.userId) } });
      } else {
        Alert.alert("Error", "Could not initiate login. Please try again.");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      Alert.alert("Error", "Something went wrong during login.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LaundroLink</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone or Email"
        placeholderTextColor="#aaa"
        keyboardType="default"
        value={identifier}
        onChangeText={setIdentifier}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.forgotButton}
        // ✅ UPDATED: Points directly to the ResetPassword screen
        onPress={() => router.push("/ResetPassword")}
      >
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>────────  or  ────────</Text>
      <TouchableOpacity
        style={styles.socialButton}
        disabled={!request}
        onPress={() => promptAsync()}
      >
        <AntDesign name="google" size={20} color="#DB4437" style={{ marginRight: 8 }} />
        <Text style={styles.socialText}>Continue with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#89CFF0", alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#003366", marginBottom: 30 },
  input: { width: "100%", backgroundColor: "#fff", borderRadius: 6, padding: 12, marginBottom: 15, borderWidth: 1, borderColor: "#ddd" },
  button: { width: "100%", backgroundColor: "#004080", padding: 15, borderRadius: 6, alignItems: "center", marginVertical: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  forgotButton: { alignSelf: "flex-end", marginBottom: 20 },
  forgotText: { color: "#003366", fontSize: 14, textDecorationLine: "underline" },
  orText: { marginVertical: 20, color: "#7f8c8d", fontSize: 14 },
  socialButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%", height: 50, borderRadius: 12, borderWidth: 1, borderColor: "#ddd", backgroundColor: "#fff", marginBottom: 15 },
  socialText: { fontSize: 16, fontWeight: "500", color: "#2c3e50" },
});