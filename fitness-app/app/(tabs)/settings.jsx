import {
  View,
  Text,
  Pressable,
  Platform,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import React from "react";
import { Link, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import axios from "axios";
import BASE_URL from "../urls";

const Settings = () => {
  const handleLogout = async () => {
    try {
      if (Platform.OS === "web") {
        localStorage.removeItem("user");
      } else {
        await SecureStore.deleteItemAsync("user");
      }

      router.push("/login");
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };
  return (
    <ScrollView className="p-5">
      <Text className="text-2xl">Settings</Text>

      <Pressable
        onPress={handleLogout}
        className="bg-[#176264] w-80 px-5 py-4 rounded-full mt-10"
      >
        <Text className="text-white text-center">Change User Data</Text>
      </Pressable>

      <Text className="text-black  mt-10">Do you want to Logout?</Text>

      <Pressable
        onPress={handleLogout}
        className="bg-[#176264] w-80 px-5 py-4 rounded-full mt-2"
      >
        <Text className="text-white text-center">Logout</Text>
      </Pressable>

      <View className="h-40"></View>
    </ScrollView>
  );
};

export default Settings;
