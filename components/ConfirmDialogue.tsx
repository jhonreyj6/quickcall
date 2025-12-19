import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

const ConfirmDialogue = ({
  title = "Are you sure?",
  message = "Click yes to proceed.",
  state,
  setState,
  action,
}: {
  title?: string;
  message?: string;
  state: boolean;
  setState: () => void;
  action?: () => void;
}) => {
  return (
    <Modal animationType="none" transparent={true} visible={state} onRequestClose={() => setState(false)}>
      <Pressable className="flex-1 bg-black/60 p-8" onPress={() => setState()}>
        <Pressable onPress={() => {}} className="my-auto">
          <View className="w-full bg-secondary rounded-xl p-8">
            <Text className="text-2xl text-white mb-2">{title}</Text>
            <Text className="text-gray-500 text-sm mb-6">{message}</Text>

            <View className="flex-row gap-4">
              <Pressable
                className="text-white flex-1 bg-blue-500 border-0 py-2 px-6 rounded-lg text-lg flex-row gap-2 items-center justify-center"
                onPress={() => {
                  action();
                  setState();
                }}
              >
                <FontAwesome6 name="check" color={"yellowgreen"} size={20} className="text-center" />
                <Text className="text-white text-lg">Yes</Text>
              </Pressable>
              <Pressable
                className="text-white flex-1 bg-red-500 border-0 py-2 px-6 rounded-lg text-lg flex-row gap-2 items-center justify-center"
                onPress={() => setState()}
              >
                <FontAwesome6 name="xmark" color={"gray"} size={20} className="text-center" />
                <Text className="text-white text-lg">No</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ConfirmDialogue;
