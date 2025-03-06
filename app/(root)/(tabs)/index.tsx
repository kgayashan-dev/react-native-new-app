import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { ChevronRight } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Get screen dimensions
const { width, height } = Dimensions.get("window");

export default function Index() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem("session_token");
      if (!storedToken) {
        router.replace("/"); // Redirect if not logged in
      } else {
        setToken(storedToken);
      }
    };

    getToken();
  }, []);

  const handleNavigation = () => {
    router.push("/login");
  }; // 300ms delay
  return (
    <View className="flex-1 bg-white">
      {/* Gradient Background */}
      <LinearGradient
        colors={["#FFFFFF", "#E6F2FF"]}
        className="absolute left-0 right-0 top-0 bottom-0"
      />

      {/* Content Container */}
      <SafeAreaView className="flex-1 z-10">
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: height * 0.05,
            paddingHorizontal: width * 0.05,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View className="items-center" style={{ marginTop: height * 0.05 }}>
            <Text className="text-4xl font-black text-blue-900">
              PEOPLE'S CREDIT
            </Text>
            <Text className="text-2xl font-light text-blue-500 mb-5">
              SOLUTIONS
            </Text>
          </View>

          {/* Logo Section with Blur Effect */}
          <View
            className="rounded-xl overflow-hidden border border-blue-500 mb-8 self-center"
            style={{ width: width * 0.7, height: height * 0.3 }}
          >
            {Platform.OS === "ios" ? (
              <BlurView
                intensity={30}
                className="flex-1 rounded-xl overflow-hidden"
              >
                {/* <Image
                  source={require("../assets/images/")}
                  className="w-full h-full rounded-xl"
                  resizeMode="contain"
                /> */}
              </BlurView>
            ) : (
              <View className="flex-1 rounded-xl overflow-hidden">
                <Image
                  source={require("../../../assets/images/image.png")}
                  className="w-full h-full rounded-xl"
                  resizeMode="contain"
                />
              </View>
            )}
          </View>

          {/* Motivational Text */}
          <View className="items-center my-5">
            <Text className="text-2xl font-bold text-blue-900 text-center mb-2">
              Empowering Your Financial Journey{token}
            </Text>
            <Text className="text-base text-blue-500 text-center px-5">
              Seamless, Secure, and Smart Financial Solutions
            </Text>
          </View>

          {/* Get Started Button */}
          <TouchableOpacity
            className="mt-8"
            style={{ width: width * 0.7 }}
            onPress={handleNavigation}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={["#2196F3", "#0D47A1"]}
              className="flex-row items-center justify-between py-4 px-6 rounded-full"
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text className="text-white text-lg font-bold">Get Started</Text>
              <ChevronRight color="white" size={24} />
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      {/* Bottom Wave Decoration */}
      <View className="absolute bottom-0 left-0 right-0 h-24 bg-transparent">
        <View className="flex-1 bg-white rounded-t-[50px] shadow-lg shadow-blue-500/30" />
      </View>
    </View>
  );
}
