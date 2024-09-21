import { View, Text, Dimensions } from "react-native";
import React from "react";

import { LineChart } from "react-native-chart-kit";

const Workout = () => {
  return (
    <View className=" p-5">
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
    </View>
  );
};

export default Workout;

const config = {
  backgroundColor: "#e26a00",
  backgroundGradientFrom: "#999",
  backgroundGradientTo: "#656b10",
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
