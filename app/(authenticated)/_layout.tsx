import useAuthStore from "@/stores/authStore";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useIsFocused } from "@react-navigation/native";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

const TabIcon = ({ focused, icon }) => {
  const auth = useAuthStore((state) => state);
  const isFocused = useIsFocused();

  // useEffect(() => {
  //   if (isFocused && !auth.isAuthenticated) {
  //     router.replace("/login");
  //   }
  // }, [isFocused, auth]);

  return (
    <View className="items-center">
      <FontAwesome6 name={icon} size={24} color={focused ? "white" : "gray"} />
    </View>
  );
};

const TabLayout = () => {
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
