import { Stack } from "expo-router";

export default function MessageStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="message" options={{ headerShown: false}}/> 

    </Stack>
  );
}