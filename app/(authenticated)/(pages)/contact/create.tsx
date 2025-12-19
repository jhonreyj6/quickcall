import useAuthStore from "@/stores/authStore";
import useSelectedDataStore from "@/stores/selectedDataStore";
import { ApiRequest } from "@/utils/ApiRequest";
import { router, useFocusEffect } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import React, { useCallback, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const createContact = () => {
  const params = useSearchParams();
  const auth = useAuthStore((state) => state);
  const selectedDataStore = useSelectedDataStore((state) => state);
  const [form, setForm] = useState({
    name: "",
    phone_number: null,
  });

  const addContact = async () => {
    const res = await ApiRequest({
      method: "POST",
      pathname: "/contact",
      token: auth.access_token,
      body: {
        recent_id: selectedDataStore.data.id,
        name: form.name,
        phoneNumber: form.phone_number ? form.phone_number : selectedDataStore.data.phone_number,
      },
    });

    if (res.ok) {
      router.replace("/contact");
    } else {
      console.log(res.data);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setForm((prevState) => ({
        ...prevState,
        name: "",
      }));
      return () => {};
    }, [])
  );

  return (
    <View className="flex-1 justify-center items-center">
      <View className="p-8 bg-secondary rounded-lg mx-8 w-full">
        <View>
          <Text className="font-semibold text-gray-500 mb-2">Name:</Text>
          <TextInput
            placeholder="Type the name"
            className="bg-white p-4 rounded-lg mb-4"
            value={form.name}
            onChangeText={(v) => {
              setForm((prevState) => ({
                ...prevState,
                name: v,
              }));
            }}
          />
        </View>
        <View className="mb-2">
          <Text className="font-semibold text-gray-500 mb-2">Phone Number:</Text>
          <TextInput
            placeholder="Type the number"
            keyboardType="phone-pad"
            className="bg-white p-4 rounded-lg mb-4"
            defaultValue={selectedDataStore.data.phone_number}
            onChangeText={(v) => {
              setForm((prevState) => ({
                ...prevState,
                phone_number: v,
              }));
            }}
          />
        </View>

        <TouchableOpacity
          className="text-white bg-indigo-500 border-0 py-4 px-6 rounded-lg text-lg"
          onPress={() => addContact()}
        >
          <Text className="text-white text-center">Add Contact</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default createContact;
