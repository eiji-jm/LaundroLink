import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LaundryDetails() {
  const router = useRouter();
  const { services } = useLocalSearchParams();

  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [addons, setAddons] = useState<string[]>([]);
  const [instructions, setInstructions] = useState("");

  const fabricTypes = [
    "Regular Clothes",
    "Blankets, bedsheets, towels, pillowcase",
    "Comforter",
  ];

  const addonOptions = [
    "Powder Detergent",
    "Liquid Detergent",
    "Stain Remover/Stain treatment",
    "Fabric Conditioner/Softener",
    "Dryer sheet",
  ];

  const toggleFabric = (fabric: string) => {
    setSelectedFabrics((prev) =>
      prev.includes(fabric) ? prev.filter((f) => f !== fabric) : [...prev, fabric]
    );
  };

  const toggleAddon = (addon: string) => {
    setAddons((prev) =>
      prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon]
    );
  };

  const handleConfirm = () => {
    if (selectedFabrics.length === 0) return;

    router.push({
      pathname: "/(tabs)/homepage/df_payment",
      params: {
        services: services,
        fabrics: JSON.stringify(selectedFabrics),
        addons: JSON.stringify(addons),
        instructions: instructions,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#89CFF0" },
          headerTitleAlign: "left",
          headerTintColor: "#2d2d2dff",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons
                name="arrow-back"
                size={24}
                color="#000"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
          headerTitle: () => (
            <Text style={styles.headerTitle}>Laundry Details</Text>
          ),
        }}
      />

      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Select Fabric Type(s)</Text>
        {fabricTypes.map((item, index) => (
          <Pressable
            key={index}
            style={[
              styles.optionRow,
              selectedFabrics.includes(item) && styles.selectedOption,
            ]}
            onPress={() => toggleFabric(item)}
          >
            <Ionicons
              name={ selectedFabrics.includes(item) ? "checkbox" : "square-outline" }
              size={20}
              color={selectedFabrics.includes(item) ? "#004aad" : "#0D47A1"}
            />
            <Text
              style={[
                styles.optionText,
                selectedFabrics.includes(item) && { fontWeight: "700", color: "#004aad" },
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}

        <Text style={styles.sectionTitle}>Add-ons</Text>
        {addonOptions.map((addon, index) => (
          <Pressable
            key={index}
            style={[
              styles.optionRow,
              addons.includes(addon) && styles.selectedOption,
            ]}
            onPress={() => toggleAddon(addon)}
          >
            <Ionicons
              name={addons.includes(addon) ? "checkbox" : "square-outline"}
              size={20}
              color={addons.includes(addon) ? "#004aad" : "#0D47A1"}
            />
            <Text
              style={[
                styles.optionText,
                addons.includes(addon) && { fontWeight: "700", color: "#004aad" },
              ]}
            >
              {addon}
            </Text>
          </Pressable>
        ))}

        <Text style={styles.sectionTitle}>Special Instructions</Text>
        <TextInput
          style={styles.input}
          placeholder="E.g., Wash separately, do not tumble dry..."
          value={instructions}
          onChangeText={setInstructions}
          multiline
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[ styles.confirmBtn, selectedFabrics.length === 0 && { backgroundColor: "#ccc" } ]}
          onPress={handleConfirm}
          disabled={selectedFabrics.length === 0}
        >
          <Text style={styles.confirmText}>Confirm Services</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  headerTitle: {
    color: "#2d2d2dff",
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
    padding: 8,
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: "#E3F2FD",
  },
  optionText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#2d2d2dff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    textAlignVertical: "top",
    minHeight: 60,
  },
  footer: {
    padding: 15,
    backgroundColor: "#fff",
  },
  confirmBtn: {
    backgroundColor: "#004aad",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});