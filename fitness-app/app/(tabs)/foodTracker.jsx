import {
  View,
  Text,
  Dimensions,
  Pressable,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  RefreshControl, // Import RefreshControl
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../urls";
import getUserId from "../user/getUser";
import AntDesign from "@expo/vector-icons/AntDesign";

const predefinedFoods = [
  //predefined foods ko data list
  { name: "Rice (White)", caloriesPer100g: 130 },
  { name: "Brown Rice", caloriesPer100g: 112 },
  { name: "Chicken Breast", caloriesPer100g: 165 },
  { name: "Chicken Thigh", caloriesPer100g: 209 },
  { name: "Apple", caloriesPer100g: 52 },
  { name: "Banana", caloriesPer100g: 89 },
  { name: "Orange", caloriesPer100g: 47 },
  { name: "Broccoli", caloriesPer100g: 55 },
  { name: "Carrot", caloriesPer100g: 41 },
  { name: "Egg (Boiled)", caloriesPer100g: 155 },
  { name: "Fish (Salmon)", caloriesPer100g: 208 },
  { name: "Fish (Tuna)", caloriesPer100g: 144 },
  { name: "Beef", caloriesPer100g: 250 },
  { name: "Pork", caloriesPer100g: 242 },
  { name: "Tofu", caloriesPer100g: 76 },
  { name: "Milk (Whole)", caloriesPer100g: 61 },
  { name: "Milk (Skimmed)", caloriesPer100g: 35 },
  { name: "Yogurt (Plain)", caloriesPer100g: 59 },
  { name: "Cheese (Cheddar)", caloriesPer100g: 402 },
  { name: "Almonds", caloriesPer100g: 579 },
  { name: "Peanuts", caloriesPer100g: 567 },
  { name: "Cashews", caloriesPer100g: 553 },
  { name: "Oats", caloriesPer100g: 389 },
  { name: "Bread (Whole Wheat)", caloriesPer100g: 247 },
  { name: "Pasta (Cooked)", caloriesPer100g: 131 },
  { name: "Sweet Potato", caloriesPer100g: 86 },
  { name: "Potato", caloriesPer100g: 77 },
  { name: "Avocado", caloriesPer100g: 160 },
  { name: "Strawberries", caloriesPer100g: 32 },
  { name: "Blueberries", caloriesPer100g: 57 },
];

const FoodTracker = () => {
  const [foodData, setFoodData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [foodName, setFoodName] = useState("");
  const [foodAmount, setFoodAmount] = useState("");
  const [foodCalories, setFoodCalories] = useState("");
  const [userId, setUserId] = useState("");
  const [recommededCalories, setRecommededCalories] = useState(0);
  const [consumedCalories, setConsumedCalories] = useState(10200);
  const [totalCalories, setTotalCalories] = useState(null);

  //refresh logic
  const [refreshing, setRefreshing] = useState(false); // State to manage refreshing

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    await getTodayTotalCalories();
    await getName();
    setVisibleFoods(6);
    setRefreshing(false); // End refreshing
  };
  //refresh logic

  //show more ra less ko logic
  const [visibleFoods, setVisibleFoods] = useState(6);

  const handleShowMore = () => {
    setVisibleFoods((prev) => prev + 6);
  };

  const handleShowLess = () => {
    setVisibleFoods(6);
  };

  //show more ra less ko logic

  //food ko data fetch garya
  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/food`, {
        params: { user_id: userId },
      });

      const groupedData = response.data.reduce((acc, food) => {
        (acc[food.date] = acc[food.date] || []).push(food);
        return acc;
      }, {});

      // Sort each date's food list in descending order
      Object.keys(groupedData).forEach((date) => {
        groupedData[date].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      });

      // Sort dates in descending order
      const sortedGroupedData = Object.fromEntries(
        Object.entries(groupedData).sort(
          ([dateA], [dateB]) => new Date(dateB) - new Date(dateA)
        )
      );

      setFoodData(sortedGroupedData);
    } catch (error) {
      console.log("Error", error.message);
    }
  };
  //food ko data fetch garya

  //food add garni function
  const handleAddFood = async () => {
    if (!foodName || !foodAmount || !foodCalories) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (foodAmount > 4000 || foodAmount < 5) {
      Alert.alert("Error", "Amount must be with in 5-4000.");
      return;
    }
    if (foodCalories > 4000 || foodCalories < 5) {
      Alert.alert("Error", "Calories must be in range of 5-4000.");
      return;
    }

    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    const newFood = {
      name: foodName,
      amount: foodAmount,
      calories: foodCalories,
      date: formattedDate,
      user_id: userId,
    };

    try {
      const response = await axios.post(`${BASE_URL}/food`, newFood);
      Alert.alert("Success", "Food added successfully!");
      fetchData();
      setModalVisible(false);

      //empty the fields after added successfully
      setFoodName("");
      setFoodAmount("");
      setFoodCalories("");
      //empty the fields after added successfully

      getTodayTotalCalories(); //refresh total calories
    } catch (error) {
      Alert.alert("Error", "Failed to add food. Please try again.");
    }
  };
  //food add garni function

  const todayDate = new Date().toISOString().split("T")[0];

  const getName = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user`, {
        params: { user_id: userId },
      });

      setRecommededCalories(response.data.recommended_calories);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  //local storage bata id leko
  const getID = async () => {
    const userId = await getUserId();
    if (userId) {
      console.log("User ID:", userId);
    } else {
      console.log("User is not logged in.");
    }
    setUserId(userId);
  };
  //local storage bata id leko

  // total calories intake today yeha
  const getTodayTotalCalories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/food/calories/history`, {
        params: { user_id: userId },
      });

      const data = response.data;

      const todayData = data.find((item) => item.date === todayDate);

      if (todayData) {
        setTotalCalories(todayData.total_calories);
      } else {
        setTotalCalories(0);
      }
    } catch (error) {
      console.log("Error", "Failed to fetch today's total calories.");
    }
  };
  // total calories intake today yeha

  useEffect(() => {
    fetchData();

    getID();
  }, []);

  useEffect(() => {
    if (userId) {
      getName();
      getTodayTotalCalories();
      fetchData();
    }
  }, [userId]);

  //predefined food thichda add hune input field ma
  const handlePredefinedFoodSelection = (food) => {
    setFoodName(food.name);
    setFoodAmount("100");
    setFoodCalories(food.caloriesPer100g.toString());
    setModalVisible(true);
  };
  //predefined food thichda add hune input field

  const handleRemoveFood = (id, name) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this food item?",
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
              Alert.alert("Removing food item", `name: ${name}`);
              const response = await axios.delete(`${BASE_URL}/food/${id}`);
              fetchData();
              getTodayTotalCalories();
              Alert.alert("Success", "Food item deleted successfully");
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
      <Text className="text-2xl font-bold">Food Analysis</Text>

      <View className="mt-3 flex flex-row justify-between gap-2">
        <Text className="text-lg w-1/2 bg-[#176264] text-white p-3 rounded-md">
          Today's Calorie Recommendation: {"\n"}
          <Text className="font-bold text-center">{recommededCalories}</Text>
        </Text>
        <Text className="text-lg w-1/2 bg-[#176264] text-white p-3 rounded-md">
          Today's Calorie Consumed: {"\n"}
          <Text className="font-bold text-center">{totalCalories}</Text>
        </Text>
      </View>

      <Text className="text-lg my-5">
        (The food quality will matter for your health. Make sure what you are
        eating.)
      </Text>

      {recommededCalories > totalCalories ? (
        <Text className="text-xl font-bold text-green-700">
          You are ok on calorie
        </Text>
      ) : (
        <Text className="text-xl font-bold text-red-700">
          You are over calorie Recommendation
        </Text>
      )}

      <View className="mt-5">
        <Text className="text-xl">Today's Food Track</Text>

        <View className="mt-3 ">
          <View className="flex flex-row items-center gap-3">
            <Text className="text-xl">Foods List</Text>
            <Pressable
              className="bg-gray-400 px-3 py-1 rounded-full  mx-auto"
              onPress={handleShowLess}
            >
              <Text className="text-white text-center">-</Text>
            </Pressable>
          </View>
          <View className="flex flex-row flex-wrap justify-between">
            {predefinedFoods.slice(0, visibleFoods).map((food, index) => (
              <Pressable
                key={index}
                className="bg-gray-200 p-3 rounded-lg mt-2 w-[30%]"
                onPress={() => handlePredefinedFoodSelection(food)}
              >
                <Text className="text-xl font-bold text-center">
                  {food.name}
                </Text>
                <Text className="text-lg text-center">
                  {food.caloriesPer100g} kcal/100gm
                </Text>
              </Pressable>
            ))}
          </View>
          {visibleFoods < predefinedFoods.length ? (
            <Pressable
              className="bg-[#176264] px-5 py-2 rounded-full mt-4 mx-auto"
              onPress={handleShowMore}
            >
              <Text className="text-white text-center">Show More</Text>
            </Pressable>
          ) : (
            <Pressable
              className="bg-gray-500 px-5 py-2 rounded-full mt-4 mx-auto"
              onPress={handleShowLess}
            >
              <Text className="text-white text-center">Show Less</Text>
            </Pressable>
          )}
        </View>

        <Pressable
          className="bg-[#176264] w-40 px-5 py-4 rounded-full mt-5"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-white text-center">Add Custom Food Data</Text>
        </Pressable>
      </View>

      <Modal transparent={true} animationType="fade" visible={modalVisible}>
        <View className="flex-1 justify-center items-center">
          <View className="bg-white p-6 rounded-lg w-80">
            <Text className="text-xl font-bold">Add Food</Text>
            <TextInput
              className="border-b-2 mt-4 p-2"
              placeholder="Food Name"
              value={foodName}
              onChangeText={setFoodName}
            />
            <TextInput
              className="border-b-2 mt-4 p-2"
              placeholder="Amount (grams)"
              value={foodAmount}
              onChangeText={setFoodAmount}
              keyboardType="numeric"
            />
            <TextInput
              className="border-b-2 mt-4 p-2"
              placeholder="Calories (kcal)"
              value={foodCalories}
              onChangeText={setFoodCalories}
              keyboardType="numeric"
            />
            <Pressable
              className="bg-[#176264] px-5 py-2 rounded-full mt-4"
              onPress={handleAddFood}
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

      {Object.keys(foodData).length === 0 ? (
        <Text className="text-center mt-10">No food data available.</Text>
      ) : (
        Object.entries(foodData).map(([date, foods]) => (
          <View key={date} className="mt-5">
            <Text className="text-lg font-bold">
              {date === todayDate ? "Today" : date}
            </Text>
            {foods.map((food, index) => (
              <View
                key={index}
                className="bg-[#176264] rounded-lg mt-2 p-3 w-80 mx-auto"
              >
                <Pressable
                  onPress={() => handleRemoveFood(food._id, food.name)}
                >
                  <AntDesign name="delete" size={24} color="red" />
                </Pressable>
                <Text className="text-white text-center font-bold">
                  Food Name: {food.name}
                </Text>
                <Text className="text-white text-center font-bold">
                  Amount: {food.amount} grams
                </Text>
                <Text className="text-white text-center font-bold">
                  Calories: {food.calories} cal
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

export default FoodTracker;
