import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

const Dialer = () => {
  // store the dialed digits as a string so we can "join" digits (e.g. "12" + "3" -> "123")
  const [formDial, setFormDial] = useState<string | null>(null);

  const handleDigit = (digit: string) => {
    // if formDial is null or empty, set to the pressed digit, otherwise concatenate
    setFormDial((prev) => (prev && prev.length ? prev + digit : digit));
  };

  const removeDigit = () => {
    // if formDial is null or empty, set to the pressed digit, otherwise concatenate

    setFormDial((prev) => (prev && prev.length ? prev.slice(0, -1) : null));
  };

  return (
    <View className="flex-1 mx-4">
      <View className="flex-row border rounded-xl bg-sky-950 h-24 items-center justify-center mb-8">
        <TextInput
          className="w-full text-white text-2xl px-8 pe-20"
          placeholder="Type the number"
          placeholderTextColor={"#ffffff"}
        >
          {formDial}
        </TextInput>
        <Pressable className="absolute right-8" onPress={() => removeDigit()}>
          <Text>
            <FontAwesome6 name="rectangle-xmark" size={32} color="white" />
          </Text>
        </Pressable>
      </View>

      <View className="flex-col gap-4">
        <View className="flex-row gap-4">
          <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
            <Pressable
              className="w-full py-4"
              onPress={(e) => {
                handleDigit("1");
              }}
            >
              <Text className="text-white text-center text-4xl">1</Text>
            </Pressable>
          </View>
          <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
            <Pressable
              className="w-full py-4"
              onPress={(e) => {
                handleDigit("2");
              }}
            >
              <Text className="text-white text-center text-4xl">2</Text>
            </Pressable>
          </View>
          <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
            <Pressable
              className="w-full py-4"
              onPress={(e) => {
                handleDigit("3");
              }}
            >
              <Text className="text-white text-center text-4xl">3</Text>
            </Pressable>
          </View>
        </View>

        <View className="flex-row gap-4">
          <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
            <Pressable
              className="w-full py-4"
              onPress={(e) => {
                handleDigit("4");
              }}
            >
              <Text className="text-white text-center text-4xl">4</Text>
            </Pressable>
          </View>
          <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
            <Pressable
              className="w-full py-4"
              onPress={(e) => {
                handleDigit("5");
              }}
            >
              <Text className="text-white text-center text-4xl">5</Text>
            </Pressable>
          </View>
          <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
            <Pressable
              className="w-full py-4"
              onPress={(e) => {
                handleDigit("6");
              }}
            >
              <Text className="text-white text-center text-4xl">6</Text>
            </Pressable>
          </View>
        </View>

        <View className="flex-row gap-4">
          <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
            <Pressable
              className="w-full py-4"
              onPress={(e) => {
                handleDigit("7");
              }}
            >
              <Text className="text-white text-center text-4xl">7</Text>
            </Pressable>
          </View>
          <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
            <Pressable
              className="w-full py-4"
              onPress={(e) => {
                handleDigit("8");
              }}
            >
              <Text className="text-white text-center text-4xl">8</Text>
            </Pressable>
          </View>
          <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
            <Pressable
              className="w-full py-4"
              onPress={(e) => {
                handleDigit("9");
              }}
            >
              <Text className="text-white text-center text-4xl">9</Text>
            </Pressable>
          </View>
        </View>

        <View className="flex-row gap-4">
          <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
            <Pressable
              className="w-full py-4"
              onPress={(e) => {
                handleDigit("*");
              }}
            >
              <Text className="text-white text-center text-4xl">*</Text>
            </Pressable>
          </View>
          <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
            <Pressable
              className="w-full py-4"
              onPress={(e) => {
                handleDigit("0");
              }}
            >
              <Text className="text-white text-center text-4xl">0</Text>
            </Pressable>
          </View>
          <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
            <Pressable
              className="w-full py-4"
              onPress={(e) => {
                handleDigit("#");
              }}
            >
              <Text className="text-white text-center text-4xl">#</Text>
            </Pressable>
          </View>
        </View>

        <View className="flex-row gap-4">
          <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
            <Pressable
              className="w-full py-4"
              onPress={(e) => {
                handleDigit("*");
              }}
            >
              <Text className="text-emerald-500 text-center text-4xl">
                <FontAwesome6 name="phone" size={32} />
              </Text>
            </Pressable>
          </View>
          <View className="w-24 items-center justify-center bg-sky-950 rounded-xl">
            <Pressable
              className="w-full py-4"
              onPress={(e) => {
                handleDigit("0");
              }}
            >
              <Text className="text-center text-4xl">
                <FontAwesome6 name="minimize" size={32} color="white" />
              </Text>
            </Pressable>
          </View>
        </View>

        {/* <View className="w-40 mx-auto items-center justify-center bg-emerald-500 rounded-full">
          <Pressable
            className="w-full py-4"
            onPress={(e) => {
              handleDigit("*");
            }}
          >
            <Text className="text-white text-center text-4xl">
              <FontAwesome6 name="phone" size={32} />
            </Text>
          </Pressable>
        </View> */}
      </View>
    </View>
  );
};

export default Dialer;
