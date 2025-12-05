import useAuthStore from "@/stores/authStore";
import { ApiRequest } from "@/utils/ApiRequest";
import { default_image } from "@/utils/const";
import { FontAwesome6 } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Modal, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";

const Profile = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const auth = useAuthStore((state) => state);
  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const updateProfile = async () => {
    const res = await ApiRequest({
      method: "POST",
      pathname: "/profile/update",
      token: auth.access_token,
      body: form,
    });

    if (res.ok) {
      auth.updateUser(res.data);
      setModalVisible(false);
    } else {
      alert("Failed to update profile.");
    }
  };

  return (
    <>
      <View className="mt-8 px-4">
        <View className="bg-secondary p-8 rounded-xl items-center justify-center mb-8">
          <Image source={{ uri: default_image }} className="h-24 w-24 rounded-full mb-4" />
          <Text className="text-xl text-white mb-1">{auth.user.name}</Text>
          <View className="flex-row gap-3 items-center mb-4">
            <FontAwesome6 name="dollar" color="yellowgreen" size={16} />
            <Text className="text-blue-500 text-lg mt-auto">10.00</Text>
          </View>

          <TouchableOpacity
            className="text-center text-white bg-blue-500 border-0 py-2 px-6 rounded-lg"
            onPress={() => setModalVisible(true)}
          >
            <Text className="text-center text-white text-lg font-semibold">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-col gap-4 mb-8">
          <View>
            <Text className="font-semibold text-white mb-2">Email:</Text>
            <View className="bg-secondary p-4 rounded-lg">
              <Text className="text-white">j6cafe2018@gmail.com</Text>
            </View>
          </View>

          {/* <View>
            <Text className="font-semibold text-white mb-2">Contact:</Text>
            <View className="bg-secondary p-4 rounded-lg">
              <Text className="text-white">+{auth.user.phone_number}</Text>
            </View>
          </View> */}
        </View>

        <View>
          <Text className="font-semibold text-danger mb-2">Account Disable:</Text>
          <TextInput placeholder='Type "Confirm" to disabled account...' className="bg-white p-4 rounded-lg mb-4" />
          <Pressable className="text-white bg-danger border-0 py-2 px-6 rounded text-lg">
            <Text className="text-center text-white text-lg font-semibold"> Disabled</Text>
          </Pressable>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="px-12 flex-1 bg-primary">
          <Text className="text-white text-2xl font-bold mt-12 mb-8 text-center w-full bg-secondary rounded-lg px-4 py-4">
            Edit Profile
          </Text>

          <View className="flex-col gap-4 mb-8">
            <View>
              <Text className="font-semibold text-white mb-2">Name: </Text>
              <TextInput
                placeholder={auth.user?.name}
                placeholderTextColor={"gray"}
                className="bg-white rounded-lg p-4"
                placeholderClassName="text-gray-500"
                onChangeText={(v) => {
                  setForm((prevState) => ({
                    ...prevState,
                    name: v,
                  }));
                }}
              />
            </View>

            <View className="mb-6">
              <Text className="font-semibold text-white mb-2">Email: </Text>
              <TextInput
                placeholder={auth.user?.email}
                placeholderTextColor={"gray"}
                className="bg-white rounded-lg p-4"
                placeholderClassName="text-gray-500"
                onChangeText={(v) => {
                  setForm((prevState) => ({
                    ...prevState,
                    email: v,
                  }));
                }}
              />
            </View>

            {/* <View className="mb-6">
              <Text className="font-semibold text-white mb-2">Contact:</Text>
              <TextInput
                placeholder={String(auth.user?.phone_number)}
                placeholderTextColor={"gray"}
                className="bg-white rounded-lg p-4"
                placeholderClassName="text-gray-500"
                keyboardType="phone-pad"
              />
            </View> */}

            <View className="flex-col gap-6 items-center justify-between">
              <TouchableOpacity
                className="w-full text-white bg-blue-500 border-0 py-4 px-6 rounded-lg"
                onPress={() => updateProfile()}
              >
                <Text className="text-white text-lg text-center">Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="w-full text-white bg-danger border-0 py-4 px-6 rounded-lg"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-white text-lg text-center">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Profile;
