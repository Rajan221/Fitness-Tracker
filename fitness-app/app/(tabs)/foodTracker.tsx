import { View, Text, Dimensions, Pressable } from "react-native";
import React from "react";

import { ProgressChart } from "react-native-chart-kit";

const FoodTracker = () => {
  return (
    <View className="p-5">
      <Text className="text-xl">Food Analysis</Text>
      <View className="mt-3">
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
      <View className="mt-5">
        <Text className="text-xl">Today food track</Text>

        <Pressable className="bg-black w-40 px-5 py-4 rounded-full mt-2">
          <Text className="text-white text-center">Add food</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default FoodTracker;

const data = {
  labels: ["Protein", "Carbs", "Sugar"], // optional
  data: [0.8, 0.6, 0.2],
};
const config = {
  backgroundColor: "#e26a00",
  backgroundGradientFrom: "#2e3b66",
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
