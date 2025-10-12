import { Stack } from "expo-router";

export default function PaymentStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="payment" options={{ headerShown: false}}/> 

    </Stack>
  );
}