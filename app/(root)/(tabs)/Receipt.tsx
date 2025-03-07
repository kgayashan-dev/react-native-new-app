import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { MaterialIcons } from "@expo/vector-icons";
import { ChevronDown, ChevronLeft, User, Search } from "lucide-react-native";
import authUtils from "../../utils/authUtils";
import { useRouter } from "expo-router";
import HeaderComponet from "@/components/HeaderComponent";
import { useNavigation } from "@react-navigation/native";

const MFReceipt = () => {
  const [cashierBranch, setCashierBranch] = useState("");
  const [loanBranch, setLoanBranch] = useState("");
  const [center, setCenter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState<{ center?: string; search?: string }>(
    {}
  );
  const [apiStatus, setApiStatus] = useState("idle");
  const router = useRouter();

  // check the user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = await authUtils.getUserToken();
      if (!token) {
        router.push("/login");
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (center) {
      setApiStatus("loading");
      // Simulating API call to get branch data based on center
      setTimeout(() => {
        setCashierBranch("branch1");
        setLoanBranch("branchA");
        setApiStatus("success");
      }, 1000);
    }
  }, [center]);

  const handleSubmit = () => {
    const newErrors: { center?: string; search?: string } = {};

    if (!center) {
      newErrors.center = "Please select a center";
    }

    if (!searchQuery.trim()) {
      newErrors.search = "Please enter a username or ID";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setApiStatus("loading");

    // Simulating API call
    setTimeout(() => {
      console.log("Submitted:", {
        cashierBranch,
        loanBranch,
        center,
        searchQuery,
      });
      setApiStatus("success");
      Alert.alert("Success", "Receipt details fetched successfully");
      // Navigate to results page or show results
      // router.push("/receipt-results");
    }, 1500);
  };

  const handleBackPress = () => {
    Alert.alert("Confirm", "Are you sure you want to go back?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", onPress: () => router.replace("/") }, // Adjust the route
    ]);
    router.replace("/Receipt"); // this is not mandatory/ Reset the route as the developer uses web browser
  };

  const logOut = async () => {
    Alert.alert("Confirm", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          await authUtils.removeUserToken();
        },
      },
    ]);
    await authUtils.removeUserToken(); // these are not mandatory/ Reset the route as the developer uses web browser
    router.replace("/"); // // these are not mandatory/ Reset the route as the developer uses web browser
  };

  const cashierBranches = useMemo(
    () => [
      { label: "Branch 1", value: "branch1" },
      { label: "Branch 2", value: "branch2" },
    ],
    []
  );

  const loanBranches = useMemo(
    () => [
      { label: "Branch A", value: "branchA" },
      { label: "Branch B", value: "branchB" },
    ],
    []
  );

  const centers = useMemo(
    () => [
      { label: "Center 1", value: "center1" },
      { label: "Center 2", value: "center2" },
      { label: "Center 3", value: "center3" },
      { label: "Center 4", value: "center4" },
    ],
    []
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      <View className="flex-1">
        <HeaderComponet
          title="MF Receipt"
          onBack={handleBackPress}
          logOut={logOut}
          activeLogBtn={true}
        />

        <ScrollView className="flex-1">
          <View className="p-5">
            <View className="bg-blue-50 p-4 rounded-lg mb-6">
              <Text className="text-blue-800 text-sm">
                Select the options below to view available receipts. Start by
                selecting a center.
              </Text>
            </View>

            {/* Cashier Branch Dropdown */}
            <View className="mb-4">
              <Text className="text-sm font-medium mb-2">
                Select Cashier Branch
              </Text>
              <Dropdown
                data={cashierBranches}
                labelField="label"
                valueField="value"
                placeholder="Select Cashier Branch"
                value={cashierBranch}
                onChange={(item) => setCashierBranch(item.value)}
                renderLeftIcon={() => (
                  <MaterialIcons name="business" size={20} color="gray" />
                )}
                style={{
                  backgroundColor: "#f3f4f6",
                  padding: 10,
                  paddingLeft: 10,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  opacity: 0.7,
                }}
                disable
                placeholderStyle={{ color: "#9ca3af" }}
                selectedTextStyle={{ color: "#6b7280" }}
                iconStyle={{ borderColor: "#9ca3af" }}
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium mb-2">
                Select Loan Branch
              </Text>
              <Dropdown
                data={loanBranches}
                labelField="label"
                valueField="value"
                placeholder="Select Loan Branch"
                value={loanBranch}
                onChange={(item) => setLoanBranch(item.value)}
                renderLeftIcon={() => (
                  <MaterialIcons name="business" size={20} color="gray" />
                )}
                style={{
                  backgroundColor: "#f3f4f6",
                  padding: 10,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  opacity: 0.7,
                }}
                disable
                placeholderStyle={{ color: "#9ca3af" }}
                selectedTextStyle={{ color: "#6b7280" }}
                iconStyle={{ tintColor: "#9ca3af" }}
              />
            </View>

            {/* Center Dropdown */}
            <View className="mb-4">
              <Text className="text-sm font-medium mb-2">Select Center</Text>
              <Dropdown
                data={centers}
                labelField="label"
                valueField="value"
                placeholder="Select Center"
                value={center}
                onChange={(item) => {
                  setCenter(item.value);
                  if (errors.center)
                    setErrors({ ...errors, center: undefined });
                }}
                renderLeftIcon={() => (
                  <MaterialIcons name="location-on" size={20} color="gray" />
                )}
                style={{
                  backgroundColor: "white",
                  padding: 10,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: errors.center ? "#ef4444" : "#d1d5db",
                }}
              />
              {errors.center && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.center}
                </Text>
              )}
            </View>

            {/* Search Input */}
            <View className="mb-6">
              <Text className="text-sm font-medium mb-2">
                Enter ID/Account Number
              </Text>

              <View className="relative">
                {/* Search icon */}
                <View className="absolute top-0 left-3 h-full flex justify-center items-center">
                  <Search size={18} color="#4B5563" />
                </View>

                {/* TextInput */}
                <TextInput
                  className={`w-full pl-10 pr-4 py-3.5 border rounded-lg text-sm ${
                    errors.search
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-white"
                  } ${apiStatus === "loading" ? "opacity-70" : "opacity-100"}`}
                  placeholder="Enter ID or name to search"
                  value={searchQuery}
                  onChangeText={(text) => {
                    setSearchQuery(text);
                    if (errors.search) {
                      setErrors({ ...errors, search: undefined });
                    }
                  }}
                  editable={apiStatus !== "loading"}
                />
              </View>

              {/* Error message */}
              {errors.search && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.search}
                </Text>
              )}
            </View>
            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={apiStatus === "loading"}
              className={`w-full mt-4 py-4 rounded-lg flex items-center justify-center ${
                apiStatus === "loading"
                  ? "bg-blue-400"
                  : "bg-blue-600 active:bg-blue-700"
              }`}
            >
              {apiStatus === "loading" ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text className="text-white font-bold ml-2">
                    Processing...
                  </Text>
                </View>
              ) : (
                <Text className="text-white font-bold">Fetch Receipts</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default MFReceipt;
