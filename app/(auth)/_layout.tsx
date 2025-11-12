import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

const TabIcon = ({ name, focused, title }) => {
  return (
    <View className="items-center">
      <FontAwesome6
        name={name}
        size={24}
        color={focused ? "#2563eb" : "#64748b"} // blue-600 : slate-500
      />
      {/* <Text className={`text-xs mt-1 w-10 text-center ${focused ? "text-blue-600" : "text-slate-500"}`}>{title}</Text> */}
    </View>
  );
};

const TabLayout = () => {
  const isLoggedIn = false; // change to true to test logged-in tabs

  const userTabs = [
    { name: "dialer", title: "Dialer", icon: "phone" },
    // { name: "recent", title: "Recent", icon: "clock-o" },
    { name: "contact", title: "Contact", icon: "address-book" },
    { name: "account", title: "Account", icon: "user" },
  ];

  return (
    <View className="flex-1">
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          // let the root layout background show through the tab screens

          tabBarStyle: {
            borderTopWidth: 1,
            borderColor: "#334155",
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            height: 60,
            // padding: 24,
            paddingTop: 10,
            backgroundColor: "#0f172a",
          },
          sceneStyle: {
            paddingBottom: 65,
            backgroundColor: "transparent",
            paddingLeft: 12,
            paddingRight: 12,
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
    </View>
  );
};

export default TabLayout;
