import { View, Text, Pressable } from "react-native";
import React from "react";
import { Link, router } from "expo-router";

const Settings = () => {
  const handleLogout = () => {
    router.replace("../login");
  };
  return (
    <View className="p-5">
      <Text className="text-2xl">Settings</Text>

      <Text className="text-black  mt-10">Do you want to Logout?</Text>

      <Pressable
        onPress={handleLogout}
        className="bg-black w-80 px-5 py-4 rounded-full mt-2"
      >
        <Text className="text-white text-center">Logout</Text>
      </Pressable>
    </View>
  );
};

export default Settings;
