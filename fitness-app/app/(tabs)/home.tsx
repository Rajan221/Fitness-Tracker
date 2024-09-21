import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  Dimensions,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { LineChart, ProgressChart } from "react-native-chart-kit";

const Home = () => {
  return (
    <ScrollView nestedScrollEnabled={true}>
      <ImageBackground
        source={{
          uri: "https://img.freepik.com/premium-photo/fit-guy-doing-pushups-atmospheric-gym_1101231-30478.jpg?w=740",
        }}
        className="bg-gray-500 h-64"
        resizeMode="cover"
      >
        <SafeAreaView
          className=" pt-10 px-10 "
          style={{ backgroundColor: "rgba(0,0,0,0.6)", flex: 1 }}
        >
          <View className=" flex items-center justify-between flex-row">
            <View>
              <Text className="font-semibold text-xl text-white">Home</Text>
            </View>

            <View>
              <Ionicons name="notifications" size={30} color="white" />
            </View>
          </View>
          <View className="mt-3">
            <Text className="text-2xl text-white">Welcome back,</Text>
            <Text className="text-4xl font-bold text-white">Rajan</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
      <View className="px-5 pt-10">
        <Text className="text-xl">Your Progress this Week</Text>
        <View className="flex items-center justify-between">
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
            width={Dimensions.get("window").width - 30} // from react-native
            height={220}
            yAxisSuffix="KG"
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={config}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>

        <Text className="text-xl">Food Analysis</Text>
        <View>
          <ProgressChart
            data={data}
            width={Dimensions.get("window").width - 30}
            height={220}
            strokeWidth={16}
            radius={32}
            chartConfig={config}
            hideLegend={false}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;

const data = {
  labels: ["Protein", "Carbs", "Sugar"], // optional
  data: [0.8, 0.6, 0.2],
};
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
