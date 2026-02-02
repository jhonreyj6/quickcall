import ConfirmDialogue from "@/components/ConfirmDialogue";
import ContactInfoCard from "@/components/ContactInfoCard";
import NoData from "@/components/NoData";
import useAuthStore from "@/stores/authStore";
import useSelectedDataStore from "@/stores/selectedDataStore";
import { ApiRequest } from "@/utils/ApiRequest";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Audio } from "expo-av";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";

const Dialer = () => {
  const [formDial, setFormDial] = useState<string | null>(null);
  const [recentCalls, setRecentCalls] = useState({ data: [], current_page: 1, last_page: 1 });
  const selectedDataStore = useSelectedDataStore((state) => state);

  // Refs for controlling continuous delete + acceleration
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accelRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const speedRef = useRef<number>(500); // current delay in ms
  const isPressedRef = useRef<boolean>(false);
  const scrollRef = useRef<ScrollView | null>(null);
  const [dialerModalVisible, setDialerModalVisible] = useState(false);
  const auth = useAuthStore((state) => state);
  const [recentPaginate, setRecentPaginate] = useState({
    loading: false,
    page: 1,
  });
  const [pageState, setPageState] = useState(false);
  const [sound, setSound] = useState();
  const [confirmDialogue, setConfirmDialogue] = useState({
    title: null,
    message: null,
    state: false,
    action: () => {},
  });
  const [contactMenu, setContactMenu] = useState({
    visible: false,
    position: {
      x: 0,
      y: 0,
    },
  });

  const getRecent = async () => {
    if (recentPaginate.loading) return;

    setRecentPaginate((prevState) => ({
      ...prevState,
      loading: true,
    }));

    const res = await ApiRequest({
      pathname: "/recent",
      token: auth.access_token,
      params: {
        page: recentPaginate.page,
      },
    });

    if (res.ok) {
      setPageState(true);
      if (recentPaginate.page == 1) {
        setRecentCalls(res.data);
      } else {
        setRecentCalls((prevState) => ({
          ...prevState,
          data: [...prevState.data, ...res.data.data],
          last_page: res.data.last_page,
          current_page: res.data.current_page,
        }));
      }

      setRecentPaginate((prevState) => ({
        ...prevState,
        loading: res.data.last_page === res.data.current_page ? true : false,
        page: prevState.page + 1,
      }));
    } else {
      if (res.status === 401) {
        auth.logout();
        router.replace("/login");
      }
    }
  };

  const clearRecent = async () => {
    const res = await ApiRequest({
      method: "DELETE",
      pathname: "/recent",
      token: auth.access_token,
    });

    if (res.ok) {
      alert("Recent clear.");
      setRecentCalls({ data: [], current_page: 1, last_page: 1 });
    } else {
      alert("Failed to clear recent.");
    }
  };

  const deleteRecent = async () => {
    const res = await ApiRequest({
      method: "DELETE",
      pathname: "/recent/delete",
      body: {
        recent_id: selectedDataStore.data.id,
      },
      token: auth.access_token,
    });

    if (res.ok) {
      setRecentCalls((prevState) => ({
        ...prevState,
        data: prevState.data.filter((data) => {
          if (data.id != selectedDataStore.data.id) {
            return data;
          }
        }),
      }));
    } else {
      alert("Failed to delete recent.");
    }
  };

  const makeCall = async () => {
    router.push("/call/ongoing");
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
    playSound();
    setFormDial((prev) => (prev && prev.length ? prev.slice(0, -1) : null));
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
      speedRef.current = Math.max(50, speedRef.current - 500);
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

  const setDigit = async (digit: string) => {
    await playSound();
    await setFormDial((prev) => (prev && prev.length ? prev + digit : digit));
  };

  function countByCallType(data, callType) {
    return data.filter((item) => item.call_type === callType).length;
  }

  const getPos = (e, data) => {
    const { pageX, pageY, locationX, locationY } = e.nativeEvent;
    selectedDataStore.updateData(data);

    setContactMenu((prevState) => ({
      ...prevState,
      visible: true,
      position: {
        x: pageX - 100,
        y: pageY - 20,
      },
    }));
  };

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

  useFocusEffect(
    useCallback(() => {
      setRecentPaginate((prevState) => ({
        ...prevState,
        loading: false,
        page: 1,
      }));
      getRecent();

      return () => {};
    }, [])
  );

  let test = null;

  return (
    <>
      {pageState && (
        <View className="flex-1 mx-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-2xl">Recent Calls</Text>
            {recentCalls.data.length > 0 && (
              <Pressable
                className="flex-row items-center gap-2 bg-blue-500 py-1.5 px-4 rounded-lg"
                onPress={() => {
                  setConfirmDialogue((prevState) => ({
                    ...prevState,
                    state: true,
                    action: clearRecent,
                  }));
                }}
              >
                <FontAwesome6 name="trash" color="white" />
                <Text className="text-white">Clear All</Text>
              </Pressable>
            )}
          </View>
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
            renderItem={({ item }) => (
              <ContactInfoCard
                caller={item}
                action={(event) => {
                  getPos(event, item);
                }}
                actionCall={() => {
                  makeCall();
                }}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexDirection: "column", gap: 12 }} // pb-8 -> 32px, gap-4 -> 16px
            onEndReached={getRecent}
            onEndReachedThreshold={0.15}
            ListFooterComponent={recentCalls.current_page != recentCalls.last_page ? <ActivityIndicator /> : <NoData />}
          />

          {dialerModalVisible === false && (
            <Pressable
              className="absolute bottom-10 right-0 z-50 p-4 rounded-lg bg-secondary"
              onPress={() => setDialerModalVisible(true)}
            >
              <FontAwesome6 name="minimize" size={32} color="white" />
            </Pressable>
          )}
        </View>
      )}
      <Modal
        animationType="none"
        transparent={true}
        visible={dialerModalVisible}
        onRequestClose={() => setDialerModalVisible(false)}
      >
        <View className="px-4 flex-1 bg-primary">
          {/* <FlatList
            data={recentCalls.data} // your array
            keyExtractor={(item, index) => item.id} // ideally use a unique id if available
            renderItem={({ item }) => <ContactInfoCard caller={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, flexDirection: "column", paddingVertical: 8 }} // replace Tailwind gap-2
            ListEmptyComponent={() => (
              <View>
                <Text>No recent calls</Text>
              </View>
            )}
          /> */}

          <View className="py-4 mt-auto">
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
              <TouchableOpacity className="absolute right-8" onPressIn={handlePressIn} onPressOut={handlePressOut}>
                <FontAwesome6 name="rectangle-xmark" size={32} color="white" />
              </TouchableOpacity>
            </View>
            <View className="flex-col gap-4">
              <View className="flex-row gap-4">
                <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
                  <TouchableOpacity
                    className="w-full py-4"
                    onPress={(e) => {
                      setDigit("1");
                    }}
                  >
                    <Text className="text-white text-center text-4xl">1</Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
                  <TouchableOpacity
                    className="w-full py-4"
                    onPress={(e) => {
                      setDigit("2");
                    }}
                  >
                    <Text className="text-white text-center text-4xl">2</Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
                  <TouchableOpacity
                    className="w-full py-4"
                    onPress={(e) => {
                      setDigit("3");
                    }}
                  >
                    <Text className="text-white text-center text-4xl">3</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="flex-row gap-4">
                <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
                  <TouchableOpacity
                    className="w-full py-4"
                    onPress={(e) => {
                      setDigit("4");
                    }}
                  >
                    <Text className="text-white text-center text-4xl">4</Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
                  <TouchableOpacity
                    className="w-full py-4"
                    onPress={(e) => {
                      setDigit("5");
                    }}
                  >
                    <Text className="text-white text-center text-4xl">5</Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
                  <TouchableOpacity
                    className="w-full py-4"
                    onPress={(e) => {
                      setDigit("6");
                    }}
                  >
                    <Text className="text-white text-center text-4xl">6</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="flex-row gap-4">
                <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
                  <TouchableOpacity
                    className="w-full py-4"
                    onPress={(e) => {
                      setDigit("7");
                    }}
                  >
                    <Text className="text-white text-center text-4xl">7</Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
                  <TouchableOpacity
                    className="w-full py-4"
                    onPress={(e) => {
                      setDigit("8");
                    }}
                  >
                    <Text className="text-white text-center text-4xl">8</Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
                  <TouchableOpacity
                    className="w-full py-4"
                    onPress={(e) => {
                      setDigit("9");
                    }}
                  >
                    <Text className="text-white text-center text-4xl">9</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="flex-row gap-4">
                <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
                  <TouchableOpacity
                    className="w-full py-4"
                    onPress={(e) => {
                      setDigit("*");
                    }}
                  >
                    <Text className="text-white text-center text-4xl">*</Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
                  <TouchableOpacity
                    className="w-full py-4"
                    onPress={(e) => {
                      setDigit("0");
                    }}
                  >
                    <Text className="text-white text-center text-4xl">0</Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
                  <TouchableOpacity
                    className="w-full py-4"
                    onPress={(e) => {
                      setDigit("#");
                    }}
                  >
                    <Text className="text-white text-center text-4xl">#</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="flex-row gap-4">
                <View className="w-24 items-center justify-center bg-sky-950 rounded-xl">
                  <TouchableOpacity
                    className="w-full py-4"
                    onPress={(e) => {
                      setDigit("+");
                    }}
                  >
                    <Text className="text-white text-center text-4xl">+</Text>
                  </TouchableOpacity>
                </View>

                <View className="flex-1 items-center justify-center bg-sky-950 rounded-xl">
                  <TouchableOpacity
                    className="w-full py-4"
                    onPress={(e) => {
                      makeCall();
                    }}
                  >
                    <FontAwesome6 name="phone" size={32} className="text-center !text-emerald-500" />
                  </TouchableOpacity>
                </View>
                <View className="w-24 items-center justify-center bg-sky-950 rounded-xl">
                  <Pressable
                    className="w-full py-4"
                    onPress={(e) => {
                      setDialerModalVisible(false);
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

      <Modal
        animationType="none"
        transparent={true}
        visible={contactMenu.visible}
        onRequestClose={() =>
          setContactMenu((prevState) => ({
            ...prevState,
            visible: false,
          }))
        }
      >
        <Pressable
          className="flex-1 bg-transparent"
          onPress={() =>
            setContactMenu((prevState) => ({
              ...prevState,
              visible: false,
            }))
          }
        >
          <View
            className="bg-secondary w-32 absolute rounded-lg"
            style={{ left: contactMenu.position.x, top: contactMenu.position.y }}
          >
            {!selectedDataStore.data?.name && (
              <TouchableOpacity
                onPress={() => {
                  setContactMenu((prevState) => ({
                    ...prevState,
                    visible: false,
                  }));
                  router.push(`/contact/create`);
                }}
                className="py-2.5 px-4 border-b border-gray-500"
              >
                <Text className="text-white">Add Contact</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {}}
              className="py-2.5 px-4"
              onPressIn={() => {
                setContactMenu((prevState) => ({
                  ...prevState,
                  visible: false,
                }));
                setConfirmDialogue((prevState) => ({
                  ...prevState,
                  state: true,
                  message: "Are you going to delete this call?",
                  action: deleteRecent,
                }));
              }}
            >
              <Text className="text-white">Delete</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <ConfirmDialogue
        message={confirmDialogue.message}
        state={confirmDialogue.state}
        setState={() => {
          setConfirmDialogue((prevState) => ({
            ...prevState,
            state: false,
          }));
        }}
        action={confirmDialogue.action}
      />
    </>
  );
};

export default Dialer;
