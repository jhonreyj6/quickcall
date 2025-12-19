import useAuthStore from "@/stores/authStore";
import useSelectedDataStore from "@/stores/selectedDataStore";
import { ApiRequest } from "@/utils/ApiRequest";
import { router } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const updateContact = () => {
  const selectedDataStore = useSelectedDataStore((state) => state);
  const auth = useAuthStore((state) => state);
  const [form, setForm] = useState({
    name: "",
    phone_number: "",
  });

  const updateContact = async () => {
    const res = await ApiRequest({
      pathname: "/contact/update",
      token: auth.access_token,
      method: "POST",
      body: {
        contact_id: selectedDataStore.data.id,
        name: form.name ? form.name : selectedDataStore.data.name,
        phone_number: form.phone_number ? form.phone_number : selectedDataStore.data.phone_number,
      },
    });

    if (res.ok) {
      router.replace("/contact");
    } else {
      alert("Unable to update the contact.");
    }
  };

  return (
    <View className="flex-1 justify-center items-center">
      <View className="p-8 bg-secondary rounded-lg mx-8 w-full">
        <View>
          <Text className="font-semibold text-gray-500 mb-2">Name:</Text>
          <TextInput
            placeholder="Type the name"
            className="bg-white p-4 rounded-lg mb-4"
            defaultValue={selectedDataStore.data.name}
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
          onPress={() => updateContact()}
        >
          <Text className="text-white text-center">Update Contact</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default updateContact;
