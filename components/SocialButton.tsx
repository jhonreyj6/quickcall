import { FontAwesome } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

const SocialButton = () => {
  return (
    <View>
      <TouchableOpacity className="bg-blue-500 px-5 py-3 rounded-xl flex-row gap-4 items-center mb-2">
        <FontAwesome name="facebook-square" size={24} color="white" className="" />
        <Text className="text-white text-lg font-bold">Facebook</Text>
      </TouchableOpacity>
      <TouchableOpacity className="bg-red-500 px-5 py-3 rounded-xl flex-row gap-4 items-center mb-2">
        <FontAwesome name="google" size={24} color="white" className="" />
        <Text className="text-white text-lg font-bold">Google</Text>
      </TouchableOpacity>
      <TouchableOpacity className="bg-black px-5 py-3 rounded-xl flex-row gap-4 items-center mb-2">
        <FontAwesome name="twitter-square" size={24} color="white" className="" />
        <Text className="text-white text-lg font-bold">X-Twitter</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SocialButton;
