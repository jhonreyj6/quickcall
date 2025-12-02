import { FontAwesome6 } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const ConfirmPayment = () => {
  return (
    <View className="mt-20 mx-8 border rounded-lg p-6 items-center justify-center">
      <FontAwesome6 name="check-circle" color="green" size={100} className="mb-6" />
      <Text className="text-emerald-500 text-5xl leading-tight text-center mb-8">Payment Confirm </Text>
      <Link
        href={"/dialer"}
        replace={false}
        className="inline-flex text-white bg-blue-500 border-0 py-4 px-16 rounded-lg text-lg"
      >
        Go Home
      </Link>
    </View>
  );
};

export default ConfirmPayment;
