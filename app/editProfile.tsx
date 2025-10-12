import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// This interface defines the expected user data structure
interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  picture?: string;
}

const EditProfileScreen: React.FC = () => {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Editable fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);

  // Fetch user data from AsyncStorage on component load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setName(parsedUser.name);
          setPhone(parsedUser.phone || "");
          setProfilePic(parsedUser.picture || null);
        } else {
          Alert.alert("Session Expired", "Please log in again.");
          router.replace("/");
        }
      } catch (e) {
        console.error("Failed to load user from AsyncStorage", e);
        Alert.alert("Error", "Failed to load profile data.");
        router.replace("/");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const saveProfile = async () => {
    if (!user) return;
    try {
      const payload: any = {
        name,
        phone,
      };

      // ✅ Now sends a request to the simplified update endpoint
      const response = await axios.put(
        `http://192.168.1.70:5000/api/users/${user.id}/edit`,
        payload
      );

      if (response.data.success) {
        const updatedUser = {
          ...user,
          name: response.data.user.name,
          phone: response.data.user.phone,
        };
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        Alert.alert("Success", "Profile updated successfully!");
        router.replace("/homepage/homepage");
      } else {
        Alert.alert("Update Failed", response.data.message);
      }
    } catch (error) {
      console.error("❌ Profile update error:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  const changeProfilePic = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow photo library access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
      // You should also send this to the backend to save the picture URL
    }
  };

  if (loading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarWrap}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.avatarImg} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarInitials}>
                {user?.name ? user.name.charAt(0) : "C"}
              </Text>
            </View>
          )}
          <TouchableOpacity style={styles.editIconWrap} onPress={changeProfilePic}>
            <MaterialIcons name="edit" size={22} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>{user.name}</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Full Name"
          placeholderTextColor={COLORS.placeholder}
        />
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone Number"
          placeholderTextColor={COLORS.placeholder}
          keyboardType="phone-pad"
        />
        <TextInput
          style={[styles.input, { color: "#888", backgroundColor: "#f0f0f0" }]}
          value={user.email}
          editable={false}
          placeholder="Email Address"
        />

        <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const COLORS = {
  sky: "#89CFF0",
  white: "#FFFFFF",
  primary: "#174EA6",
  placeholder: "#A0A0A0",
  textDark: "#000000",
  borderGray: "#ccc",
  lightGray: "#E0E0E0",
  iconGray: "#666666",
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.sky },
  content: { padding: 20, paddingBottom: 32 },
  avatarWrap: { alignItems: "center", marginVertical: 12 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#5B8FB9",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImg: { width: 100, height: 100, borderRadius: 50 },
  avatarInitials: { fontSize: 32, fontWeight: "800", color: COLORS.white },
  editIconWrap: {
    position: "absolute",
    bottom: 0,
    right: 120,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 6,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    color: COLORS.textDark,
  },
  section: {
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderGray,
    paddingTop: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700" },
  addBtn: { fontSize: 16, color: COLORS.primary, fontWeight: "600" },
  addressRow: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  removeBtn: {
    marginLeft: 10,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    padding: 6,
  },
  removeText: { color: COLORS.iconGray, fontWeight: "700", fontSize: 14 },
  saveBtn: {
    marginTop: 28,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  saveBtnText: { color: COLORS.white, fontSize: 18, fontWeight: "700" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    width: "100%",
  },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 12, textAlign: "center" },
  modalBtn: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    alignItems: "center",
  },
  modalBtnText: { color: COLORS.white, fontSize: 16, fontWeight: "600" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.sky,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 6,
    paddingHorizontal: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
});
export default EditProfileScreen;