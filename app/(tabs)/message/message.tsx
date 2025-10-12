import { useNavigation, useRouter } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Message() {
  const router = useRouter();
  const navigation = useNavigation();

  const [messages, setMessages] = useState([
    {
      id: "1",
      logo: require("@/assets/images/washndry.png"),
      title: "Wash n' Dry",
      message: "Order update: Price confirmed",
      time: "08:26PM",
      unread: true,
    },
    {
      id: "2",
      logo: require("@/assets/images/24hour.jpg"),
      title: "24-Hour Laundry",
      message: "Good day! I just wanted to say thank you for your excellent laundry service...",
      time: "08:26PM",
      unread: false,
    },
    {
      id: "3",
      logo: require("@/assets/images/laundry.avif"),
      title: "Laundry Cleaning",
      message: "Thank you for the great service! My clothes came back fresh and neatly folded...",
      time: "05:50PM",
      unread: true,
    },
    // ... add more messages
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: "#89CFF0",
        borderBottomWidth: 1.5,
        borderBottomColor: "#5EC1EF",
      },
      headerTintColor: "#2d2d2dff",
      headerShadowVisible: false,
      headerTitle: () => <Text style={styles.headerTitle}>Messages</Text>,
    });
  }, [navigation]);

  const handlePress = (id: string, item: any) => {
    // Mark the message as read
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, unread: false } : msg
      )
    );

    // Navigate to message detail
    router.push({
      pathname: "/message/message_pay",
      params: {
        shopName: item.title,
        message: item.message,
        time: item.time,
      },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {messages.map((item) => (
        <Pressable
          key={item.id}
          style={[styles.card, item.unread && styles.unreadCard]}
          onPress={() => handlePress(item.id, item)}
        >
          <Image source={item.logo} style={styles.logo} />
          <View style={styles.messageContent}>
            <View style={styles.headerRow}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
            <Text style={styles.message} numberOfLines={1}>
              {item.message}
            </Text>
          </View>
          {item.unread && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>NEW</Text>
            </View>
          )}
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
  headerTitle: {
    color: "#2d2d2dff",
    fontSize: 20,
    fontWeight: "600",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
    position: "relative",
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#1E90FF",
  },
  logo: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 14,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  messageContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  time: {
    fontSize: 12,
    color: "#888",
  },
  message: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  unreadBadge: {
    backgroundColor: "#1E90FF",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
    alignSelf: "flex-start",
  },
  unreadText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
});