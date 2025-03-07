import {
  View,
  Text,
  TextInput,
  Pressable,
  ImageBackground,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";
import axios from "axios";
import BASE_URL from "../urls";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("Male");
  const [goal, setGoal] = useState("Gain Weight");
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [hidePassword, setHidePassword] = useState(true);

  const handleRegister = async () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !age ||
      !height ||
      !weight
    ) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    const userData = {
      firstName,
      lastName,
      email,
      password,
      age,
      height,
      weight,
      gender,
      goal,
      activityLevel,
    };

    try {
      await axios.post(`${BASE_URL}/register`, userData);
      Alert.alert("Success", "Registration successful!");
      router.push("./login");
    } catch (error) {
      Alert.alert("Error", "Failed to register. Please try again.");
    }
  };

  const activityLevels = [
    { id: "sedentary", label: "Sedentary (Little to no Exercise)" },
    { id: "lightly", label: "Lightly Active (Light Exercise 1-3 days/week)" },
    {
      id: "moderately",
      label: "Moderately Active (Moderate Exercise 3-5 days/week)",
    },
    { id: "very", label: "Very Active (Hard Exercise 6-7 days/week)" },
    { id: "super", label: "Super Active (Very Hard Exercise & Physical Job)" },
  ];

  return (
    <ScrollView>
      <ImageBackground
        source={{
          uri: "https://img.freepik.com/free-photo/young-beautiful-sportive-girl-training-with-dumbbells-dark-wall_176420-679.jpg",
        }}
        resizeMode="cover"
      >
        <View
          className="flex justify-center items-center h-full py-24"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >
          <Text className="text-5xl text-white">Register</Text>

          <TextInput
            className="bg-gray-300 text-black w-80 px-5 py-3 rounded-lg mt-10"
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            className="bg-gray-300 text-black w-80 px-5 py-3 rounded-lg mt-10"
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            className="bg-gray-300 text-black w-80 px-5 py-3 rounded-lg mt-10"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            className="bg-gray-300 text-black w-80 px-5 py-3 rounded-lg mt-10"
            placeholder="Password"
            secureTextEntry={hidePassword}
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            className="bg-gray-300 text-black w-80 px-5 py-3 rounded-lg mt-10"
            placeholder="Age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
          <TextInput
            className="bg-gray-300 text-black w-80 px-5 py-3 rounded-lg mt-10"
            placeholder="Height (cm)"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />
          <TextInput
            className="bg-gray-300 text-black w-80 px-5 py-3 rounded-lg mt-10"
            placeholder="Weight (kg)"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />

          {/* Gender Selection */}
          <View className="bg-gray-300 w-80 px-5 py-3 rounded-lg mt-10">
            <Text>Select Gender:</Text>
            <View className="flex-row justify-between mt-2">
              <Pressable
                onPress={() => setGender("Male")}
                style={{
                  backgroundColor:
                    gender === "Male" ? "#176264" : "transparent",
                  paddingVertical: 8,
                  paddingHorizontal: 15,
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: gender === "Male" ? "white" : "black" }}>
                  Male
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setGender("Female")}
                style={{
                  backgroundColor:
                    gender === "Female" ? "#176264" : "transparent",
                  paddingVertical: 8,
                  paddingHorizontal: 15,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{ color: gender === "Female" ? "white" : "black" }}
                >
                  Female
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Goal Selection */}
          <View className="bg-gray-300 w-80 px-5 py-3 rounded-lg mt-10">
            <Text>Select Goal:</Text>
            <View className=" mt-2">
              <Pressable
                onPress={() => setGoal("Gain Weight")}
                style={{
                  backgroundColor:
                    goal === "Gain Weight" ? "#176264" : "transparent",
                  paddingVertical: 8,
                  paddingHorizontal: 15,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{ color: goal === "Gain Weight" ? "white" : "black" }}
                >
                  Gain Weight
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setGoal("Lose Weight")}
                style={{
                  backgroundColor:
                    goal === "Lose Weight" ? "#176264" : "transparent",
                  paddingVertical: 8,
                  paddingHorizontal: 15,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{ color: goal === "Lose Weight" ? "white" : "black" }}
                >
                  Lose Weight
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setGoal("Maintain Weight")}
                style={{
                  backgroundColor:
                    goal === "Maintain Weight" ? "#176264" : "transparent",
                  paddingVertical: 8,
                  paddingHorizontal: 15,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{
                    color: goal === "Maintain Weight" ? "white" : "black",
                  }}
                >
                  Maintain Weight
                </Text>
              </Pressable>
            </View>
          </View>

          <View className="bg-gray-300 w-80 px-5 py-3 rounded-lg mt-10">
            <Text className="text-black text-lg font-semibold">
              Activity Level:
            </Text>
            <View className="mt-2">
              {activityLevels.map(({ id, label }) => (
                <Pressable
                  key={id}
                  onPress={() => setActivityLevel(id)}
                  className={`px-4 py-2 rounded-lg mt-2 ${
                    activityLevel === id ? "bg-teal-700" : "bg-transparent"
                  }`}
                >
                  <Text
                    className={`${
                      activityLevel === id ? "text-white" : "text-black"
                    }`}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable
            onPress={handleRegister}
            className="bg-[#176264] w-80 px-5 py-4 rounded-full mt-10"
          >
            <Text className="text-white text-center">Register</Text>
          </Pressable>

          <Link href="./login" className="mt-4">
            <Text className="text-blue-500">
              Already have an account? Login
            </Text>
          </Link>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

export default Register;
