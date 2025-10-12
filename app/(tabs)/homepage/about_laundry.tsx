import { Ionicons } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function AboutLaundry() {
  const { 
    id, name, distance, rating, image,
    description, addDescription, address,
    contact, hours, availability, prices
  } = useLocalSearchParams();

  // ✅ Parse prices
  const parsedPrices = typeof prices === "string" ? JSON.parse(prices) : null;

  // Accordion state
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpanded(expanded === section ? null : section);
  };

  const handleConfirm = () => {
    Alert.alert("Confirmed", `You selected ${name}`);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: name ? String(name) : "Laundry Shop",
          headerStyle: { backgroundColor: "#89CFF0" },
          headerTintColor: "#000",
        }}
      />

      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.container}>
          
          {/* Shop Image */}
          <Image source={image} style={styles.image} />

          {/* Name + Rating */}
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.info}>{distance} • ⭐ {rating}</Text>

          {/* Availability */}
          <Text style={[
            styles.availability, 
            availability === "Available" ? styles.available : styles.unavailable
          ]}>
            {availability}
          </Text>

          {/* Price List */}
          <Text style={styles.sectionTitle}>Price List</Text>
          {parsedPrices ? (
            <View style={{ width: "100%" }}>
              {Object.entries(parsedPrices).map(([category, items]) => (
                <View key={category} style={styles.accordionSection}>
                  <TouchableOpacity 
                    style={styles.accordionHeader}
                    onPress={() => toggleSection(category)}
                  >
                    <Text style={styles.accordionTitle}>
                      {formatCategoryName(category)}
                    </Text>
                    <Ionicons 
                      name={expanded === category ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color="#333" 
                    />
                  </TouchableOpacity>
                  
                  {expanded === category && (
                    <View style={styles.accordionContent}>
                      {Array.isArray(items) && items.map((p: string, i: number) => (
                        <Text key={i} style={styles.description}>• {p}</Text>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.description}>No price list available</Text>
          )}

          {/* Description */}
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.description}>{addDescription}</Text>

          {/* Contact Info */}
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text style={styles.infoText}>📍 {address}</Text>
          <Text style={styles.infoText}>📞 {contact}</Text>
          <Text style={styles.infoText}>⏰ {hours}</Text>
        </ScrollView>

        {/* Confirm Button */}
        <Link href="/(tabs)/homepage/avail_services" asChild>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmText}>Confirm</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}

// Helper to format category names
function formatCategoryName(key: string) {
  switch (key) {
    case "washFold": return "Wash & Fold";
    case "washPress": return "Wash & Press";
    case "pressOnly": return "Press Only";
    case "washDry": return "Wash & Dry";
    case "fullService": return "Full Service";
    default: return key;
  }
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#f6f6f6" },
  container: { alignItems: "center", padding: 20, paddingBottom: 100 },
  image: { width: 200, height: 200, borderRadius: 12, marginBottom: 15 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center" },
  info: { fontSize: 16, color: "#555", marginTop: 5 },
  availability: { fontSize: 16, marginTop: 8, fontWeight: "600" },
  available: { color: "green" },
  unavailable: { color: "red" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20, marginBottom: 5, alignSelf: "flex-start" },
  description: { fontSize: 14, color: "#444", lineHeight: 20, marginBottom: 10, textAlign: "justify" },
  infoText: { fontSize: 14, color: "#333", marginBottom: 4, alignSelf: "flex-start" },
  accordionSection: { marginBottom: 10, backgroundColor: "#fff", borderRadius: 8, padding: 10, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  accordionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  accordionTitle: { fontSize: 16, fontWeight: "600", color: "#000" },
  accordionContent: { marginTop: 8, paddingLeft: 10 },
  confirmButton: { position: "absolute", bottom: 20, left: 20, right: 20, backgroundColor: "#0D47A1", paddingVertical: 14, borderRadius: 20, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  confirmText: { fontSize: 18, fontWeight: "bold", color: "#fff" },
});

