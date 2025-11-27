import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

const TabIcon = ({ focused, icon }) => {
  return (
    <View className="items-center">
      <FontAwesome6 name={icon} size={24} color={focused ? "white" : "gray"} />
      {/* <Text className={`text-xs mt-1 w-10 text-center ${focused ? "text-blue-600" : "text-slate-500"}`}>{title}</Text> */}
    </View>
  );
};

const TabLayout = () => {
  const userTabs = [
    { name: "dialer", title: "Dialer", icon: "phone", showTab: true },
    { name: "contact", title: "Contact", icon: "address-book", showTab: true },
    { name: "account", title: "Account", icon: "user", showTab: true },
    { name: "profile", title: "Profile", icon: "user", showTab: false },
    { name: "saved/payment", title: "SavedPayment", icon: "", showTab: false },
    { name: "notification", title: "Notification", icon: "", showTab: false },
    { name: "pricing", title: "Buy Credit", icon: "", showTab: false },
    { name: "create/payment", title: "Create Payment", icon: "", showTab: false },
    // { name: "create/layout", title: "Payment Layout", icon: "", showTab: false },
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
        {userTabs.map((tab) => {
          if (tab.showTab === true) {
            return (
              <Tabs.Screen
                key={tab.name}
                name={tab.name}
                options={{
                  headerShown: false,
                  tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={tab.icon} />,
                }}
              />
            );
          } else {
            return (
              <Tabs.Screen
                name={tab.name}
                options={{
                  href: null,
                  headerShown: false,
                }}
                key={tab.name}
              />
            );
          }
        })}
      </Tabs>
    </View>
  );
};

export default TabLayout;
