import ConfirmDialogue from "@/components/ConfirmDialogue";
import ContactInfoCard from "@/components/ContactInfoCard";
import NoData from "@/components/NoData";
import useAuthStore from "@/stores/authStore";
import useSelectedDataStore from "@/stores/selectedDataStore";
import { ApiRequest } from "@/utils/ApiRequest";
import { FontAwesome6 } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import Checkbox from "expo-checkbox";
import * as Contacts from "expo-contacts";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Modal, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";

const Contact = () => {
  const [contacts, setContacts] = useState({ data: [], current_page: 1, last_page: 1 });
  const [searchQueryData, setSearchQueryData] = useState({ data: [] });
  const auth = useAuthStore((state) => state);
  const typingTimeout = useRef(null);
  const [formSearchQuery, setFormSearchQuery] = useState("");
  const selectedDataStore = useSelectedDataStore((state) => state);
  const [importedContacts, setImportedContacts] = useState({});
  const [showImportedContactDialogue, setShowImportedContactDialogue] = useState(false);
  const [selectedImportedContact, setSelectedImportedContact] = useState([]);
  const [contactPaginate, setContactPaginate] = useState({
    loading: false,
    page: 1,
  });
  const isFocus = useIsFocused();
  const [contactMenu, setContactMenu] = useState({
    visible: false,
    position: {
      x: 0,
      y: 0,
    },
  });
  const [confirmDialogue, setConfirmDialogue] = useState({
    title: null,
    message: null,
    state: false,
    action: () => {},
  });
  const [pageState, setPageState] = useState(false);

  const getContacts = async () => {
    if (contactPaginate.loading) return;

    setContactPaginate((prevState) => ({
      ...prevState,
      loading: true,
    }));

    console.log("getting contacts");

    const res = await ApiRequest({
      pathname: "/contact",
      token: auth.access_token,
      params: {
        page: contactPaginate.page,
      },
    });

    if (res.ok) {
      setPageState(true);
      if (contactPaginate.page == 1) {
        setContacts(res.data);
      } else {
        setContacts((prevState) => ({
          ...prevState,
          data: [...prevState.data, ...res.data.data],
          last_page: res.data.last_page,
          current_page: res.data.current_page,
        }));
      }

      setContactPaginate((prevState) => ({
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

  const searchContact = async () => {
    const res = await ApiRequest({
      pathname: "/contact/search",
      token: auth.access_token,
      params: { query: formSearchQuery },
    });

    if (res.ok) {
      setSearchQueryData(res.data);
    } else {
      if (res.status === 401) {
        auth.logout();
        router.replace("/login");
      }
    }
  };

  const getContactPermission = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        setImportedContacts(data.filter((item) => item.phoneNumbers && item.phoneNumbers.length > 0));
      }
    }
  };

  const createImportedContact = async () => {
    if (selectedImportedContact.length === 0) {
      alert("Select contact to import");
      return;
    }

    let body = importedContacts.filter((data) => {
      if (selectedImportedContact.includes(data.id)) {
        return data;
      }
    });

    const res = await ApiRequest({
      method: "POST",
      pathname: "/contact",
      token: auth.access_token,
      body: {
        data: body,
      },
    });

    if (res.ok) {
      setShowImportedContactDialogue(false);
      setSelectedImportedContact([]);
      console.log(res.data);

      setContacts((prevState) => ({
        ...prevState,
        data: [...prevState.data, ...res.data],
      }));
    } else {
      alert("Failed to import contact!");
    }
  };

  const deleteContact = async () => {
    const res = await ApiRequest({
      method: "DELETE",
      pathname: "/contact/delete",
      token: auth.access_token,
      body: {
        contact_id: selectedDataStore.data.id,
      },
    });

    if (res.ok) {
      setContacts((prevState) => ({
        ...prevState,
        data: prevState.data.filter((data) => {
          if (data.id !== selectedDataStore.data.id) {
            return data;
          }
        }),
      }));
    } else {
      console.log(res);

      alert("Failed to delete the contact.");
    }
  };

  const selectAll = () => {
    if (selectedImportedContact.length !== Object.keys(importedContacts).length) {
      importedContacts.forEach((element) => {
        if (!selectedImportedContact.includes(element.id))
          setSelectedImportedContact((oldArray) => [...oldArray, element.id]);
      });
    } else {
      setSelectedImportedContact([]);
    }
  };

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
    if (!formSearchQuery) {
      setSearchQueryData({ data: [] }); // clear results if empty
      return;
    }

    // Clear previous timeout
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    // Set new timeout
    typingTimeout.current = setTimeout(() => {
      searchContact();
    }, 1500); // 1.5 seconds

    // Cleanup
    return () => {
      clearTimeout(typingTimeout.current);
    };
  }, [formSearchQuery]);

  useFocusEffect(
    useCallback(() => {
      console.log("focus effect");
      setContactPaginate((prevState) => ({
        ...prevState,
        loading: false,
        page: 1,
      }));

      getContacts();

      return () => {};
    }, [])
  );

  return (
    <>
      {pageState && (
        <View className="flex-1">
          <View className="px-4 flex-1">
            <View className="flex-row items-center justify-between mb-6">
              <Pressable onPress={() => {}}>
                <Text className="text-2xl text-white">Contacts</Text>
              </Pressable>
              <Pressable
                className="bg-blue-500 border-0 py-1.5 px-6 rounded-lg text-lg"
                onPress={() => {
                  getContactPermission();
                  setShowImportedContactDialogue(true);
                }}
              >
                <Text className="text-white">Import</Text>
              </Pressable>
            </View>
            <View className="relative mb-8">
              <FontAwesome6 name="magnifying-glass" size={15} className="left-6 top-5 z-10 absolute" color="white" />
              <TextInput
                placeholder="Search contacts..."
                placeholderTextColor={"white"}
                className="p-4 ps-14 bg-secondary rounded-lg text-white text-xl"
                numberOfLines={1}
                onChangeText={(v) => {
                  setFormSearchQuery(v);
                }}
              />
            </View>

            {searchQueryData.data.length === 0 && (
              <FlatList
                data={contacts.data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <ContactInfoCard
                    caller={item}
                    action={(event) => {
                      getPos(event, item);
                    }}
                  />
                )}
                contentContainerStyle={{ gap: 12 }}
                showsVerticalScrollIndicator={true}
                onEndReached={getContacts}
                onEndReachedThreshold={0.15}
                ListFooterComponent={
                  contacts.current_page != contacts.last_page ? (
                    <ActivityIndicator />
                  ) : (
                    <NoData message="--- Limit reached ---" />
                  )
                }
              />
            )}

            {searchQueryData.data.length > 0 && (
              <FlatList
                data={searchQueryData.data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <ContactInfoCard
                    caller={item}
                    action={(event) => {
                      getPos(event, item);
                    }}
                  />
                )}
                contentContainerStyle={{ flexDirection: "column", gap: 12 }}
                showsVerticalScrollIndicator={true}
                ListEmptyComponent={() => <NoData center />}
              />
            )}
          </View>

          <Modal
            animationType="fade"
            transparent={true}
            visible={showImportedContactDialogue}
            onRequestClose={() => setShowImportedContactDialogue(false)}
          >
            <View className="flex-1 bg-secondary">
              <View className="mb-6 mt-4 border-b border-gray-500 pb-4 px-8 justify-between flex-row items-center">
                <Pressable
                  className="text-white text-lg flex-row items-center gap-2"
                  onPress={() => {
                    setShowImportedContactDialogue(false);
                  }}
                >
                  <FontAwesome6 name="arrow-left" color="white" size={16} />
                  <Text className="text-white text-xl text-center">Go back</Text>
                </Pressable>

                <Pressable
                  className="flex-row gap-4 items-center"
                  onPress={() => {
                    selectAll();
                  }}
                >
                  <Text className="text-white text-xl">Select All</Text>
                  <Checkbox
                    onValueChange={() => selectAll()}
                    value={selectedImportedContact.length === Object.keys(importedContacts).length ? true : false}
                    color={
                      selectedImportedContact.length === Object.keys(importedContacts).length ? "yellowgreen" : "gray"
                    }
                  />
                </Pressable>
              </View>

              <FlatList
                data={importedContacts}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <View style={{ marginBottom: 12 }} />}
                contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: 24 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Pressable
                    className="flex-row gap-8 items-center"
                    onPress={() => {
                      if (!selectedImportedContact.includes(item.id)) {
                        setSelectedImportedContact((prev) => [...prev, item.id]);
                      } else {
                        setSelectedImportedContact((prev) => prev.filter((data) => data !== item.id));
                      }
                    }}
                  >
                    <Checkbox
                      value={selectedImportedContact.includes(item.id) ? true : false}
                      onValueChange={() => {
                        if (!selectedImportedContact.includes(item.id)) {
                          setSelectedImportedContact((prev) => [...prev, item.id]);
                        } else {
                          setSelectedImportedContact((prev) => prev.filter((data) => data !== item.id));
                        }
                      }}
                      color={selectedImportedContact.includes(item.id) === true ? "yellowgreen" : "gray"}
                    />
                    <View className="flex-col gap-1">
                      <Text className="text-white text-xl">{item.name}</Text>
                      {item.phoneNumbers && item.phoneNumbers.length > 0 && (
                        <Text className="text-gray-500 text-sm">{item.phoneNumbers[0].number}</Text>
                      )}
                    </View>
                    {/* Green check on the right */}
                    <FontAwesome6
                      name="check"
                      size={24}
                      className="ml-auto"
                      color={selectedImportedContact.includes(item.id) === true ? "yellowgreen" : "gray"}
                    />
                  </Pressable>
                )}
                ListEmptyComponent={() => <NoData center />}
              />
              <View className="border-t border-gray-500 my-4 pt-4 px-8">
                <Pressable
                  className="text-white bg-blue-500 border-0 py-2 px-6 rounded-lg text-lg"
                  onPress={() => {
                    createImportedContact();
                  }}
                >
                  <Text className="text-white text-lg text-center">Import</Text>
                </Pressable>
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
                <TouchableOpacity
                  onPress={() => {
                    setContactMenu((prevState) => ({
                      ...prevState,
                      visible: false,
                    }));
                    router.push(`/contact/update`);
                  }}
                  className="py-2.5 px-4 border-b border-gray-500"
                >
                  <Text className="text-white">Edit</Text>
                </TouchableOpacity>

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
                      action: deleteContact,
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
        </View>
      )}
    </>
  );
};

export default Contact;
