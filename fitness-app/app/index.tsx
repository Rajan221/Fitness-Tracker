import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="text-4xl">My fitness</Text>
      <Link href="./login">
        <Text className="text-blue-500 ">Go to Logins</Text>
      </Link>

      <Link href="./register">
        <Text className="text-blue-500">Go to Register</Text>
      </Link>

      <Link href="./home">
        <Text className="text-blue-500">Go to Home</Text>
      </Link>
    </View>
  );
}
