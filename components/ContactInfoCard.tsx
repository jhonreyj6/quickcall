import { getFirstLetter } from "@/utils/function";
import { FontAwesome6 } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

const ContactInfoCard = ({ caller }) => {
  return (
    <View className="flex-row gap-4 items-center">
      <View className="w-14 rounded-full h-14 bg-purple-500 items-center justify-center">
        <Text className="text-4xl">{getFirstLetter(caller?.name)}</Text>
      </View>

      <View className="flex-col">
        <View className="flex-row items-baseline gap-2">
          <Text className="text-white text-lg">{caller?.name}</Text>
          <Text className="text-gray-500 ml-auto text-xs">{caller?.called_at}</Text>
        </View>
        <Text className="text-gray-500 text-sm">{caller?.phone_number}</Text>
      </View>

      <View className="flex-row gap-2 items-center ml-auto">
        <Pressable>
          <FontAwesome6 name="phone" size={16} color="white" className="bg-emerald-500 p-3 rounded-full" />
        </Pressable>
        {/* <Pressable>
          <FontAwesome6 name="ellipsis" size={16} color="gray" className="p-3" />
        </Pressable> */}
      </View>
    </View>
  );
};

export default ContactInfoCard;
