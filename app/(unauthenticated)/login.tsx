import SocialButton from "@/components/SocialButton";
import { Link } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View className="flex-1 justify-center p-6">
      <View className="p-8 rounded-lg bg-sky-950 border">
        <Text className="text-white text-3xl font-bold mb-4 text-center">Create an Account</Text>
        <TextInput
          className="bg-white rounded-xl px-4 py-3 mb-3"
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          className="bg-white rounded-xl px-4 py-3 mb-6"
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity className="bg-white rounded-xl py-3 mb-4">
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
