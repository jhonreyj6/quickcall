import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const Ongoing = () => {
  const endCall = async () => {
    router.push("/dialer");
  };

  return (
    <View className="flex-1 justify-center items-center pt-20 px-8">
      <View className="flex-1 items-center gap-2">
        <Text className="text-white text-3xl">ATG</Text>
        <Text className="text-gray-500 text-xl">+63 994 2181 994</Text>
        <Text className="text-emerald-500 text-lg">Calling...</Text>
      </View>

      <View className="mt-auto">
        <View className="w-full flex-row items-center justify-between mb-8">
          <View className="w-1/3 h-full items-center gap-2 bg-secondary rounded-l-lg p-4">
            <FontAwesome6 name="volume-high" size={16} color="white" />
            <Text className="text-gray-500 text-xs">Speaker</Text>
          </View>
          <TouchableOpacity onPress={endCall} className="w-1/3 h-full items-center gap-2 bg-red-500 p-4">
            <FontAwesome6 name="phone" size={16} color="white" />
            <Text className="text-white text-xs">End Call</Text>
          </TouchableOpacity>
          <View className="w-1/3 h-full items-center gap-2 bg-secondary rounded-r-lg p-4">
            <FontAwesome6 name="microphone-lines-slash" size={16} color="white" />
            <Text className="text-white text-xs">Mute</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Ongoing;
