import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router"; // Assuming you're using Expo Router

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [apiStatus, setApiStatus] = useState("idle"); // idle, loading, success, error
  const [networkAvailable, setNetworkAvailable] = useState(true);
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  // Validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate input fields
  const validateInputs = () => {
    let isValid = true;
    const newErrors = { username: "", password: "" };

    // Username validation
    if (!username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (username.includes("@") && !isValidEmail(username)) {
      newErrors.username = "Invalid email format";
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 2) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle login with proper API integration
  const handleLogin = async () => {
    // Reset previous errors
    setErrorMessage("");
    // Validate inputs
    if (!validateInputs()) {
      return;
    }
    try {
      // Set loading state
      setApiStatus("loading");
      // Make API request with timeout for better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout
      const response = await fetch("http://localhost:5093/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await response.json();
      if (response.ok) {
        // Check if the server returned valid user data
        if (data && data.id) {
          // Store user session
          await AsyncStorage.setItem("userData", JSON.stringify(data));
          // Update status
          setApiStatus("success");
          // Clear any existing errors
          setErrorMessage("");
          // Navigate to the protected page after successful login
          router.push("/mf-receipt");
        } else {
          // Handle invalid user data format
          setApiStatus("error");
          setErrorMessage("Invalid response from server");
          Alert.alert("Login Failed", "Invalid server response");
        }
      } else {
        // Handle different error status codes
        setApiStatus("error");
        if (response.status === 401) {
          setErrorMessage("Invalid username or password");
          Alert.alert("Login Failed", "Invalid username or password");
        } else if (response.status === 403) {
          setErrorMessage("Your account is locked. Please contact support.");
          Alert.alert(
            "Account Locked",
            "Your account is locked. Please contact support."
          );
        } else if (response.status >= 500) {
          setErrorMessage("Server error. Please try again later.");
          Alert.alert(
            "Server Error",
            "Server is currently unavailable. Please try again later."
          );
        } else {
          // Generic error message for other status codes
          setErrorMessage(data?.message || "Login failed");
          Alert.alert("Login Failed", data?.message || "Something went wrong");
        }
      }
    } catch (error) {
      // Set error state
      setApiStatus("error");
      // Handle different error types
      if (
        error instanceof TypeError &&
        error.message.includes("Network request failed")
      ) {
        setNetworkAvailable(false);
        setErrorMessage(
          "Network error. Please check your internet connection."
        );
        Alert.alert(
          "Network Error",
          "Please check your internet connection and try again."
        );
      } else if (error instanceof DOMException && error.name === "AbortError") {
        setErrorMessage("Request timed out. Please try again.");
        Alert.alert("Timeout", "Request timed out. Please try again.");
      } else {
        // console.error("Login Error:", error);
        setErrorMessage("An unexpected error occurred. Please try again!");
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
    } finally {
      // Always clean up loading state
      if (apiStatus === "loading") {
        setApiStatus("idle");
      }
    }
  };

  // Handle retry when network is unavailable
  const handleRetry = () => {
    setNetworkAvailable(true);
    setErrorMessage("");
    setApiStatus("idle");
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    Alert.alert(
      "Reset Password",
      "Enter your email to receive password reset instructions",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Submit",
          onPress: () =>
            Alert.alert("Success", "Password reset link sent to your email!"),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-8">
          {/* Header/Logo Section */}
          <View className="items-center mb-10">
            <View className="bg-blue-500 rounded-full p-5 mb-4">
              <Text className="text-white text-3xl font-bold">App</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-800">
              Welcome Back
            </Text>
            <Text className="text-gray-500 text-center mt-2">
              Please sign in to continue
            </Text>
          </View>

          {/* Form Section */}
          <View className="space-y-4">
            {/* Global Error Message */}
            {errorMessage ? (
              <View className="bg-red-100 p-3 rounded-lg">
                <Text className="text-red-600 text-sm">{errorMessage}</Text>
              </View>
            ) : null}

            {/* Network Error */}
            {!networkAvailable ? (
              <View className="bg-yellow-100 p-3 rounded-lg">
                <Text className="text-yellow-800 text-sm mb-2">
                  No internet connection detected.
                </Text>
                <TouchableOpacity
                  className="bg-yellow-500 p-2 rounded"
                  onPress={handleRetry}
                >
                  <Text className="text-white text-center">Retry</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Username Input */}
            <View className="bg-gray-100 rounded-xl px-4 py-3">
              <Text className="text-xs text-gray-500 mb-1">Username</Text>
              <TextInput
                className="text-gray-800 text-base p-2"
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  if (errors.username) {
                    setErrors({ ...errors, username: "" });
                  }
                }}
                placeholder="Enter your username or email"
                autoCapitalize="none"
                keyboardType="email-address"
              />
              {errors.username ? (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.username}
                </Text>
              ) : null}
            </View>

            {/* Password Input */}
            <View className="bg-gray-100 rounded-xl px-4 py-3">
              <Text className="text-xs text-gray-500 mb-1">Password</Text>
              <TextInput
                className="text-gray-800 text-base p-2"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors({ ...errors, password: "" });
                  }
                }}
                placeholder="Enter your password"
                secureTextEntry
              />
              {errors.password ? (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.password}
                </Text>
              ) : null}
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              className="items-end"
              onPress={handleForgotPassword}
            >
              <Text className="text-blue-500">Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              className={`py-4 rounded-xl mt-6 ${
                apiStatus === "loading" ? "bg-blue-400" : "bg-blue-500"
              }`}
              onPress={handleLogin}
              disabled={apiStatus === "loading" || !networkAvailable}
            >
              {apiStatus === "loading" ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-center text-lg">
                  Login
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Sign Up Section */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-600">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text className="text-blue-500 font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
