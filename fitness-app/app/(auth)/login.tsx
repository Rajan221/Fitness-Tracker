import {
  View,
  Text,
  TextInput,
  Pressable,
  ImageBackground,
  Alert,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Link, router } from "expo-router";
import axios from "axios";
import BASE_URL from "../urls";

import * as SecureStore from "expo-secure-store";

interface IUser {
  email: string;
  password: string;
}

const Login = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const [formData, setFormData] = useState<IUser>({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      let userId;

      if (Platform.OS === "web") {
        userId = localStorage.getItem("user");
      } else {
        userId = await SecureStore.getItemAsync("user");
      }

      if (userId) {
        router.push("../home");
      }
    };

    checkUserLoggedIn();
  }, []);

  const handleInputChange = (name: keyof IUser, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async () => {
    try {
      const response: any = await axios.post(`${BASE_URL}/login`, {
        email: formData.email,
        password: formData.password,
      });

      console.log("Login response", response.data);

      if (
        response.status === 200 &&
        response.data.message === "Authenticated"
      ) {
        if (Platform.OS === "web") {
          localStorage.setItem("user", response.data.user_id.toString());
        } else {
          await SecureStore.setItemAsync(
            "user",
            response.data.user_id.toString()
          );
        }

        router.push("../home");
      } else {
        alert(JSON.stringify(response.data.message));
        setErrorMessage(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://img.freepik.com/free-photo/young-beautiful-sportive-girl-training-with-dumbbells-dark-wall_176420-679.jpg?t=st=1726669191~exp=1726672791~hmac=facc69511c82984a0121ae02cefb31e1487a5a93ba27bae39c9993045c4c2bad&w=1380",
      }}
      resizeMode="cover"
    >
      <View
        className="flex justify-center items-center h-[100%] "
        style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      >
        <Text className="text-5xl text-white">Login</Text>
        <TextInput
          className="bg-gray-300 text-black w-80 px-5 py-3 rounded-lg mt-10"
          placeholder="Email."
          placeholderTextColor="#aaa"
          onChangeText={(text) => handleInputChange("email", text)}
        />
        <TextInput
          className="bg-gray-300 text-black w-80 px-5 py-3 rounded-lg mt-10"
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry={hidePassword}
          onChangeText={(text) => handleInputChange("password", text)}
        />

        <Pressable onPress={() => setHidePassword(!hidePassword)}>
          <Text className="text-white">Show Password</Text>
        </Pressable>
        <Pressable
          onPress={handleLogin}
          className="bg-[#176264] w-80 px-5 py-4 rounded-full mt-10 "
        >
          <Text className="text-white text-center">Login</Text>
        </Pressable>
        <Link href="./register" className="mt-4">
          <Text className=" text-blue-500">
            Don't Have Account? Register Now.
          </Text>
        </Link>
      </View>
    </ImageBackground>
  );
};

export default Login;
