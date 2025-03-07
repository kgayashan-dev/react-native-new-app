import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const HomePage = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const handleGetStarted = () => {
    // Use the route name defined in your navigation stack
    router.push("/login");
  };

  return (
    <SafeAreaView className=" h-full">
      <ScrollView className="flex-1 bg-gradient-to-b from-blue-300 to-white">
        {/* Header Section */}
        <View className="bg-white shadow-md px-6 py-4 flex-row justify-center items-center">
          <Text className="text-2xl font-bold text-center text-blue-600">
            People's Credit Solution
          </Text>
          <Image className="w-10 h-10 rounded-full" />
        </View>

        {/* Hero Section */}
        <View className="px-6 py-12 items-center">
          <Text className="text-4xl font-bold text-gray-800 mb-4 text-center">
            Welcome to People's Credit Solution
          </Text>
          <Text className="text-gray-600 mb-8 text-center">
            Your trusted partner for financial solutions.
          </Text>
        </View>

        {/* Features Section */}
        <View className="px-6">
          <Text className="text-2xl font-bold text-gray-800 mb-6">
            Our Services
          </Text>
          <View className="space-y-2">
            <View className="bg-white p-6 rounded-lg shadow-sm">
              <Text className="text-lg font-bold text-gray-800">
                Loan Solutions
              </Text>
              <Text className="text-gray-600 mt-2">
                Get access to quick and affordable loans tailored to your needs.
              </Text>
            </View>
            <View className="bg-white p-6 rounded-lg shadow-sm">
              <Text className="text-lg font-bold text-gray-800">
                Credit Repair
              </Text>
              <Text className="text-gray-600 mt-2">
                Improve your credit score with our expert guidance.
              </Text>
            </View>
            <View className="bg-white p-6 rounded-lg shadow-sm">
              <Text className="text-lg font-bold text-gray-800">
                Financial Planning
              </Text>
              <Text className="text-gray-600 mt-2">
                Plan your finances effectively with our tools and advice.
              </Text>
            </View>
          </View>
        </View>
        <View className="px-6 py-2 items-center">
          {/* Get Started Button */}
          <TouchableOpacity
            onPress={handleGetStarted}
            className="bg-blue-600 px-8 py-3 rounded-lg"
          >
            <Text className="text-white font-bold text-lg">Get Started</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Section */}
        <View className="bg-blue-600 px-6 py-8 mt-8">
          <Text className="text-white text-center">
            © 2025 People's Credit Solution. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomePage;
