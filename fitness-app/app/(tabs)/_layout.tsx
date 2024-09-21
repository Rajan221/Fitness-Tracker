import { View, Text } from "react-native";
import React from "react";
import { Stack, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons from Expo

const MainLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "#171224",
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} /> // Using Ionicons
            ),
          }}
        ></Tabs.Screen>
        <Tabs.Screen
          name="foodTracker"
          options={{
            title: "Food Tracker",
            headerShown: true,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="fast-food" color={color} size={size} /> // Using Ionicons
            ),
          }}
        ></Tabs.Screen>
        <Tabs.Screen
          name="workout"
          options={{
            title: "Workout",
            headerShown: true,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="barbell" color={color} size={size} /> // Using Ionicons
            ),
          }}
        ></Tabs.Screen>
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            headerShown: true,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" color={color} size={size} /> // Using Ionicons
            ),
          }}
        ></Tabs.Screen>
      </Tabs>
    </>
  );
};

export default MainLayout;
