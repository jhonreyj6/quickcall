import { Link } from "expo-router";
import { useState } from "react";
import { Switch, Text, View } from "react-native";

const Notification = () => {
  const [form, setForm] = useState({
    balance: false,
    promotion: false,
    ads: false,
  });

  const toggleSwitch = (param: string) => {
    if (param === "balance") {
      setForm((prevState) => ({
        ...prevState,
        balance: !prevState.balance,
      }));
    }

    if (param === "promotion") {
      setForm((prevState) => ({
        ...prevState,
        promotion: !prevState.promotion,
      }));
    }

    if (param === "ads") {
      setForm((prevState) => ({
        ...prevState,
        ads: !prevState.ads,
      }));
    }
  };

  return (
    <View className="flex-1 mb-4 flex-col gap-2 px-4">
      <View className="bg-secondary p-4 rounded-xl">
        <View className="flex-row gap-4 items-center">
          <View className="flex-col flex-1">
            <View className="flex-row gap-4 items-center">
              <Switch
                value={form.balance}
                onValueChange={() => {
                  toggleSwitch("balance");
                }}
              />
              <View className="flex-col">
                <Text className="text-white text-xl">Low Balance</Text>
                <Text className="text-gray-500">Notify if balance is below 5 credits.</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className="bg-secondary p-4 rounded-xl">
        <View className="flex-row gap-4 items-center">
          <View className="flex-col flex-1">
            <View className="flex-row gap-4 items-center">
              <Switch
                value={form.promotion}
                onValueChange={() => {
                  toggleSwitch("promotion");
                }}
              />
              <View className="flex-col">
                <Text className="text-white text-xl">Promotions</Text>
                <Text className="text-gray-500">Notify product promotions.</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View className="bg-secondary p-4 rounded-xl">
        <View className="flex-row gap-4 items-center">
          <View className="flex-col flex-1">
            <View className="flex-row gap-4 items-center">
              <Switch
                value={form.ads}
                onValueChange={() => {
                  toggleSwitch("ads");
                }}
              />
              <View className="flex-col">
                <Text className="text-white text-xl">Advertisement</Text>
                <Text className="text-gray-500">Earn credits through advertisement.</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <Link href={"/account"} className=" bg-blue-500 border-0 text-center p-4 rounded-xl text-lg mt-auto">
        <Text className="text-white">Go to Account</Text>
      </Link>
    </View>
  );
};

export default Notification;
