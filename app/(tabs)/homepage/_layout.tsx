import { Stack } from "expo-router";

export default function HomeStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Home main screen */}
      <Stack.Screen name="homepage" />
      {/* Search screen within the Home tab */}
      <Stack.Screen name="search_laundry" />
    </Stack>
  );
}