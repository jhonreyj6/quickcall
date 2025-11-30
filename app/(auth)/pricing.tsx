import { FontAwesome6 } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

const Pricing = () => {
  return (
    <ScrollView className="flex-1 mb-8">
      <View className="flex-col gap-4">
        <View className="rounded-xl bg-secondary p-6">
          <Text className="text-2xl text-white mb-2 text-center">Free</Text>
          <Text className="text-center text-gray-500 mb-6">With ads and limited free call</Text>
          <View className="flex-row justify-center items-center gap-2 mb-8">
            <Text className="text-3xl text-center text-white">$1.00</Text>
          </View>
          <Pressable className=" bg-primary border-0 py-3 px-6 rounded-xl mb-12">
            <Text className="text-white text-lg text-center">Default</Text>
          </Pressable>
          <View className="flex-col gap-2">
            <View className="flex-row gap-8 items-center">
              <FontAwesome6 name="check" size={16} color="green" />
              <Text className="text-white">Up to 50 Countries</Text>
            </View>
            <View className="flex-row gap-8 items-center">
              <FontAwesome6 name="check" size={16} color="green" />
              <Text className="text-white">HD Voice Quality</Text>
            </View>
          </View>
        </View>
        <View className="rounded-xl bg-secondary p-6">
          <Text className="text-2xl text-white mb-2 text-center">Starter</Text>
          <Text className="text-center text-gray-500 mb-6">With ads and limited free call</Text>
          <View className="flex-row justify-center items-center gap-2 mb-8">
            <Text className="text-3xl text-center text-white">$10.00</Text>
          </View>
          <Link
            href={"/payment/checkout?plan=starter"}
            className="text-center text-white bg-blue-500 border-0 py-3 px-6 rounded-xl text-lg mb-12"
          >
            Buy now
          </Link>
          <View className="flex-col gap-2">
            <View className="flex-row gap-8 items-center">
              <FontAwesome6 name="check" size={16} color="green" />
              <Text className="text-white">Up to 50 Countries</Text>
            </View>
            <View className="flex-row gap-8 items-center">
              <FontAwesome6 name="check" size={16} color="green" />
              <Text className="text-white">HD Voice Quality</Text>
            </View>
          </View>
        </View>
        <View className="rounded-xl bg-secondary p-6 mb-4">
          <Text className="text-2xl text-white mb-2 text-center">Advance</Text>
          <Text className="text-center text-gray-500 mb-6">With ads and limited free call</Text>
          <View className="flex-row justify-center items-center gap-2 mb-8">
            <Text className="text-3xl text-center text-white">$20.00</Text>
          </View>
          <Link
            href={"/payment/checkout?plan=advance"}
            className="text-center text-white bg-primary border-0 py-3 px-6 rounded-xl text-lg mb-12"
          >
            Buy now
          </Link>
          <View className="flex-col gap-2">
            <View className="flex-row gap-8 items-center">
              <FontAwesome6 name="check" size={16} color="green" />
              <Text className="text-white">Up to 50 Countries</Text>
            </View>
            <View className="flex-row gap-8 items-center">
              <FontAwesome6 name="check" size={16} color="green" />
              <Text className="text-white">HD Voice Quality</Text>
            </View>
          </View>
        </View>

        <View className="items-center">
          <Text className="text-gray-500">Need a custom plan?</Text>
          <Link href={"/"}>
            <Text className="text-blue-500 text-lg">Contact our sales team.</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default Pricing;
