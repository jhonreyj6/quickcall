// import { STRIPE_KEY } from "@env";
import { FontAwesome6 } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";

const MyPayment = () => {
  // console.log(STRIPE_KEY);

  return (
    <View className="flex-1 flex-col mb-4 px-4 gap-2">
      <View className="flex-row gap-4 rounded-xl bg-secondary p-6 items-center">
        <Image
          source={{
            uri: "https://platform.vox.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/13674554/Mastercard_logo.jpg?quality=90&strip=all&crop=0,16.666666666667,100,66.666666666667",
          }}
          className="h-16 w-16 rounded-full"
        />
        <View className="flex-col">
          <Text className="text-white text-2xl">MasterCard</Text>
          <Text className="text-gray-500 text-sm">**** **** **** 2334</Text>
        </View>

        <View className="ml-auto">
          <FontAwesome6 name="trash" className="" color="red" size={24} />
        </View>
      </View>
    </View>
  );
};

export default MyPayment;
