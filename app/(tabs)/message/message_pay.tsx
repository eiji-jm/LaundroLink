import { Entypo, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Message = {
  id: string;
  text?: string;
  sender: string;
  type?: string;
  image?: string;
  time?: string;
};

export default function MessagePay() {
  const { shopName, message, time } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);

  // Set header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: { backgroundColor: "#87CEFA" },
      headerTintColor: "#000",
      headerTitle: () => <Text style={styles.headerTitle}>{shopName}</Text>,
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => Linking.openURL("tel:09123456789")}>
          <Ionicons name="call" size={22} color="#000" style={{ marginRight: 15 }} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, shopName]);

  const [messages, setMessages] = useState<Message[]>(() => {
    const baseMessages: Message[] = [
      { id: "1", text: message as string, sender: "shop", time },
    ];

    if (shopName === "Wash n' Dry") {
      baseMessages.push({
        id: "2",
        text:
          "Your laundry order has been reviewed by our staff.\n\n" +
          "🧾 Breakdown:\n" +
          "• Weight: 0.75kg\n" +
          "• Wash & Dry: ₱200.00\n" +
          "• Steam Press: ₱100.00\n" +
          "• Folding: ₱50.00\n" +
          "• Pickup & Delivery Fee: ₱150.00\n\n" +
          "💵 Total Amount Due: ₱500.00\n\n" +
          "Please review and confirm to proceed.",
        sender: "shop",
        type: "confirmation",
        time,
      });
    }
    return baseMessages;
  });

  const [inputMessage, setInputMessage] = useState("");

  const handleSend = () => {
    if (!inputMessage.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputMessage("");
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const newMsg: Message = {
        id: Date.now().toString(),
        sender: "user",
        image: result.assets[0].uri,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, newMsg]);
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Camera permission is required to take photos");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const newMsg: Message = {
        id: Date.now().toString(),
        sender: "user",
        image: result.assets[0].uri,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, newMsg]);
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  const handleConfirm = () => {
    router.push({
      pathname: "/(tabs)/payment/pay",
      params: { from: "message_pay", shopName, totalAmount: "500.00" },
    });
  };

  const handleCancel = () => {
    alert("Your order has been cancelled successfully.");
    router.back();
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === "user" ? styles.userBubble : styles.shopBubble,
      ]}
    >
      {item.text && <Text style={styles.messageText}>{item.text}</Text>}
      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={{ width: 200, height: 200, borderRadius: 10, marginTop: 5 }}
        />
      )}
      {item.type === "confirmation" && (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.payBtn} onPress={handleConfirm}>
            <Text style={styles.payBtnText}>Confirm & Pay</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
            <Text style={styles.cancelBtnText}>Cancel Order</Text>
          </TouchableOpacity>
        </View>
      )}
      <Text style={styles.messageTime}>{item.time}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          style={{ flex: 1, padding: 15 }}
          contentContainerStyle={{ paddingBottom: 90 }}
          renderItem={renderMessage}
        />

        <View style={styles.inputBar}>
          <TouchableOpacity onPress={handlePickImage}>
            <Ionicons name="image-outline" size={24} color="#555" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleTakePhoto}>
            <Ionicons name="camera-outline" size={24} color="#555" style={{ marginLeft: 10 }} />
          </TouchableOpacity>
          <Entypo name="plus" size={24} color="#555" style={{ marginLeft: 10 }} />

          <TextInput
            placeholder="Type a message"
            value={inputMessage}
            onChangeText={setInputMessage}
            style={styles.textInput}
            placeholderTextColor="#888"
          />
          <Ionicons name="happy-outline" size={24} color="#555" />
          <Ionicons name="mic-outline" size={24} color="#555" style={{ marginLeft: 10 }} />
          <TouchableOpacity onPress={handleSend}>
            <Ionicons name="send" size={24} color="#1E90FF" style={{ marginLeft: 10 }} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 10,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 15,
    marginVertical: 5,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  shopBubble: { backgroundColor: "#eee", alignSelf: "flex-start" },
  userBubble: { backgroundColor: "#87CEFA", alignSelf: "flex-end" },
  messageText: { fontSize: 16, color: "#000" },
  messageTime: {
    fontSize: 10,
    color: "#555",
    marginTop: 4,
    textAlign: "right",
  },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  payBtn: {
    backgroundColor: "#87CEFA",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  payBtnText: { color: "#000", fontWeight: "bold", fontSize: 14 },
  cancelBtn: {
    backgroundColor: "#F80000",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cancelBtnText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6e6e6",
    padding: 8,
    borderRadius: 25,
    margin: 10,
  },
  textInput: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 16,
    paddingVertical: 5,
    color: "#000",
  },
});