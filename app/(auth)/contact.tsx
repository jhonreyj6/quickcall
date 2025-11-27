import ContactInfoCard from "@/components/ContactInfoCard";
import useAuthStore from "@/stores/authStore";
import { apiRequest } from "@/utils/apiRequest";
import { FontAwesome6 } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";

const Contact = () => {
  const [contacts, setContacts] = useState({ data: [] });
  const [favoriteContacts, setFavoriteContacts] = useState({ data: [] });
  const [searchContacts, setSearchContacts] = useState({ data: [] });
  const auth = useAuthStore((state) => state);
  const typingTimeout = useRef(null);
  const [formSearchQuery, setFormSearchQuery] = useState("");

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
      setSearchContacts(res.data);
    } else {
      alert("Failed to search contacts");
    }
  };

  useEffect(() => {
    if (!formSearchQuery) {
      setSearchContacts({ data: [] }); // clear results if empty
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
        <Text className="text-2xl text-white mb-2">Contacts</Text>
        <Text className="text-gray-500 mb-4">5 contacts</Text>
        <View className="relative mb-8">
          <FontAwesome6 name="magnifying-glass" size={16} className="left-8 top-6 z-10 absolute" color="white" />
          <TextInput
            placeholder="Search contacts..."
            placeholderTextColor={"white"}
            className="p-4 ps-16 bg-secondary rounded-lg text-white text-2xl"
            numberOfLines={1}
            onChangeText={(v) => {
              setFormSearchQuery(v);
            }}
          />
        </View>
        {searchContacts.data.length === 0 && (
          <ScrollView className="mb-8" showsVerticalScrollIndicator={true}>
            <View className="mb-4">
              <Text className="text-white">Favorites</Text>
            </View>
            <View className="mb-6">
              <View className="flex-col gap-4">
                {favoriteContacts.data.length > 0 &&
                  favoriteContacts.data.map((caller, index) => {
                    return <ContactInfoCard key={index} caller={caller} />;
                  })}
              </View>
            </View>
            <View className="mb-4">
              <Text className="text-white">All Contacts</Text>
            </View>

            <View className="flex-col gap-4">
              {contacts.data.length > 0 &&
                contacts.data.map((caller, index) => {
                  return <ContactInfoCard key={index} caller={caller} />;
                })}
            </View>
          </ScrollView>
        )}

        {searchContacts.data.length > 0 && (
          <ScrollView className="mb-8" showsVerticalScrollIndicator={true}>
            <View className="flex-col gap-4">
              {searchContacts.data.map((caller, index) => {
                return <ContactInfoCard key={index} caller={caller} />;
              })}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default Contact;
