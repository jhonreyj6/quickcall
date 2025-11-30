import { StripeProvider } from "@stripe/stripe-react-native";
import { Stack } from "expo-router";
import { View } from "react-native";
import "../global.css";

export default function RootLayout() {
  return (
    <>
      <StripeProvider publishableKey={process.env.STRIPE_PUBLISHABLE_KEY}>
        <View className="flex-1">
          <View className="fixed left-0 top-0 -z-10 h-full w-full pt-12">
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "#020617",
              }}
            />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: {
                  backgroundColor: "#020617",
                  backgroundImage:
                    "radial-gradient(circle farthest-side, rgba(255, 0, 182, .15), hsla(0, 0%, 100%, 0))",
                  // backgroundSize: "2px 11px",
                  flex: 1,
                },
              }}
            ></Stack>
          </View>
        </View>
      </StripeProvider>
    </>
  );
}
