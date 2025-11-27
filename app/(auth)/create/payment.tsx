import useAuthStore from "@/stores/authStore";
import { apiRequest } from "@/utils/apiRequest";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

const CreatePayment = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  // const [clientSecret, setClientSecret] = useState(null);
  const [stripeData, setStripeData] = useState({
    client_secret: null,
    payment_intent_id: "",
  });
  const auth = useAuthStore((state) => state);

  const fetchPaymentIntent = async () => {
    try {
      const res = await apiRequest({
        method: "POST",
        pathname: "/payment/stripe/intent",
        token: auth.access_token,
      });

      if (res.ok) {
        setStripeData((prevState) => ({
          ...prevState,
          client_secret: res.data.clientSecret,
        }));
        console.log("Client Secret:", res.data.clientSecret);
      } else {
        alert("Failed to fetch client secret");
      }

      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: stripeData.client_secret,
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
        pathname: "/payment/stripe/payment/confirm",
        token: auth.access_token,
        body: {
          client_secret: stripeData.client_secret,
        },
      });

      if (res.ok) {
        console.log("Payment confirmed on backend");
      } else {
        alert("Failed to confirm payment on backend");
      }
    }
  };

  useEffect(() => {
    fetchPaymentIntent();
  }, []);

  return (
    <StripeProvider publishableKey="pk_test_51SY8w2RqVnoo6CTJyb7wdhfsqpqiVMjmTR3S8XUVSnSxOZ1gKWDzBXm5m7DoEI2HIiiUqdZyioSQJLqypGibbaXM00EnUanqfo">
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
          disabled={!stripeData.client_secret}
          className="text-white bg-blue-500 border-0 py-4 px-6 rounded-lg text-lg w-full mt-6"
        >
          <Text className="text-center text-white">Checkout</Text>
        </TouchableOpacity>
      </View>
    </StripeProvider>
  );
};

export default CreatePayment;
