import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import React, { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
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
            <Text className="text-2xl font-bold text-gray-800">Welcome Back</Text>
            <Text className="text-gray-500 text-center mt-2">Please sign in to continue</Text>
          </View>
          
          {/* Form Section */}
          <View className="space-y-4">
            {/* Username Input */}
            <View className="bg-gray-100 rounded-xl px-4 py-3">
              <Text className="text-xs text-gray-500 mb-1">Username</Text>
              <TextInput
                className="text-gray-800 text-base"
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your username"
                autoCapitalize="none"
              />
            </View>
            
            {/* Password Input */}
            <View className="bg-gray-100 rounded-xl px-4 py-3">
              <Text className="text-xs text-gray-500 mb-1">Password</Text>
              <TextInput
                className="text-gray-800 text-base"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
              />
            </View>
            
            {/* Forgot Password */}
            <TouchableOpacity className="items-end">
              <Text className="text-blue-500">Forgot Password?</Text>
            </TouchableOpacity>
            
            {/* Login Button */}
            <TouchableOpacity 
              className="bg-blue-500 py-4 rounded-xl mt-6"
              onPress={() => console.log('Login pressed')}
            >
              <Text className="text-white font-bold text-center text-lg">Login</Text>
            </TouchableOpacity>
          </View>
          
          {/* Sign Up Section */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-600">Don't have an account? </Text>
            <TouchableOpacity>
              <Text className="text-blue-500 font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;