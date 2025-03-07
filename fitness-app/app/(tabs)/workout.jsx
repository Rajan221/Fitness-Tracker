import {
  View,
  Text,
  Dimensions,
  Pressable,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";

import axios from "axios";
import BASE_URL from "../urls";
import getUserId from "../user/getUser";
import AntDesign from "@expo/vector-icons/AntDesign";

const predefinedWorkouts = [
  //predefined workout list
  { name: "Running", duration: 30, heartrate: 140, temperature: 37 },
  { name: "Cycling", duration: 45, heartrate: 130, temperature: 36.5 },
  { name: "Weight Lifting", duration: 60, heartrate: 120, temperature: 37.2 },
  { name: "Yoga", duration: 40, heartrate: 110, temperature: 36.8 },
  { name: "Bench Press", duration: 45, heartrate: 125, temperature: 37.1 },
  { name: "Squats", duration: 50, heartrate: 135, temperature: 37 },
  { name: "Deadlift", duration: 55, heartrate: 130, temperature: 37.3 },
  { name: "Pull-ups", duration: 30, heartrate: 140, temperature: 37.2 },
  { name: "Push-ups", duration: 25, heartrate: 120, temperature: 36.9 },
  { name: "Lunges", duration: 35, heartrate: 125, temperature: 37.1 },
  { name: "Leg Press", duration: 50, heartrate: 130, temperature: 37.2 },
  { name: "Bicep Curls", duration: 40, heartrate: 120, temperature: 36.8 },
  { name: "Tricep Dips", duration: 30, heartrate: 115, temperature: 36.7 },
  { name: "Shoulder Press", duration: 40, heartrate: 130, temperature: 37 },
  { name: "Lat Pulldown", duration: 45, heartrate: 125, temperature: 37.1 },
  { name: "Barbell Row", duration: 50, heartrate: 135, temperature: 37.2 },
  { name: "Leg Curls", duration: 40, heartrate: 125, temperature: 37 },
  { name: "Ab Crunches", duration: 30, heartrate: 120, temperature: 36.9 },
  {
    name: "Mountain Climbers",
    duration: 30,
    heartrate: 145,
    temperature: 37.3,
  },
];

const Workout = () => {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDuration, setWorkoutDuration] = useState("");
  const [workoutHeartRate, setWorkoutHeartRate] = useState("");
  const [workoutTemperature, setWorkoutTemperature] = useState("");
  const [userId, setUserId] = useState("");
  const [totalCaloriesToday, setTotalCaloriesToday] = useState(0);
  const [recommededCaloriesBurn, setRecommededCaloriesBurn] = useState(0);

  //show more ra less ko functions
  const [visibleWorkouts, setVisibleWorkouts] = useState(6); // Show 6 initially
  const handleShowMoreWorkouts = () => {
    setVisibleWorkouts((prev) => prev + 6); // Increase by 6
  };

  const handleShowLessWorkouts = () => {
    setVisibleWorkouts(6); // Reset to initial count
  };
  //show more ra less ko functions

  const [predictedCalories, setPredictedCalories] = useState({
    Gender: "Male",
    Age: 30,
    Height: 175,
    Weight: 70,
    Duration: 60,
    Heart_Rate: 150,
    Body_Temp: 37.5,
  });

  //refresh function
  const [refreshing, setRefreshing] = useState(false); // State to track refresh status

  const handleRefresh = async () => {
    setRefreshing(true);
    if (userId) {
      await fetchData();
      await recommendedCaloriesBurn();
    }
    setVisibleWorkouts(6);
    setRefreshing(false);
  };

  //refresh function

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/workout`, {
        params: { user_id: userId },
      });
      setData(response.data);

      // Filter workouts for today and calculate total calories burned
      const today = new Date().toISOString().split("T")[0];
      const todayWorkouts = response.data.filter(
        (workout) => workout.date === today
      );

      const totalCalories = todayWorkouts.reduce(
        (acc, workout) => acc + parseFloat(workout.calories) || 0,
        0
      );

      setTotalCaloriesToday(totalCalories.toFixed(2));
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  //workout add hune here after adding predict calorie here also
  const handleAddWorkout = async () => {
    if (
      !workoutName ||
      !workoutDuration ||
      !workoutHeartRate ||
      !workoutTemperature
    ) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (workoutDuration > 250 || workoutDuration < 1) {
      Alert.alert("Error", "Duration must be with in 1-250.");
      return;
    }
    if (workoutHeartRate > 300 || workoutHeartRate < 30) {
      Alert.alert("Error", "Heart Rate must be with in 30-300.");
      return;
    }
    if (workoutTemperature > 70 || workoutTemperature < 10) {
      Alert.alert("Error", "Temperature must be in range of 10-70.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    const newWorkout = {
      name: workoutName,
      duration: workoutDuration,
      heartrate: workoutHeartRate,
      temperature: workoutTemperature,
      date: today,
      user_id: userId,
      calories: 0,
    };

    // Prediction ko lagi chaine datas
    predictedCalories.Duration = parseInt(workoutDuration);
    predictedCalories.Heart_Rate = parseInt(workoutHeartRate);
    predictedCalories.Body_Temp = parseFloat(workoutTemperature);

    try {
      // ML prediction API call
      const prediction = await axios.post(
        `${BASE_URL}/custom`,
        predictedCalories,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      newWorkout.calories = prediction.data.calories_burned.toFixed(2); // ml le deko data

      // Post workout after getting prediction
      const response = await axios.post(`${BASE_URL}/workout`, newWorkout);
      Alert.alert("Success", "Workout added successfully!");
      fetchData();
      setModalVisible(false);
      setWorkoutName("");
      setWorkoutDuration("");
      setWorkoutHeartRate("");
      setWorkoutTemperature("");
    } catch (error) {
      Alert.alert("Error", "Failed to add workout. Please try again.");
    }
  };
  //workout add hune here after adding predict calorie here also

  //predefined thichexi fields ma add hunxa
  const selectPredefinedWorkout = (workout) => {
    setWorkoutName(workout.name);
    setWorkoutDuration(workout.duration.toString());
    setWorkoutHeartRate(workout.heartrate.toString());
    setWorkoutTemperature(workout.temperature.toString());
    setModalVisible(true);
  };
  //predefined thichexi fields ma add hunxa

  //ID local storage bata lyauxa
  const getID = async () => {
    const userId = await getUserId();
    if (userId) {
      console.log("User ID:", userId);
    } else {
      console.log("User is not logged in.");
    }
    setUserId(userId);
  };
  //ID local storage bata lyauxa

  //burn garnu parni calorie recommend function
  const recommendedCaloriesBurn = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user`, {
        params: { user_id: userId },
      });

      let recommended_calories = parseFloat(
        response.data.recommended_calories.toFixed(2)
      );
      const bmr = response.data.bmr;
      const goal = response.data.goal;

      // Getting data for prediction
      predictedCalories.Gender = response.data.gender;
      predictedCalories.Age = response.data.age;
      predictedCalories.Height = response.data.height;
      predictedCalories.Weight = response.data.weight;

      // Calculate calories_burn based on goal
      let calories_burn;
      if (goal === "Lose Weight") {
        calories_burn = recommended_calories + 500 - bmr;
      } else if (goal === "Gain Weight") {
        calories_burn = recommended_calories - 500 - bmr;
      } else {
        calories_burn = recommended_calories - bmr;
      }

      setRecommededCaloriesBurn(calories_burn.toFixed(2));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  //burn garnu parni calorie recommend function

  useEffect(() => {
    getID();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchData();
      recommendedCaloriesBurn();
    }
  }, [userId]);

  const groupedData = data.reduce((acc, workout) => {
    if (!acc[workout.date]) {
      acc[workout.date] = [];
    }
    acc[workout.date].push(workout);
    return acc;
  }, {});

  const todayDate = new Date().toISOString().split("T")[0];

  const handleRemoveWorkout = (id, name) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this workout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              Alert.alert("Removing workout", `name: ${name}`);
              const response = await axios.delete(`${BASE_URL}/workout/${id}`);
              fetchData();
              Alert.alert("Success", "Workout deleted successfully");
            } catch (error) {
              Alert.alert(
                "Error",
                error.response?.data?.error || error.message
              );
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      className="p-5"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <Text className="text-2xl font-bold">Workout Progress</Text>

      <View className="mt-3 flex flex-row justify-between gap-2 ">
        <Text className="text-lg w-1/2  bg-[#176264] text-white p-3 rounded-md">
          Expected Calories to Burn: {"\n"}
          <Text className="font-bold text-center">
            {recommededCaloriesBurn}
          </Text>
        </Text>
        <Text className="text-lg w-1/2  bg-[#176264] text-white p-3 rounded-md">
          Total calories burned today through workout: {"\n"}
          <Text className="font-bold text-center">{totalCaloriesToday}</Text>
        </Text>
      </View>

      <Text className="text-lg my-5">
        (The Workout Details can be average of the workout, for such as workouts
        of multiple sets)
      </Text>

      <View className="mt-3">
        <Text className="text-xl">Workouts</Text>
        <View className="flex flex-row flex-wrap justify-between">
          {predefinedWorkouts
            .slice(0, visibleWorkouts)
            .map((workout, index) => (
              <Pressable
                key={index}
                className="bg-gray-500  p-3 rounded-lg mt-2 w-[30%]"
                onPress={() => selectPredefinedWorkout(workout)}
              >
                <Text className="text-white text-xl font-bold text-center">
                  {workout.name}
                </Text>
              </Pressable>
            ))}
        </View>

        {visibleWorkouts < predefinedWorkouts.length ? (
          <Pressable
            className="bg-[#176264] px-5 py-2 rounded-full mt-4 mx-auto"
            onPress={handleShowMoreWorkouts}
          >
            <Text className="text-white text-center">Show More</Text>
          </Pressable>
        ) : (
          <Pressable
            className="bg-gray-500 px-5 py-2 rounded-full mt-4 mx-auto"
            onPress={handleShowLessWorkouts}
          >
            <Text className="text-white text-center">Show Less</Text>
          </Pressable>
        )}
      </View>

      <Pressable
        className="bg-[#176264] w-40 px-5 py-4 rounded-full mt-2"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white text-center">Add Workout</Text>
      </Pressable>

      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center">
          <View className="bg-white p-6 rounded-lg w-80">
            <Text className="text-xl font-bold">Add Workout</Text>
            <TextInput
              className="border-b-2 mt-4 p-2"
              placeholder="Workout Name"
              value={workoutName}
              onChangeText={setWorkoutName}
            />
            <TextInput
              className="border-b-2 mt-4 p-2"
              placeholder="Duration (Minutes)"
              value={workoutDuration}
              onChangeText={setWorkoutDuration}
              keyboardType="numeric"
            />
            <TextInput
              className="border-b-2 mt-4 p-2"
              placeholder="Heart Rate (Bpm)"
              value={workoutHeartRate}
              onChangeText={setWorkoutHeartRate}
              keyboardType="numeric"
            />
            <TextInput
              className="border-b-2 mt-4 p-2"
              placeholder="Temperature (F)"
              value={workoutTemperature}
              onChangeText={setWorkoutTemperature}
              keyboardType="numeric"
            />
            <Pressable
              className="bg-[#176264] px-5 py-2 rounded-full mt-4"
              onPress={handleAddWorkout}
            >
              <Text className="text-white text-center">Add</Text>
            </Pressable>
            <Pressable
              className="bg-gray-500 px-5 py-2 rounded-full mt-2"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-white text-center">Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {Object.keys(groupedData).length === 0 ? (
        <Text className="text-center mt-5">No Workout</Text>
      ) : (
        Object.keys(groupedData)
          .sort((a, b) => new Date(b) - new Date(a))
          .map((date, index) => (
            <View key={index} className="mt-5">
              <Text className="text-xl font-bold mb-2">
                {date === todayDate ? "Today" : date}
              </Text>
              {groupedData[date]
                .slice() // Create a copy of the array to avoid mutating the original
                .reverse() // Reverse the order so latest comes first
                .map((workout, i) => (
                  <View
                    key={i}
                    className="bg-[#176264] rounded-lg p-3 mt-2 w-80 mx-auto"
                  >
                    <Pressable
                      onPress={() =>
                        handleRemoveWorkout(workout._id, workout.name)
                      }
                    >
                      <AntDesign name="delete" size={24} color="red" />
                    </Pressable>
                    <Text className="text-white text-center font-bold">
                      Workout Name: {workout.name}
                    </Text>
                    <Text className="text-white text-center font-bold">
                      Duration: {workout.duration} Minutes
                    </Text>
                    <Text className="text-white text-center font-bold">
                      Heart Rate: {workout.heartrate} Bpm
                    </Text>
                    <Text className="text-white text-center font-bold">
                      Temperature: {workout.temperature} C
                    </Text>
                    <Text className="text-white text-center font-bold">
                      Actual Calorie: {workout.calories} kcal
                    </Text>
                  </View>
                ))}
            </View>
          ))
      )}

      <View className="h-40"></View>
    </ScrollView>
  );
};

export default Workout;
