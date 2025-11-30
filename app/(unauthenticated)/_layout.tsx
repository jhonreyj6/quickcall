import useAuthStore from "@/stores/authStore";
import { useIsFocused } from "@react-navigation/native";
import { router, Slot } from "expo-router";
import React, { useEffect } from "react";

const Layout = () => {
  const auth = useAuthStore((state) => state);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && auth.isAuthenticated) {
      router.replace("/dialer");
    }
  }, [isFocused, auth]);

  return <Slot />;
};

export default Layout;
