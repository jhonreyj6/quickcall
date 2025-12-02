import useAuthStore from "@/stores/authStore";
import { apiRequest } from "@/utils/apiRequest";
import { useStripe } from "@stripe/stripe-react-native";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

const Checkout = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const client_secret = useRef<string>(null);
  const payment_intent_id = useRef<string>(null);

  const auth = useAuthStore((state) => state);

  const fetchPaymentIntent = async () => {
    try {
      const res = await apiRequest({
        method: "POST",
        pathname: "/payment/stripe/intent",
        token: auth.access_token,
      });

      if (res.ok) {
        client_secret.current = res.data.client_secret;
        payment_intent_id.current = res.data.payment_intent_id;
        console.log("after set: " + payment_intent_id.current);
      } else {
        alert("Failed to fetch client secret");
      }

      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: client_secret.current,
        merchantDisplayName: "QuickCall",
      });

      if (error) {
        Alert.alert("Error", error.message);
      }
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Payment failed: ${error.message}`);
    } else {
      const res = await apiRequest({
        method: "POST",
        pathname: "/payment/stripe/confirm",
        token: auth.access_token,
        body: {
          payment_intent_id: payment_intent_id.current,
        },
      });

      if (res.ok) {
        console.log("Payment confirmed on backend");
        payment_intent_id.current = null;
        client_secret.current = null;
        auth.updateUser(res.data.user);
        router.replace("/payment/confirm");
      } else {
        alert("Failed to confirm payment on backend");
      }
    }
  };

  useEffect(() => {
    if (payment_intent_id.current == null) fetchPaymentIntent();
  }, [payment_intent_id]);

  return (
    <View className="py-4 px-8">
      <View className="bg-secondary rounded-lg p-6">
        <Text className="text-white text-xl font-semibold mb-4">Complete your purchase</Text>

        <View className="flex-row justify-between gap-4 items-center border-b pb-4 border-gray-500 mb-4">
          <View className="flex-col">
            <Text className="text-white">Package:</Text>
            <Text className="text-white text-lg font-semibold">Starter Pack</Text>
          </View>
          <Text className="text-white text-2xl">$10</Text>
        </View>

        <View className="flex-row justify-between gap-4 items-center border-b pb-4 border-gray-500 mb-4">
          <Text className="text-white text-lg font-semibold">Tax:</Text>
          <Text className="text-white text-lg">$0</Text>
        </View>

        <View className="flex-row justify-between gap-4 items-center">
          <Text className="text-white text-lg font-semibold">Total:</Text>
          <Text className="text-white text-lg">$10</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={openPaymentSheet}
        disabled={!client_secret}
        className="text-white bg-blue-500 border-0 py-4 px-6 rounded-lg text-lg w-full mt-6"
      >
        <Text className="text-center text-white">Checkout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Checkout;
