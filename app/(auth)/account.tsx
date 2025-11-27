import useAuthStore from "@/stores/authStore";
import { apiRequest } from "@/utils/apiRequest";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";

import { Image, Pressable, ScrollView, Text, View } from "react-native";

const Account = () => {
  const auth = useAuthStore((state) => state);

  const logout = async () => {
    const res = await apiRequest({
      method: "POST",
      pathname: "/auth/logout",
      token: auth.access_token,
    });

    if (res.ok) {
      auth.logout();
      router.replace("/login");
    } else {
      alert("Failed to logout");
    }
  };

  return (
    <View className="px-2 flex-1">
      <View className="p-6 rounded-lg bg-secondary mb-6">
        <View className="flex-row gap-4 items-start">
          <View>
            <Image
              source={{
                uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMTGH7KoSi1xSVkjUASStO7MRD36iwm6ATag&s",
              }}
              className="w-20 h-20 rounded-full"
            />
          </View>
          <View className="flex-col">
            <Text className="text-xl text-white">{auth.user.name}</Text>
            <Text className="text-gray-500 text-xs mb-1.5">{auth.user.email}</Text>
            <View className="flex-row gap-3 items-center">
              <FontAwesome6 name="dollar" color="yellowgreen" size={16} />
              <Text className="text-blue-500 text-lg mt-auto">10.00</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mb-4">
          <Text className="mb-2 text-gray-500">Account</Text>
          <View className="flex-col gap-2">
            <Pressable
              className="p-4 flex rounded-xl bg-secondary flex-row gap-4 items-center"
              onPress={() => {
                router.push("/profile");
              }}
            >
              <FontAwesome6 name="user" color="gray" size={16} className="bg-primary p-4 rounded-full" />
              <Text className="text-xl text-white">My Profile</Text>
              <FontAwesome6 name="angle-right" size={20} color="gray" className="ml-auto mr-4" />
            </Pressable>

            <Pressable
              className="p-4 flex rounded-xl bg-secondary flex-row gap-4 items-center"
              onPress={() => {
                router.push("/saved/payment");
              }}
            >
              <FontAwesome6 name="credit-card" color="gray" size={16} className="bg-primary p-4 rounded-full" />
              <Text className="text-xl text-white">My Payments</Text>
              <FontAwesome6 name="angle-right" size={20} color="gray" className="ml-auto mr-4" />
            </Pressable>
          </View>
        </View>
        <View className="mb-4">
          <Text className="mb-2 text-gray-500">Preferences</Text>
          <View className="flex-col gap-2">
            <Pressable
              className="p-4 flex rounded-xl bg-secondary flex-row gap-4 items-center"
              onPress={() => {
                router.push("/notification");
              }}
            >
              <FontAwesome6 name="circle-exclamation" color="gray" size={16} className="bg-primary p-4 rounded-full" />
              <Text className="text-xl text-white">Notification & Ads</Text>
              <FontAwesome6 name="angle-right" size={20} color="gray" className="ml-auto mr-4" />
            </Pressable>
          </View>
        </View>

        <View className="mb-4">
          <Text className="mb-2 text-gray-500">Others</Text>

          <Pressable
            className="p-4 flex rounded-xl bg-secondary flex-row gap-4 items-center"
            onPress={() => {
              router.push("/pricing");
            }}
          >
            <FontAwesome6 name="dollar" color="gray" size={16} className="bg-primary p-4 px-5 rounded-full" />
            <Text className="text-xl text-white">Buy Credits</Text>
            <FontAwesome6 name="angle-right" size={20} color="gray" className="ml-auto mr-4" />
          </Pressable>
        </View>

        <View className="border-t border-secondary pt-8 mt-4 mb-8">
          <Pressable className="bg-secondary text-xl rounded-xl py-4" onPress={() => logout()}>
            <Text className="text-center text-white text-xl">Logout</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default Account;
