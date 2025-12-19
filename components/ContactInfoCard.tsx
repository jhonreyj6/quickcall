import { limitText } from "@/utils/function";
import { FontAwesome6 } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type Param = {
  caller: {
    phone_number: number;
    name: string;
    called_at: string;
  };
  action?: () => void;
  actionCall?: () => void;
};

const ContactInfoCard = ({ caller, action, actionCall }: Param) => {
  const called_type_color = {
    0: "text-red-500",
    1: "text-blue-500",
    2: "text-emerald-500",
  };

  return (
    <View className="flex-row gap-4 items-center">
      <View className="flex-col">
        {caller.name && (
          <>
            <View className="flex-row items-baseline gap-2">
              <Text className="text-white text-lg">{limitText(caller?.name, 20)}</Text>
              {caller?.called_at && <Text className="text-gray-500 text-xs">{caller?.called_at}</Text>}
            </View>
            {caller?.called_at && (
              <Text className={called_type_color[caller.call_type] + " text-sm"}>{caller?.phone_number}</Text>
            )}
          </>
        )}

        {caller.name == null && (
          <View className="flex-row items-center gap-2">
            <Text className={called_type_color[caller.call_type] + " text-xl"}>{caller?.phone_number}</Text>
            <Text className="text-gray-500 text-xs">{caller?.called_at}</Text>
          </View>
        )}
      </View>

      <View className="flex-row gap-2 items-center ml-auto">
        <Pressable onPress={actionCall}>
          <FontAwesome6 name="phone" size={16} color="white" className="bg-emerald-500 p-3 rounded-full" />
        </Pressable>
        <Pressable onPress={(e) => action(e)}>
          <FontAwesome6 name="ellipsis" size={16} color="gray" className="p-3" />
        </Pressable>
      </View>
    </View>
  );
};

export default ContactInfoCard;
