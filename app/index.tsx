import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Link } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import Swiper from "react-native-swiper";

export default function HomeScreen() {
  return (
    <Swiper
      loop={false}
      showsButtons={true}
      dotColor="rgba(255,255,255,0.5)"
      activeDotColor="#fff"
      paginationStyle={{ bottom: 20 }}
      buttonWrapperStyle={{
        backgroundColor: "transparent",
      }}
      className="flex-1"
    >
      <ScrollView className="p-12 flex-1" showsVerticalScrollIndicator={false}>
        <View className="border p-2 rounded-full bg-sky-950 mb-8">
          <Text className="text-blue-500 text-center">Truster by 10,000 Users Worldwide</Text>
        </View>
        <Text className="text-3xl font-bold text-white text-center">Connect Globally,</Text>
        <Text className="text-3xl text-center text-white mb-4">Communicate Seamlessly</Text>
        <Text className="text-white text-center mb-12">
          Experience crystal-clear international calls over the world. No hidden fees, no complicated setup. Just
          reliable communication when you need it the most.
        </Text>

        <View className="p-4 border rounded-xl bg-sky-950 mb-4">
          <FontAwesome6
            name="globe"
            size={24}
            color="white"
            className="p-2 border rounded-lg bg-emerald-500 w-12 text-center mb-4"
          />
          <Text className="text-white text-lg mb-2">200+ Countries</Text>
          <Text className="text-gray-400">Make calls to virtually anywhere in the world with our global network.</Text>
        </View>

        <View className="p-4 border rounded-xl bg-sky-950 mb-4">
          <FontAwesome6
            name="bolt"
            size={24}
            color="white"
            className="p-2 border rounded-lg bg-sky-500 w-12 text-center mb-4"
          />
          <Text className="text-white text-lg mb-2">HD Voice Quality</Text>
          <Text className="text-gray-400">
            With HD Voice Quality, your calls are clearer and more natural than ever before.
          </Text>
        </View>

        <View className="p-4 border rounded-xl bg-sky-950 mb-32">
          <FontAwesome6
            name="shield"
            size={24}
            color="white"
            className="p-2 border rounded-lg bg-blue-700 w-12 text-center mb-4"
          />
          <Text className="text-white text-lg mb-2">Secure and Private</Text>
          <Text className="text-gray-400">End to end encryption keeps all your conversation private.</Text>
        </View>
      </ScrollView>

      <ScrollView className="p-12 flex-1 mb-8" showsVerticalScrollIndicator={false}>
        <View className="p-4 border rounded-xl bg-sky-950 mb-4">
          <FontAwesome6
            name="dollar"
            size={24}
            color="white"
            className="p-2 border rounded-lg bg-emerald-500 w-12 text-center mb-4"
          />
          <Text className="text-white text-lg mb-2">Affordable Rates</Text>
          <Text className="text-gray-400">
            Enjoy competitive international calling rates without any hidden fees or surprise charges.
          </Text>
        </View>

        <View className="p-4 border rounded-xl bg-sky-950 mb-4">
          <FontAwesome6
            name="clock-o"
            size={24}
            color="white"
            className="p-2 border rounded-lg bg-sky-500 w-12 text-center mb-4"
          />
          <Text className="text-white text-lg mb-2">24/7 Availability</Text>
          <Text className="text-gray-400">
            Call anytime, anywhere with our reliable global network that never sleeps.
          </Text>
        </View>

        <View className="p-4 border rounded-xl bg-sky-950 mb-4">
          <FontAwesome6
            name="headphones"
            size={24}
            color="white"
            className="p-2 border rounded-lg bg-blue-700 w-12 text-center mb-4"
          />
          <Text className="text-white text-lg mb-2">Multi-Platform</Text>
          <Text className="text-gray-400">
            Access our services on any device, whether it is your smartphone, tablet, or computer.
          </Text>
        </View>

        <View className="p-4 border rounded-xl bg-sky-950 mb-20">
          <FontAwesome6
            name="headphones"
            size={24}
            color="white"
            className="p-2 border rounded-lg bg-blue-700 w-12 text-center mb-4"
          />
          <Text className="text-white text-lg mb-2">Customer Support</Text>
          <Text className="text-gray-400">
            Get help whenever you need it with our dedicated 24/7 customer support team
          </Text>
        </View>
      </ScrollView>

      <ScrollView className="p-12 flex-1 mb-14" showsVerticalScrollIndicator={false}>
        <Text className="text-white text-3xl text-center mb-4">Simple, Cheap, Transparent Pricing</Text>
        <Text className="mb-6 text-gray-300 text-center">
          Select from a range of credit packages designed to match your goals and budget. Earn more, save more, and
          unlock exclusive rewards with Ads.
        </Text>

        <View className="px-4 py-8 border bg-sky-950 rounded-lg mb-4">
          <View className="flex-row gap-4 items-center">
            <View className="flex-col">
              <Text className="font-semibold text-lg text-blue-500">Trial Pack</Text>
              <Text className="text-xl text-white">10 Free Credit</Text>
            </View>
            <View className="rounded-full p-2 border bg-gray-500 ml-auto border-gray-300">
              <Text className="text-white">With ADS</Text>
            </View>
          </View>
        </View>

        <View className="px-4 py-8 border bg-sky-950 rounded-lg mb-4">
          <View className="flex-row gap-4 items-center">
            <View className="flex-col">
              <Text className="font-semibold text-lg text-blue-500">Starter Pack</Text>
              <Text className="text-xl text-white">$10 / 100 Credit</Text>
            </View>
            <View className="rounded-full p-2 border bg-blue-500 ml-auto border-blue-300">
              <Text className="text-white">Save 5%</Text>
            </View>
          </View>
        </View>

        <View className="px-4 py-8 border bg-sky-950 rounded-lg mb-4">
          <View className="flex-row gap-4 items-center">
            <View className="flex-col">
              <Text className="font-semibold text-lg text-blue-500">Advanced Pack</Text>
              <Text className="text-xl text-white">$20 / 220 Credit</Text>
            </View>
            <View className="rounded-full p-2 border bg-blue-500 ml-auto border-blue-300">
              <Text className="text-white">Save 10%</Text>
            </View>
          </View>
        </View>

        {/* <View className="px-4 py-8 border bg-sky-950 rounded-lg mb-4">
          <View className="flex-row gap-4 items-center">
            <View className="flex-col">
              <Text className="font-semibold text-blue-500">Premium Pack</Text>
              <Text className="text-xl text-white">$50 / 550 Credit</Text>
            </View>
            <View className="rounded-full p-2 border bg-blue-500 ml-auto border-blue-300">
              <Text className="text-white">Save 25%</Text>
            </View>
          </View>
        </View> */}

        <View className="flex flex-col gap-4 mt-8">
          <Link href={"/login"} className="bg-blue-500 text-white text-xl rounded-xl py-3 text-center">
            Login
          </Link>
          <Link href={"/register"} className="bg-blue-500 text-white text-xl rounded-xl py-3 text-center">
            Register
          </Link>
          <Link href={"/dialer"} className="bg-blue-500 text-white text-xl rounded-xl py-3 text-center mb-24">
            Dialer
          </Link>
        </View>
      </ScrollView>
    </Swiper>
  );
}
