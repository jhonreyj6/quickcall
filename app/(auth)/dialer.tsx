import ContactInfoCard from "@/components/ContactInfoCard";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useEffect, useRef, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

const Dialer = () => {
  const [formDial, setFormDial] = useState<string | null>(null);

  // Refs for controlling continuous delete + acceleration
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accelRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const speedRef = useRef<number>(500); // current delay in ms
  const isPressedRef = useRef<boolean>(false);
  const scrollRef = useRef<ScrollView | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current as any);
        intervalRef.current = null;
      }
      if (accelRef.current) {
        clearInterval(accelRef.current as any);
        accelRef.current = null;
      }
    };
  }, []);

  const handlePressIn = () => {
    // remove one digit immediately
    removeDigit();
    isPressedRef.current = true;
    // reset speed
    speedRef.current = 300;

    // recursive timeout-based deletion so we can adjust delay dynamically
    const runDelete = () => {
      intervalRef.current = setTimeout(() => {
        setFormDial((prev) => (prev && prev.length ? prev.slice(0, -1) : null));
        if (isPressedRef.current) {
          runDelete();
        }
      }, speedRef.current);
    };

    runDelete();

    // every 500ms while pressed, decrease delay by 100ms until min 100ms
    accelRef.current = setInterval(() => {
      speedRef.current = Math.max(100, speedRef.current - 100);
    }, 100);
  };

  const handlePressOut = () => {
    // Stop continuous removal and acceleration
    isPressedRef.current = false;
    if (intervalRef.current) {
      clearTimeout(intervalRef.current as any);
      intervalRef.current = null;
    }
    if (accelRef.current) {
      clearInterval(accelRef.current as any);
      accelRef.current = null;
    }
  };

  const setDigit = (digit: string) => {
    setFormDial((prev) => (prev && prev.length ? prev + digit : digit));
  };

  const removeDigit = () => {
    setFormDial((prev) => (prev && prev.length ? prev.slice(0, -1) : null));
  };

  return (
    <>
      <View className="flex-1 mx-4">
        <Text>Recent Calls</Text>
        <View className="flex-row gap-4 items-center mb-8">
          <View className="p-4 border bg-sky-950 flex-1 rounded-lg">
            <Text className="text-lg text-emerald-500">24</Text>
            <Text className="text-gray-500">Outgoing</Text>
          </View>
          <View className="p-4 border bg-sky-950 flex-1 rounded-lg">
            <Text className="text-blue-500 text-lg">13</Text>
            <Text className="text-gray-500">Incoming</Text>
          </View>
          <View className="p-4 border bg-sky-950 flex-1 rounded-lg">
            <Text className="text-red-500 text-lg">8</Text>
            <Text className="text-gray-500">Missed</Text>
          </View>
        </View>

        <ScrollView contentContainerClassName="flex-col gap-4">
          {Array.from({ length: 12 }, (_, index) => (
            <ContactInfoCard key={index} />
          ))}
        </ScrollView>

        {modalVisible === false && (
          <Pressable
            className="absolute bottom-4 right-0 z-50 p-4 rounded-lg bg-secondary"
            onPress={() => setModalVisible(true)}
          >
            <Text className="text-2xl text-center text-white">
              <FontAwesome6 name="minimize" size={32} />
            </Text>
          </Pressable>
        )}
      </View>

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        className="flex-1 z-50"
      >
        <View className="bg-primary px-4 flex-1 pb-4">
          <ScrollView contentContainerClassName="gap-2 flex-col" showsVerticalScrollIndicator={false}>
            {Array.from({ length: 20 }, (_, index) => (
              <ContactInfoCard key={index} />
            ))}
          </ScrollView>
          <View className="py-4">
            <View className="flex-row border rounded-xl bg-sky-950 h-24 items-center justify-center mb-4">
              <View className="w-full px-8 pe-24">
                <ScrollView
                  horizontal
                  ref={scrollRef}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}
                  onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
                >
                  <Text style={{ color: "white", fontSize: 24 }}>{formDial ? formDial : "Type the number"}</Text>
                </ScrollView>
              </View>
              <Pressable
                className="absolute right-8"
                // onPress={() => removeDigit()}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
              >
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
                      setDigit("1");
                    }}
                  >
                    <Text className="text-white text-center text-4xl">1</Text>
                  </Pressable>
                </View>
                <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
                  <Pressable
                    className="w-full py-4"
                    onPress={(e) => {
                      setDigit("2");
                    }}
                  >
                    <Text className="text-white text-center text-4xl">2</Text>
                  </Pressable>
                </View>
                <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
                  <Pressable
                    className="w-full py-4"
                    onPress={(e) => {
                      setDigit("3");
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
                      setDigit("4");
                    }}
                  >
                    <Text className="text-white text-center text-4xl">4</Text>
                  </Pressable>
                </View>
                <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
                  <Pressable
                    className="w-full py-4"
                    onPress={(e) => {
                      setDigit("5");
                    }}
                  >
                    <Text className="text-white text-center text-4xl">5</Text>
                  </Pressable>
                </View>
                <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
                  <Pressable
                    className="w-full py-4"
                    onPress={(e) => {
                      setDigit("6");
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
                      setDigit("7");
                    }}
                  >
                    <Text className="text-white text-center text-4xl">7</Text>
                  </Pressable>
                </View>
                <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
                  <Pressable
                    className="w-full py-4"
                    onPress={(e) => {
                      setDigit("8");
                    }}
                  >
                    <Text className="text-white text-center text-4xl">8</Text>
                  </Pressable>
                </View>
                <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
                  <Pressable
                    className="w-full py-4"
                    onPress={(e) => {
                      setDigit("9");
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
                      setDigit("*");
                    }}
                  >
                    <Text className="text-white text-center text-4xl">*</Text>
                  </Pressable>
                </View>
                <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
                  <Pressable
                    className="w-full py-4"
                    onPress={(e) => {
                      setDigit("0");
                    }}
                  >
                    <Text className="text-white text-center text-4xl">0</Text>
                  </Pressable>
                </View>
                <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
                  <Pressable
                    className="w-full py-4"
                    onPress={(e) => {
                      setDigit("#");
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
                      setDigit("*");
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
                      setModalVisible(false);
                    }}
                  >
                    <Text className="text-center text-4xl">
                      <FontAwesome6 name="minimize" size={32} color="white" />
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Dialer;
