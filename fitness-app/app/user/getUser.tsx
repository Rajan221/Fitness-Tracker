import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

//GET USER ID FOR PLATFORM
const getUserId = async (): Promise<string | null> => {
  try {
    let userId = null;

    if (Platform.OS === "web") {
      userId = localStorage.getItem("user");
    } else {
      userId = await SecureStore.getItemAsync("user");
    }

    return userId;
  } catch (error) {
    console.log("Error retrieving user ID:", error);
    return null;
  }
};

export default getUserId;
