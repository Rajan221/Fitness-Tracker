import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Pressable,
  Alert,
  TextInput,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { LineChart, ProgressChart } from "react-native-chart-kit";
import BASE_URL from "../urls";
import getUserId from "../user/getUser";
import axios from "axios";

//chart ko config
const config = {
  backgroundColor: "#e26a00",
  backgroundGradientFrom: "#333",
  backgroundGradientTo: "#999",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#ffa726",
  },
};
//chart ko config

const Home = () => {
  const [data, setData] = useState(""); // user ko data

  //user ko data in detail or in single state
  const [userId, setUserId] = useState("");
  const [bmi, setBmi] = useState("");
  const [bmr, setBmr] = useState("");
  const [userName, setUserName] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [goal, setGoal] = useState("");
  const [weightHistory, setWeightHistory] = useState([]);
  //user ko data in detail or in single state

  const [dates, setDates] = useState([]); //date store gareko

  // refresh functions to refresh
  const [isRefreshing, setIsRefreshing] = useState(false); // refresh state

  const refreshData = async () => {
    //kun kun function to call when refresh
    setIsRefreshing(true);
    await getName();
    await getTodayTotalCalories();
    await getWeightHistory();
    await getTodayTotalCalories();
    await calculateExpense();
    setIsRefreshing(false);
  };
  // refresh functions to refresh

  //weight add garni function
  const handleWeightSubmittion = async () => {
    if (weight) {
      try {
        await axios.post(`${BASE_URL}/weight-history`, {
          //weight add in weight history
          user_id: userId,
          weight: weight,
          date: new Date().toISOString().split("T")[0],
        });

        await axios.patch(`${BASE_URL}/user/${userId}`, {
          // weight rakexi aru kura update hunxa such as bmi bmr
          weight: weight,
          height: height,
          goal: goal,
          activityLevel: activityLevel,
        });

        getName();

        Alert.alert(
          "Success",
          "Weight has been added and updated successfully!"
        );
        setWeight(""); // Clear input field
        getWeightHistory(); // Refresh weight history
        getName(); // Refresh user data to show updated weight
      } catch (error) {
        console.error("Error adding/updating weight:", error);
        Alert.alert("Error", "Failed to add/update weight. Please try again.");
      }
    } else {
      Alert.alert("Error", "Please enter a valid weight.");
    }
  };

  //weight add garni function

  // weight history to put in weight chart
  const getWeightHistory = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/weight-history`, {
        params: { user_id: userId },
      });

      const weightData = response.data;
      if (!Array.isArray(weightData) || weightData.length === 0) {
        console.log("No weight data available or invalid format.");
        return;
      }

      const last7Days = weightData.slice(-7); // 7 din ko matra

      const weightArray = last7Days.map((item) => {
        const weight = parseFloat(item.weight);
        return isNaN(weight) ? 0 : weight; // Weight as a number
      });

      const dateArray = last7Days.map((item) => {
        const date = new Date(item.date);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${month < 10 ? "0" : ""}${month}-${day < 10 ? "0" : ""}${day}`;
      });

      setWeightHistory(weightArray);
      setDates(dateArray);
    } catch (error) {
      console.log("Error fetching weight history:", error);
    }
  };

  // refresh just for golo wala chart
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshChart = () => {
    setRefreshKey((prevKey) => prevKey + 1);
    getTodayTotalCalories();
    calculateExpense();
  };
  // refresh just for golo wala chart

  //intake
  const [recommededCalories, setRecommededCalories] = useState(0);
  const [totalCalories, setTotalCalories] = useState(null);
  const [intake, setIntake] = useState(0);

  //golo chart ko lagi states

  const [totalCaloriesToday, setTotalCaloriesToday] = useState(0);
  const [recommededCaloriesBurn, setRecommededCaloriesBurn] = useState(0);
  const [expense, setExpense] = useState(0);

  const calorieAnalysisData = {
    //golo chart label and value

    labels: ["Intake", "Expend"],
    data: [intake, expense],
  };
  //golo chart ko lagi states

  //function to get user id from local storage
  const getID = async () => {
    const userId = await getUserId();
    if (userId) {
    } else {
      console.log("User is not logged in.");
    }
    setUserId(userId);
  };
  //function to get user id from local storage

  //get name vayeni aru data ni leko xa
  const getName = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user`, {
        //user ko data from api
        params: { user_id: userId },
      });

      // set in individual variables for easy solo modifications
      setUserName(response.data.firstName);
      setBmi(response.data.bmi);
      setBmr(response.data.bmr);
      setHeight(response.data.height);
      setGoal(response.data.goal);
      setActivityLevel(response.data.activityLevel);
      setRecommededCalories(response.data.recommended_calories); //RECOMMENDED CALORIES INTAKE SIDHAI DB BATA
      // set in individual variables for easy solo modifications
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  //get name vayeni aru data ni leko xa

  const getTodayTotalCalories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/food/calories/history`, {
        params: { user_id: userId },
      });

      const data = response.data;

      const todayDate = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

      const todayData = data.find((item) => item.date === todayDate);

      if (todayData) {
        console.log("Today's Calories:", todayData.total_calories);
        setTotalCalories(todayData.total_calories);
      } else {
        console.log("No calories logged for today.");
        setTotalCalories(0);
      }
    } catch (error) {
      console.log("Error fetching today's calories:", error);
    }
  };

  //ID LEKO REFRESH
  useEffect(() => {
    getID();
  }, []);
  //ID LEKO REFRESH

  //NAME, TOTAL calorie ra, WEIGHT HISTORY REFRESH
  useEffect(() => {
    if (userId) {
      getName();
      getTodayTotalCalories();
      getWeightHistory();
    }
  }, [userId]);
  //NAME, TOTAL calorie ra, WEIGHT HISTORY REFRESH

  //INTAKE REFRESH
  useEffect(() => {
    if (totalCalories !== null && recommededCalories > 0) {
      //verify before calling function
      calculateIntake();
    }
  }, [totalCalories, recommededCalories]);
  //INTAKE REFRESH

  //EXPEND REFRESH
  useEffect(() => {
    if (totalCaloriesToday !== null && recommededCaloriesBurn > 0) {
      calculateExpense();
    }
  }, [totalCaloriesToday, recommededCaloriesBurn]);
  //EXPEND REFRESH

  //intake ko value find out total
  const calculateIntake = () => {
    if (totalCalories !== null && recommededCalories > 0) {
      const intakeValue = totalCalories / recommededCalories;
      const cappedIntakeValue = Math.min(intakeValue, 1); // Ensure it doesn't exceed 1
      setIntake(cappedIntakeValue);
      console.log("Updated Intake:", cappedIntakeValue);
    } else {
      setIntake(0);
    }
  };

  //intake ko value find out

  // EXPENSE KO FUNCTIONS YETAAAAAAAAA *************************
  //expense ko value find garni
  const calculateExpense = () => {
    if (totalCaloriesToday !== null && recommededCaloriesBurn > 0) {
      const expenseValue = totalCaloriesToday / recommededCaloriesBurn;
      const cappedExpenseValue = Math.min(expenseValue, 1); // Ensure it doesn't exceed 1
      setExpense(cappedExpenseValue);
      console.log("Updated Expense:", cappedExpenseValue);
      fetchCalorieExpense();
      recommededCaloriesBurn;
    } else {
      setExpense(0);
    }
  };

  //expense ko value find garni

  //total/recommend for burn ko TOTAL
  const fetchCalorieExpense = async () => {
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
  //total/recommend for burn ko TOTAL

  //total/recommend for burn ko RECOMMEND
  const recommendedCaloriesBurn = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user`, {
        params: { user_id: userId },
      });

      let recommended_calories = parseFloat(response.data.recommended_calories);
      const bmr = parseFloat(response.data.bmr);
      const goal = response.data.goal;

      if (goal === "Lose Weight") {
        recommended_calories += 500;
      } else if (goal === "Gain Weight") {
        recommended_calories -= 500;
      }

      const calories_burn = recommended_calories - bmr;
      setRecommededCaloriesBurn(calories_burn.toFixed(2));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  //total/recommend for burn ko RECOMMEND

  //total/recommend for expense ko duitai refresh gareko
  useEffect(() => {
    if (userId) {
      fetchCalorieExpense();
      recommendedCaloriesBurn();
    }
  }, [userId]);
  //total/recommend for expense ko duitai refresh gareko

  // EXPENSE KO FUNCTIONS YETAAAAAAAAA *************************

  //bmi label function yeha xa
  const getBmiCategory = (bmi) => {
    const bmiValue = parseFloat(bmi);
    if (isNaN(bmiValue) || bmiValue <= 0) return "Invalid BMI";

    if (bmiValue < 18.5) return "Underweight";
    if (bmiValue >= 18.5 && bmiValue < 24.9) return "Normal weight";
    if (bmiValue >= 25 && bmiValue < 29.9) return "Overweight";
    return "Obese";
  };
  //bmi label function yeha xa

  return (
    <ScrollView
      nestedScrollEnabled={true}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={refreshData} />
      }
    >
      <ImageBackground
        source={{
          uri: "https://img.freepik.com/premium-photo/fit-guy-doing-pushups-atmospheric-gym_1101231-30478.jpg?w=740",
        }}
        className="bg-gray-500 h-64"
        resizeMode="cover"
      >
        <SafeAreaView
          className="pt-10 px-10"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", flex: 1 }}
        >
          <View className="flex items-center justify-between flex-row">
            <View>
              <Text className="font-semibold text-xl text-white">Home</Text>
            </View>

            <View>
              <Ionicons name="notifications" size={30} color="white" />
            </View>
          </View>
          <View className="mt-3">
            <Text className="text-2xl text-white">Welcome back,</Text>
            <Text className="text-4xl font-bold text-white">
              {userName || "User"}
            </Text>
          </View>
        </SafeAreaView>
      </ImageBackground>

      {/* Regular Exercise Card */}
      <View className="bg-yellow-300 mt-10 rounded-lg p-6 mb-6 shadow-lg mx-5">
        <Text className="text-2xl font-bold text-gray-800">
          Importance of Regular Exercise
        </Text>
        <Text className="text-xl text-gray-700 mt-2">
          Regular physical activity is one of the most important things you can
          do for your health. It has a direct impact on your overall well-being
          and helps reduce the risk of chronic diseases like heart disease,
          diabetes, and cancer.
        </Text>
      </View>

      <View className="px-5 pt-5">
        <Text className="text-2xl bg-[#176264] text-white text-center rounded-lg py-3">
          Your Bmi: {bmi}
        </Text>
        <Text className="text-xl text-center mt-2 text-gray-700">
          {getBmiCategory(bmi)}
        </Text>

        <Text className="text-xl mt-10">Your Weight Progress this Week</Text>
        {/* <View className="flex items-center justify-between">
          <LineChart
            data={{
              labels: ["January", "February", "March", "April", "May", "June"],
              datasets: [
                {
                  data: [
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                    Math.random() * 100,
                  ],
                },
              ],
            }}
            width={Dimensions.get("window").width - 30}
            height={220}
            yAxisSuffix="KG"
            yAxisInterval={1}
            chartConfig={config}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View> */}

        {weightHistory.length > 0 ? (
          <View className="flex items-center justify-between">
            <LineChart
              data={{
                labels: dates, // Use dates here
                datasets: [
                  {
                    data: weightHistory, // Use weightHistory here
                  },
                ],
              }}
              width={Dimensions.get("window").width - 30}
              height={220}
              yAxisSuffix="KG"
              yAxisInterval={1}
              chartConfig={config}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
        ) : (
          <Text>No valid weight history available</Text> // Display message if no valid weight history
        )}

        <View className="mt-5">
          <Text className="text-xl">Today Weight</Text>

          <TextInput
            className="bg-gray-300 text-black w-80 px-5 py-3 rounded-lg "
            placeholder="Weight"
            value={weight} // Bind the state here
            onChangeText={setWeight} // Update state when user types
            keyboardType="numeric" // Ensure numeric input
          />
          <Pressable
            className="bg-[#176264] w-40 px-5 py-4 rounded-full mt-2"
            onPress={handleWeightSubmittion}
          >
            <Text className="text-white text-center">Add Weight</Text>
          </Pressable>
        </View>

        <Text className="text-xl mt-10">Today Calorie Analysis</Text>
        <View className="">
          <Pressable onPress={refreshChart}>
            <ProgressChart
              data={calorieAnalysisData}
              width={Dimensions.get("window").width - 40}
              height={220}
              strokeWidth={16}
              radius={32}
              chartConfig={config}
              hideLegend={false}
            />
          </Pressable>
        </View>
      </View>

      {/* Fit vs Healthy */}
      <View className="px-5 py-10   bg-cyan-200 rounded-lg mt-20 mx-5">
        <Text className="text-2xl font-bold">
          Does being healthy and being fit mean the same thing?
          {"\n"}
        </Text>
        <Text className="text-xl ">
          The World Health Organization (WHO) defines health as:
        </Text>
        <Text className="text-lg italic">
          "A state of complete physical, mental, and social well-being and not
          merely the absence of disease or infirmity" (WHO, 1948).
          {"\n"}
          {"\n"}
        </Text>

        <Text className="text-xl ">
          The American College of Sports Medicine (ACSM) defines physical
          fitness as:
        </Text>
        <Text className="text-lg italic">
          "The ability to carry out daily tasks with vigor and alertness,
          without undue fatigue, and with ample energy to enjoy leisure-time
          pursuits and to meet unforeseen emergencies" (ACSM, 2017).
        </Text>
      </View>

      {/* Benefits of Staying Active */}
      <View className="bg-green-300 rounded-lg p-6 mb-6 shadow-lg mx-5">
        <Text className="text-2xl font-bold text-gray-800">
          Benefits of Staying Active
        </Text>
        <Text className="text-lg italic text-gray-700 mt-2">
          1. Boosts mood and reduces stress and anxiety
        </Text>
        <Text className="text-lg italic text-gray-700 mt-2">
          2. Increases strength and endurance
        </Text>
        <Text className="text-lg italic text-gray-700 mt-2">
          3. Improves heart health and circulation
        </Text>
        <Text className="text-lg italic text-gray-700 mt-2">
          4. Supports weight management and metabolism
        </Text>
        <Text className="text-lg italic text-gray-700 mt-2">
          5. Enhances flexibility and balance, reducing fall risks
        </Text>
      </View>

      {/* Nutritional Support Card */}
      <View className="bg-orange-300 rounded-lg p-6 mb-6 shadow-lg mx-5">
        <Text className="text-2xl font-bold text-gray-800">
          Nutritional Support for Fitness
        </Text>
        <Text className="text-xl text-gray-700 mt-2">
          Nutrition plays a key role in supporting physical fitness. Proper
          fueling before and after workouts can help enhance performance and
          recovery.
        </Text>
        <Text className="text-lg italic text-gray-700 mt-2">
          - Prioritize protein intake to repair and build muscle.
        </Text>
        <Text className="text-lg italic text-gray-700 mt-2">
          - Carbohydrates are essential for replenishing glycogen stores and
          providing energy during exercise.
        </Text>
        <Text className="text-lg italic text-gray-700 mt-2">
          - Healthy fats contribute to joint health and help with the absorption
          of vitamins.
        </Text>
      </View>

      {/* Hydration Card */}
      <View className="bg-blue-300 rounded-lg p-6 mb-6 shadow-lg mx-5">
        <Text className="text-2xl font-bold text-gray-800">
          Staying Hydrated
        </Text>
        <Text className="text-xl text-gray-700 mt-2">
          Hydration is key to maximizing performance and recovery. Ensure you're
          drinking enough water throughout the day, especially during and after
          exercise.
        </Text>
        <Text className="text-xl text-gray-700 mt-4">
          Recommended Daily Water Intake:
        </Text>
        <Text className="text-lg italic text-gray-700 mt-2">
          - Men: About 3.7 liters (125 ounces) of total water from all beverages
          and foods.
        </Text>
        <Text className="text-lg italic text-gray-700 mt-2">
          - Women: About 2.7 liters (91 ounces) of total water from all
          beverages and foods.
        </Text>
      </View>

      {/* Sleep and Recovery Card */}
      <View className="bg-purple-300 rounded-lg p-6 mb-6 shadow-lg mx-5">
        <Text className="text-2xl font-bold text-gray-800">
          Sleep and Recovery
        </Text>
        <Text className="text-xl text-gray-700 mt-2">
          Adequate sleep is crucial for recovery, muscle growth, and performance
          improvement. Aim for 7-9 hours of quality sleep each night to help
          your body repair and rebuild after workouts.
        </Text>
        <Text className="text-lg italic text-gray-700 mt-2">
          - Sleep helps regulate hormones that control appetite and metabolism.
        </Text>
        <Text className="text-lg italic text-gray-700 mt-2">
          - Consistent sleep patterns improve mood and energy levels.
        </Text>
      </View>

      {/* ADD SPACE IN BOTTOM */}
      <View className="h-40"></View>
    </ScrollView>
  );
};

export default Home;
