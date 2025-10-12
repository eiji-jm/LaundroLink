import { AntDesign, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Google from "expo-auth-session/providers/google";
import { Stack, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function SignUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // ✅ ADDED: State for confirm password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // ✅ ADDED: State for confirm password visibility
  const [error, setError] = useState("");

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "323428340651-0m9edhhl606je6k74pshbe31pq06apt9.apps.googleusercontent.com",
    clientId: "323428340651-rprfrcvs3cqtrjtrdrj4ffh8u2ikjn3d.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${authentication?.accessToken}` },
      })
        .then((res) => res.json())
        .then(async (user) => {
          try {
            const res = await axios.post("http://192.168.1.70:5000/auth/google-login", {
              google_id: user.id,
              email: user.email,
              name: user.name,
              picture: user.picture,
            });

            if (res.data.success) {
              await AsyncStorage.setItem("user", JSON.stringify(res.data.user));
              Alert.alert("Welcome!", `Hello ${res.data.user.name}`);
              router.replace("/homepage");
            } else {
              setError(res.data.message || "Unable to log in with Google.");
            }
          } catch (err) {
            console.error("❌ Backend error:", err);
            setError("Failed to connect to server.");
          }
        })
        .catch((err) => console.error("❌ Google API error:", err));
    }
  }, [response]);

  // ✅ UPDATED: Manual sign-up with password validation
  const handleSignUp = () => {
    // Check if all fields are filled
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(""); // Clear any previous errors
    
    // Proceed to the verification screen, now passing the password
    router.push({
      pathname: "/Verify",
      params: { fullName, email, phone, password }, // Pass password to next screen
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Welcome to LaundroLink</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0, borderWidth: 0 }]}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#555" />
            </TouchableOpacity>
          </View>
          <View style={styles.inputBorder} />

          {/* ✅ ADDED: Confirm Password Field */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0, borderWidth: 0 }]}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={22} color="#555" />
            </TouchableOpacity>
          </View>
          <View style={styles.inputBorder} />

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/")}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => promptAsync()}
            disabled={!request}
          >
            <AntDesign
              name="google"
              size={20}
              color="#DB4437"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.socialText}>Sign up with Google</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#89CFF0", justifyContent: "center", padding: 20 },
  card: { backgroundColor: "#fff", borderRadius: 18, padding: 25, elevation: 5 },
  title: { fontSize: 28, fontWeight: "bold", color: "#003366", textAlign: "center" },
  subtitle: { fontSize: 15, color: "#555", textAlign: "center", marginBottom: 18 },
  errorText: { color: "red", fontSize: 13, textAlign: "center", marginBottom: 10 },
  input: { backgroundColor: "#f9f9f9", borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "#ddd", marginBottom: 15 },
  passwordContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#f9f9f9", borderRadius: 12, paddingHorizontal: 14 },
  inputBorder: { height: 1, backgroundColor: "#ddd", marginBottom: 15 },
  button: { backgroundColor: "#004080", padding: 16, borderRadius: 12, alignItems: "center", marginVertical: 15 },
  buttonText: { color: "#fff", fontSize: 17, fontWeight: "bold" },
  loginRow: { flexDirection: "row", justifyContent: "center" },
  loginText: { color: "#000", fontSize: 14 },
  loginLink: { color: "#004080", fontWeight: "bold", fontSize: 14 },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: 20 },
  line: { flex: 1, height: 1, backgroundColor: "#ddd" },
  orText: { marginHorizontal: 10, color: "#7f8c8d", fontSize: 14 },
  socialButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#ddd", borderRadius: 12, height: 50 },
  socialText: { fontSize: 16, fontWeight: "500", color: "#2c3e50" },
});