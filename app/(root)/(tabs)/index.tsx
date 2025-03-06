import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View>
      <Text className="font-bold">welcome to reState</Text>
      <Link href="/login">Login </Link>

      {/* <Link href="/explore">Explore</Link> */}

      <Link href="/profile">Profile</Link>

      <Link href="/property/23">Property</Link>
    </View>
  );
}
