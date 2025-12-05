import ContactInfoCard from "@/components/ContactInfoCard";
import NoData from "@/components/NoData";
import useAuthStore from "@/stores/authStore";
import { ApiRequest } from "@/utils/ApiRequest";
import { FontAwesome6 } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import * as Contacts from "expo-contacts";
import { useEffect, useRef, useState } from "react";
import { FlatList, Modal, Pressable, Text, TextInput, View } from "react-native";

const Contact = () => {
  const [contacts, setContacts] = useState({ data: [] });
  const [favoriteContacts, setFavoriteContacts] = useState({ data: [] });
  const [searchQueryData, setSearchQueryData] = useState({ data: [] });
  const auth = useAuthStore((state) => state);
  const typingTimeout = useRef(null);
  const [formSearchQuery, setFormSearchQuery] = useState("");

  const [importedContacts, setImportedContacts] = useState({});
  const [showImportedContactDialogue, setShowImportedContactDialogue] = useState(false);
  const [selectedImportedContact, setSelectedImportedContact] = useState([]);

  const getContacts = async () => {
    const res = await ApiRequest({
      pathname: "/contact",
      token: auth.access_token,
    });

    if (res.ok) {
      setContacts(res.data);
    } else {
      alert("Failed to fetch contacts");
    }
  };

  const getFavorite = async () => {
    const res = await ApiRequest({
      pathname: "/contact/favorite",
      token: auth.access_token,
    });

    if (res.ok) {
      setFavoriteContacts(res.data);
    } else {
      alert("Failed to fetch favorite contacts");
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
      alert("Failed to search contacts");
    }
  };

  const getContactPermission = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        setImportedContacts(data);
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
      getContacts();
    } else {
      console.log(res);
    }
  };

  const selectAll = () => {
    if (selectedImportedContact.length !== Object.keys(importedContacts).length) {
      importedContacts.forEach((element) => {
        if (!selectedImportedContact.includes(element.id))
          setSelectedImportedContact((oldArray) => [...oldArray, element.id]);
      });
    } else {
      console.log("else");
      setSelectedImportedContact([]);
    }
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

  useEffect(() => {
    getContacts();
    getFavorite();
  }, []);

  return (
    <View className="flex-1">
      <View className="px-4 flex-1">
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => {}}>
            <Text className="text-2xl text-white">Contacts</Text>
          </Pressable>
          <Pressable
            className="bg-secondary border-0 py-1.5 px-6 rounded-lg text-lg"
            onPress={() => {
              getContactPermission();
              setShowImportedContactDialogue(true);
            }}
          >
            <Text className="text-blue-500">Import</Text>
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
            data={[
              ...(favoriteContacts.data.length > 0
                ? [
                    { type: "header", title: "Favorites" },
                    ...favoriteContacts.data.map((item) => ({
                      type: "favorite",
                      caller: item,
                    })),
                  ]
                : []),
              ...(contacts.data.length > 0
                ? [
                    { type: "header", title: "All Contacts" },
                    ...contacts.data.map((item) => ({
                      type: "contact",
                      caller: item,
                    })),
                  ]
                : []),
            ]}
            keyExtractor={(item, index) =>
              item.type === "header" ? `header-${item.title}` : item.caller.id || index.toString()
            }
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ paddingBottom: 32 }}
            renderItem={({ item }) => {
              if (item.type === "header") {
                return (
                  <View className="mb-4 mt-4 flex-row gap-2 items-center">
                    <Text className="text-white text-lg font-bold">{item.title}</Text>
                  </View>
                );
              }

              return (
                <View className="mb-4">
                  <ContactInfoCard caller={item.caller} />
                </View>
              );
            }}
            ListEmptyComponent={() => <NoData center />}
          />
        )}

        {searchQueryData.data.length > 0 && (
          <FlatList
            data={searchQueryData.data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <ContactInfoCard caller={item} />}
            contentContainerStyle={{ paddingBottom: 32 }}
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
                color={selectedImportedContact.length === Object.keys(importedContacts).length ? "yellowgreen" : "gray"}
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
    </View>
  );
};

export default Contact;
