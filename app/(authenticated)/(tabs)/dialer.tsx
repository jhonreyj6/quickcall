import ContactInfoCard from "@/components/ContactInfoCard";
import NoData from "@/components/NoData";
import useAuthStore from "@/stores/authStore";
import { ApiRequest } from "@/utils/ApiRequest";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { FlatList, Modal, Pressable, ScrollView, Text, View } from "react-native";

const Dialer = () => {
  const [formDial, setFormDial] = useState<string | null>(null);
  const [recentCalls, setRecentCalls] = useState({ data: [] });

  // Refs for controlling continuous delete + acceleration
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accelRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const speedRef = useRef<number>(500); // current delay in ms
  const isPressedRef = useRef<boolean>(false);
  const scrollRef = useRef<ScrollView | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const auth = useAuthStore((state) => state);

  const [sound, setSound] = useState();

  const getRecent = async () => {
    const res = await ApiRequest({
      pathname: "/recent",
      token: auth.access_token,
    });

    if (res.ok) {
      setRecentCalls(res.data);
    }
  };

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("@/assets/music/buttons/button.mp3") // put sound in your assets folder
    );
    setSound(sound);
    await sound.playAsync();
  }

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

  function countByCallType(data, callType) {
    return data.filter((item) => item.call_type === callType).length;
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

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

  useEffect(() => {
    getRecent();
  }, []);

  return (
    <>
      <View className="flex-1 mx-4">
        <Text className="text-white mb-3 text-2xl">Recent Calls</Text>
        <View className="flex-row gap-4 items-center mb-8">
          <View className="p-4 border bg-sky-950 flex-1 rounded-lg">
            <Text className="text-lg text-emerald-500">{countByCallType(recentCalls.data, 2)}</Text>
            <Text className="text-gray-500">Outgoing</Text>
          </View>
          <View className="p-4 border bg-sky-950 flex-1 rounded-lg">
            <Text className="text-blue-500 text-lg">{countByCallType(recentCalls.data, 1)}</Text>
            <Text className="text-gray-500">Incoming</Text>
          </View>
          <View className="p-4 border bg-sky-950 flex-1 rounded-lg">
            <Text className="text-danger text-lg">{countByCallType(recentCalls.data, 0)}</Text>
            <Text className="text-gray-500">Missed</Text>
          </View>
        </View>

        <FlatList
          data={recentCalls.data}
          keyExtractor={(item, index) => index.toString()} // ideally use a unique ID if available
          renderItem={({ item }) => <ContactInfoCard caller={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32, flexDirection: "column", gap: 16 }} // pb-8 -> 32px, gap-4 -> 16px
          ListEmptyComponent={() => <NoData center />}
        />

        {modalVisible === false && (
          <Pressable
            className="absolute bottom-10 right-0 z-50 p-4 rounded-lg bg-secondary"
            onPress={() => setModalVisible(true)}
          >
            <FontAwesome6 name="minimize" size={32} color="white" />
          </Pressable>
        )}
      </View>

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="px-4 flex-1 bg-primary">
          {/* <ScrollView contentContainerClassName="gap-2 flex-col" showsVerticalScrollIndicator={false}>
            {recentCalls.data.length &&
              recentCalls.data.map((caller, index) => {
                return <ContactInfoCard key={index} caller={caller} />;
              })}
          </ScrollView> */}

          <FlatList
            data={recentCalls.data} // your array
            keyExtractor={(item, index) => index.toString()} // ideally use a unique id if available
            renderItem={({ item }) => <ContactInfoCard caller={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, flexDirection: "column", paddingVertical: 8 }} // replace Tailwind gap-2
            ListEmptyComponent={() => (
              <View>
                <Text>No recent calls</Text>
              </View>
            )}
          />

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
              <Pressable className="absolute right-8" onPressIn={handlePressIn} onPressOut={handlePressOut}>
                <FontAwesome6 name="rectangle-xmark" size={32} color="white" />
              </Pressable>
            </View>
            <View className="flex-col gap-4">
              <View className="flex-row gap-4">
                <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
                  <Pressable
                    className="w-full py-4"
                    onPress={(e) => {
                      setDigit("1");
                      playSound();
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
                      playSound();
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
                      playSound();
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
                      playSound();
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
                      playSound();
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
                      playSound();
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
                      playSound();
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
                      playSound();
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
                      playSound();
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
                      playSound();
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
                      playSound();
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
                      playSound();
                    }}
                  >
                    <Text className="text-white text-center text-4xl">#</Text>
                  </Pressable>
                </View>
              </View>
              <View className="flex-row gap-4">
                <View className="w-24 items-center justify-center bg-sky-950 rounded-xl">
                  <Pressable
                    className="w-full py-4"
                    onPress={(e) => {
                      setDigit("+");
                      playSound();
                    }}
                  >
                    <Text className="text-white text-center text-4xl">+</Text>
                  </Pressable>
                </View>

                <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
                  <Pressable
                    className="w-full py-4"
                    onPress={(e) => {
                      setDigit("*");
                      playSound();
                    }}
                  >
                    <FontAwesome6 name="phone" size={32} className="text-center !text-emerald-500" />
                  </Pressable>
                </View>
                <View className="w-24 items-center justify-center bg-sky-950 rounded-xl">
                  <Pressable
                    className="w-full py-4"
                    onPress={(e) => {
                      setModalVisible(false);
                    }}
                  >
                    <FontAwesome6 name="minimize" size={32} color="white" className="text-center" />
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
