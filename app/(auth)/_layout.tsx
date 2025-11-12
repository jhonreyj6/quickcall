import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

const TabIcon = ({ name, focused, title }) => {
  return (
    <View className="items-center">
      <FontAwesome
        name={name}
        size={24}
        color={focused ? "#2563eb" : "#64748b"} // blue-600 : slate-500
      />
      {/* <Text className={`text-xs mt-1 ${focused ? "text-blue-600" : "text-slate-500"}`}>{title}</Text> */}
    </View>
  );
};

const TabLayout = () => {
  const isLoggedIn = false; // change to true to test logged-in tabs

  const userTabs = [
    { name: "dialer", title: "Dialer", icon: "phone" },
    { name: "recent", title: "Recent", icon: "clock-o" },
    // { name: "contacts", title: "Contacts", icon: "address-book" },
    // { name: "profile", title: "Profile", icon: "user" },
  ];

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderColor: "#e5e7eb", // gray-200
          height: 65,
          backgroundColor: "#f9fafb", // gray-50
          // paddingBottom: 5,
          paddingTop: 12,
        },
      }}
    >
      {userTabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => <TabIcon name={tab.icon} title={tab.title} focused={focused} />,
          }}
        />
      ))}
    </Tabs>
  );
};

export default TabLayout;
