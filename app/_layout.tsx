import { Stack } from "expo-router";
import { View } from "react-native";
import "../global.css";

export default function RootLayout() {
  return (
    <>
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: "#020617",
            },
          }}
        >
          <Stack.Screen options={{ headerShown: false }} />
        </Stack>
      </View>
    </>
  );
}
