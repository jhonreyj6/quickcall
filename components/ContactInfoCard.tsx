import { Text, View } from "react-native";

const ContactInfoCard = () => {
  return (
    <View className="flex-row gap-2 items-center">
      <View className="w-14 rounded-full h-14 bg-purple-500 items-center justify-center">
        <Text className="text-4xl">S</Text>
      </View>

      <View className="flex-col">
        <Text className="text-white text-xl">Sarah Geronimo</Text>
        <Text className="text-gray-500">+01 325 2485 239</Text>
      </View>

      <Text className="text-gray-500 ml-auto">5 hours ago</Text>
    </View>
  );
};

export default ContactInfoCard;
