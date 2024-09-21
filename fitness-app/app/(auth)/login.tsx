import {
  View,
  Text,
  TextInput,
  Pressable,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";

const Login = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const handleLogin = () => {
    router.push("../home");
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
        />
        <TextInput
          className="bg-gray-300 text-black w-80 px-5 py-3 rounded-lg mt-10"
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry={hidePassword}
        />
        <Pressable
          onPress={handleLogin}
          className="bg-[#176264] w-80 px-5 py-4 rounded-full mt-10 "
        >
          <Text className="text-white text-center">Login</Text>
        </Pressable>
        <Link href="./register" className="mt-4">
          <Text className=" text-blue-500">
            Dont Have Account? Register Now.
          </Text>
        </Link>
      </View>
    </ImageBackground>
  );
};

export default Login;
