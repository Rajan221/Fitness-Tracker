import { Text, View } from "react-native";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native"; // Import Platform for platform checks

import { NativeWindStyleSheet } from "nativewind";

// browser ma css problem vayera
NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function Index() {
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        let user = null;

        if (Platform.OS === "web") {
          user = localStorage.getItem("user");
        } else {
          user = await SecureStore.getItemAsync("user");
        }

        if (user) {
          // If user data exists, navigate to the home screen
          router.push("./home");
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.log("Error checking user authentication:", error);
        setIsLoading(false);
      }
    };

    checkUserAuthentication();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        className="text-4xl"
        style={{
          marginBottom: 20,
        }}
      >
        My fitness
      </Text>
      <Link href="./login">
        <Text className="text-blue-500 ">Go to Logins</Text>
      </Link>

      <Link href="./register">
        <Text className="text-blue-500">Go to Register</Text>
      </Link>

      <Link href="./home">
        <Text className="text-blue-500">Go to Home</Text>
      </Link>
    </View>
  );
}
