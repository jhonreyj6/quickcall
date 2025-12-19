import SocialButton from "@/components/SocialButton";
import useAuthStore from "@/stores/authStore";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const Register = () => {
  const initForm = {
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  };

  const [form, setForm] = useState(initForm);
  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);

  const register = async () => {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    console.log(res);

    const data = await response.json();
    if (response.ok) {
      login(data);
      router.push("/dialer");
    } else {
      switch (Object.keys(data)[0]) {
        case "email":
          alert(data.email);
          break;

        case "name":
          alert(data.name);
          break;

        case "password":
          alert(data.password);
          break;

        case "confirm_password":
          alert(data.confirm_password);
          break;

        case "message":
          alert(data.message);
          break;

        case "error":
          alert(data.error);
          break;

        default:
          alert("Something went wrong!");
          break;
      }
    }
  };

  return (
    <View className="flex-1 justify-center p-6">
      <View className="p-8 rounded-lg bg-sky-950 border">
        <Text className="text-white text-3xl font-bold mb-4 text-center">Create an Account</Text>
        <View className="mb-3">
          <TextInput
            className="bg-white rounded-xl px-4 py-3"
            placeholder="Name"
            value={form.name}
            onChangeText={(v) => {
              setForm((prevState) => ({
                ...prevState,
                name: v,
              }));
            }}
          />
        </View>
        <View className="mb-3">
          <TextInput
            className="bg-white rounded-xl px-4 py-3"
            placeholder="Email"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(v) => {
              setForm((prevState) => ({
                ...prevState,
                email: v,
              }));
            }}
          />
        </View>
        <View className="mb-3">
          <TextInput
            className="bg-white rounded-xl px-4 py-3"
            placeholder="Password"
            secureTextEntry
            value={form.password}
            onChangeText={(v) => {
              setForm((prevState) => ({
                ...prevState,
                password: v,
              }));
            }}
          />
        </View>
        <View className="mb-6">
          <TextInput
            className="bg-white rounded-xl px-4 py-3"
            placeholder="Confirn password"
            secureTextEntry
            value={form.confirm_password}
            onChangeText={(v) => {
              setForm((prevState) => ({
                ...prevState,
                confirm_password: v,
              }));
            }}
          />
        </View>
        <TouchableOpacity className="bg-white rounded-xl py-3 mb-4" onPress={() => register()}>
          <Text className="text-center text-green-600 font-semibold">Register</Text>
        </TouchableOpacity>
        <Link href={"/login"} className="mb-8">
          <Text className="text-center text-white underline">Already have an account? Login</Text>
        </Link>

        <SocialButton />
      </View>
    </View>
  );
};

export default Register;
