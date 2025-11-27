import SocialButton from "@/components/SocialButton";
import useAuthStore from "@/stores/authStore";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const Login = () => {
  const initForm = {
    email: "",
    password: "",
  };

  const [form, setForm] = useState(initForm);
  const storeLogin = useAuthStore((state) => state.login);

  const authenticate = async () => {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (response.ok) {
      storeLogin(data);
      router.push("/dialer");
    } else {
      alert(data.error);
    }
  };

  return (
    <View className="flex-1 justify-center p-6">
      <View className="p-8 rounded-xl bg-sky-950 border">
        <Text className="text-white text-3xl font-bold mb-4 text-center">Create an Account</Text>
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

        <TouchableOpacity className="bg-white rounded-xl py-3 mb-2" onPress={() => authenticate()}>
          <Text className="text-center text-green-600 font-semibold">Login</Text>
        </TouchableOpacity>

        <Link href={"/register"} className="mb-8">
          <Text className="text-center text-white underline">Not register yet? Click to Register</Text>
        </Link>

        <SocialButton />
      </View>
    </View>
  );
};

export default Login;
