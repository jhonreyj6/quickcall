import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Tabs, usePathname } from "expo-router";
import React from "react";
import { View } from "react-native";

const TabIcon = ({ focused, icon }) => {
  return (
    <View className="items-center">
      <FontAwesome6 name={icon} size={24} color={focused ? "white" : "gray"} />
    </View>
  );
};

const TabLayout = () => {
  const pathname = usePathname(); // current path
  const userTabs = [
    { name: "(tabs)/dialer", title: "Dialer", icon: "phone", showTab: true },
    { name: "(tabs)/contact", title: "Contact", icon: "address-book", showTab: true },
    { name: "(tabs)/account", title: "Account", icon: "user", showTab: true },
    { name: "(pages)/test", title: "Test", icon: "", showTab: false },
    { name: "(pages)/saved/payment", title: "SavedPayment", icon: "", showTab: false },
    { name: "(pages)/profile", title: "Notification", icon: "", showTab: false },
    { name: "(pages)/notification", title: "Notification", icon: "", showTab: false },
    { name: "(pages)/pricing", title: "Buy Credit", icon: "", showTab: false },
    { name: "(pages)/payment/checkout", title: "Checkout", icon: "", showTab: false },
    { name: "(pages)/payment/confirm", title: "Confirm Payment", icon: "", showTab: false },
    { name: "(pages)/contact/create", title: "Create Contact", icon: "", showTab: false },
    { name: "(pages)/contact/update", title: "Update Contact", icon: "", showTab: false },
    { name: "(pages)/call/ongoing", title: "Ongoing Call", icon: "", showTab: false },
  ];

  const hideTabs = pathname === "/call/ongoing"; // hide tabs only on this path

  return (
    <View className="flex-1">
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: hideTabs
            ? { display: "none" } // hide tab bar
            : {
                borderTopWidth: 1,
                borderColor: "#334155",
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                height: 60,
                paddingTop: 10,
                backgroundColor: "#0f172a",
              },
          sceneStyle: {
            paddingBottom: hideTabs ? 0 : 65, // adjust content padding
            backgroundColor: "transparent",
            paddingLeft: 12,
            paddingRight: 12,
          },
          headerShown: false,
        }}
      >
        {userTabs.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={
              tab.showTab
                ? {
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={tab.icon} />,
                  }
                : { href: null }
            }
          />
        ))}
      </Tabs>
    </View>
  );
};

export default TabLayout;
