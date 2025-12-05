import React from "react";
import { Text, View } from "react-native";

const NoData = ({ message = "No Data Found.", center = true }) => {
  return (
    <View className="mt-4">
      <Text className={`${center ? "text-center" : ""}` + " text-gray-500 text-xl"}>{message}</Text>
    </View>
  );
};

export default NoData;
