import ContactInfoCard from "@/components/ContactInfoCard";
import useAuthStore from "@/stores/authStore";
import { apiRequest } from "@/utils/apiRequest";
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
  const [selectedImportedContact, setSelectedImportedContact] = useState({});

  const getContacts = async () => {
    const res = await apiRequest({
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
    const res = await apiRequest({
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
    const res = await apiRequest({
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

  const toggleSelect = (id) => {
    setSelectedImportedContact((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    console.log(selectedImportedContact);
  };

  const createImportedContact = async () => {
    const res = await apiRequest({
      method: "POST",
      pathname: "/contact",
      token: auth.access_token,
      body: selectedImportedContact,
    });

    if (res.ok) {
      console.log("ok");
    } else {
      alert("Failed to import contacts!");
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
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl text-white mb-2">Contacts</Text>
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
        <Text className="text-gray-500 mb-4">
          {searchQueryData.data.length > 0
            ? searchQueryData.data.length
            : contacts.data.length + favoriteContacts.data.length}{" "}
          contacts
        </Text>
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
              { type: "header", title: "Favorites" },
              ...favoriteContacts.data.map((item) => ({ type: "favorite", caller: item })),
              { type: "header", title: "All Contacts" },
              ...contacts.data.map((item) => ({ type: "contact", caller: item })),
            ]}
            keyExtractor={(item, index) =>
              item.type === "header" ? `header-${item.title}` : item.caller.id || index.toString()
            }
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ paddingBottom: 32 }}
            renderItem={({ item }) => {
              if (item.type === "header") {
                return (
                  <View className="mb-4 mt-4">
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
          />
        )}

        {searchQueryData.data.length > 0 && (
          <FlatList
            data={searchQueryData.data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <ContactInfoCard caller={item} />}
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={true}
          />
        )}
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showImportedContactDialogue}
        onRequestClose={() => setShowImportedContactDialogue(false)}
      >
        <View className="flex-1 bg-secondary px-8">
          <FlatList
            data={importedContacts}
            keyExtractor={(item) => item.id} // ✔ use contact id
            ItemSeparatorComponent={() => <View style={{ marginBottom: 16 }} />}
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable onPress={() => toggleSelect(item.id)} className="flex-row gap-8 items-center">
                {/* CHECKBOX */}
                <Checkbox
                  value={!!selectedImportedContact[item.id]}
                  onValueChange={() => toggleSelect(item.id)}
                  color={selectedImportedContact[item.id] ? "#4ade80" : undefined}
                />

                {/* Contact information */}
                <View className="flex-col gap-1">
                  <Text className="text-white text-xl">{item.name}</Text>

                  {item.phoneNumbers && item.phoneNumbers.length > 0 && (
                    <Text className="text-gray-500 text-sm">{item.phoneNumbers[0].number}</Text>
                  )}
                </View>

                {/* Green check on the right */}
                {selectedImportedContact[item.id] && (
                  <FontAwesome6 name="check" size={24} className="ml-auto" color="green" />
                )}
              </Pressable>
            )}
          />

          <View className="border-t border-gray-500 my-4">
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
