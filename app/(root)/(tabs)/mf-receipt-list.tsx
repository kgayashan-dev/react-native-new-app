import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  Alert,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import { ArrowDown, X } from "lucide-react-native";
import Header from "@/components/header";
import { SafeAreaView } from "react-native-safe-area-context";

// Define types
type ReceiptItem = {
  id: string;
  name: string;
  rentalAmount: number;
  payAmount?: number;
  due: number;
};

const MFReceiptList: React.FC = () => {
  // State for total amount
  const [totalAmount, setTotalAmount] = useState<string>("600000");

  // State for managing modal and pay amount
  const [isPayModalVisible, setPayModalVisible] = useState<boolean>(false);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptItem | null>(null);
  const [payAmount, setPayAmount] = useState<string>("");

  // Sample receipt data
  const [receiptData, setReceiptData] = useState<ReceiptItem[]>([]);
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Loading states for specific operations
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState<boolean>(false);

  // Fetch receipt data on component mount
  useEffect(() => {
    fetchReceiptData();
  }, []);

  // Function to fetch receipt data
  const fetchReceiptData = async (isRefresh: boolean = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    
    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Sample data - replace with actual API call
      const sampleData: ReceiptItem[] = [
        {
          id: "CK000000012212",
          name: "Saman Perera",
          rentalAmount: 100000,
          payAmount: 20000,
          due: 0,
        },
        {
          id: "CK000000012213",
          name: "Kamal Silva",
          rentalAmount: 100000,
          due: 0,
        },
        {
          id: "CK000000012214",
          name: "Nimal Fernando",
          rentalAmount: 100000,
          payAmount: 20000,
          due: 0,
        },
      ];
      
      setReceiptData(sampleData);
    } catch (err) {
      const errorMessage = "Failed to load receipt data. Please try again.";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
      console.error("Error fetching receipt data:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Handle pull-to-refresh
  const handleRefresh = () => {
    fetchReceiptData(true);
  };

  // Handle pay amount entry with error handling
  const handlePayAmountEnter = async () => {
    if (!selectedReceipt) return;
    
    if (!payAmount || parseFloat(payAmount) <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid payment amount.");
      return;
    }
    
    setIsUpdatingPayment(true);
    
    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Update the selected receipt's payAmount
      const updatedReceipts = receiptData.map((receipt) =>
        receipt.id === selectedReceipt.id
          ? { ...receipt, payAmount: parseFloat(payAmount) }
          : receipt
      );

      // Update the receipt data
      setReceiptData(updatedReceipts);
      console.log(`Pay amount entered for ${selectedReceipt.id}: ${payAmount}`);
      
      // Close the modal and reset the pay amount
      setPayModalVisible(false);
      setPayAmount("");
      setSelectedReceipt(null);
      
      Alert.alert("Success", "Payment amount updated successfully.");
    } catch (err) {
      Alert.alert("Error", "Failed to update payment amount. Please try again.");
      console.error("Error updating payment:", err);
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  // Handle total amount change
  const handleTotalAmountChange = (text: string) => {
    // Allow only numeric values
    const numericValue = text.replace(/[^0-9]/g, "");
    setTotalAmount(numericValue);
  };

  // Handle save action with error handling
  const handleSave = async () => {
    if (!totalAmount || parseFloat(totalAmount) <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid total amount.");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      console.log("Total Amount Saved:", totalAmount);
      Alert.alert("Success", "Total amount saved successfully.");
    } catch (err) {
      Alert.alert("Error", "Failed to save total amount. Please try again.");
      console.error("Error saving total amount:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Render empty state
  const renderEmptyList = () => (
    <View className="flex-1 items-center justify-center p-5">
      <Text className="text-gray-600 text-lg text-center">No receipt data available.</Text>
    </View>
  );

  // Render receipt item
  const renderReceiptItem = ({ item }: { item: ReceiptItem }) => (
    <TouchableOpacity 
      className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-3"
      onPress={() => {
        setSelectedReceipt(item);
        setPayModalVisible(true);
      }}
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between items-center border-b border-gray-200 p-3">
        <Text className="text-sm font-medium text-gray-700">{item.id}</Text>
        <Text className="text-sm text-blue-600">{item.name}</Text>
      </View>
      <View className="p-3">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm text-gray-600">RentalAmt</Text>
          <Text className="text-sm text-red-600 font-semibold">
            {item.rentalAmount.toLocaleString()}
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-gray-600">Due</Text>
          <Text className="text-sm text-green-600 font-semibold">{item.due}</Text>
        </View>
        {item.payAmount !== undefined && (
          <View className="bg-orange-50 rounded mt-2 p-2">
            <Text className="text-orange-500 text-sm font-semibold text-center">
              PAY AMT - {item.payAmount.toLocaleString()}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      <Header title="MF Receipt List" showBackButton={true} />
      
      {/* Main content */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563EB" />
          <Text className="text-gray-600 text-base mt-3">Loading receipts...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center p-5">
          <Text className="text-red-600 text-lg text-center mb-5">{error}</Text>
          <TouchableOpacity 
            className="bg-blue-600 py-2 px-5 rounded-md"
            onPress={() => fetchReceiptData()}
            activeOpacity={0.7}
          >
            <Text className="text-white font-medium">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={receiptData}
          renderItem={renderReceiptItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={renderEmptyList}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={["#2563EB"]}
              tintColor="#2563EB"
            />
          }
        />
      )}

      {/* Total Amount Section */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <View className="bg-white border-t border-gray-200 p-4">
          <Text className="text-lg font-semibold text-center text-gray-800 mb-3">
            Total Amount
          </Text>
          <View className="border border-gray-300 rounded-full mb-4 px-4">
            <TextInput
              className="w-full py-3 text-gray-800"
              placeholder="Enter total amount"
              value={totalAmount}
              onChangeText={handleTotalAmountChange}
              keyboardType="number-pad"
              editable={!isSaving}
            />
          </View>
          <TouchableOpacity 
            className={`py-4 rounded-lg items-center justify-center ${
              isSaving ? "bg-blue-400" : "bg-blue-600"
            }`}
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.7}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white font-semibold">Save</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Pay Amount Modal */}
      <Modal
        visible={isPayModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          if (!isUpdatingPayment) {
            setPayModalVisible(false);
            setSelectedReceipt(null);
            setPayAmount("");
          }
        }}
      >
        <View className="flex-1 bg-black bg-opacity-50 items-center justify-center p-4">
          <View className="bg-white rounded-lg w-full max-w-md p-5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-medium text-gray-900">
                Enter Pay Amount
              </Text>
              {!isUpdatingPayment && (
                <TouchableOpacity 
                  onPress={() => {
                    setPayModalVisible(false);
                    setSelectedReceipt(null);
                    setPayAmount("");
                  }}
                >
                  <X size={20} color="#6B7280" />
                </TouchableOpacity>
              )}
            </View>
            
            <Text className="text-sm text-gray-500 mb-3">
              {selectedReceipt ? selectedReceipt.id : ""}
            </Text>
            
            <TextInput
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              placeholder="Enter Pay Amount"
              keyboardType="number-pad"
              value={payAmount}
              onChangeText={(text) => setPayAmount(text.replace(/[^0-9]/g, ""))}
              editable={!isUpdatingPayment}
            />
            
            <TouchableOpacity
              className={`w-full py-3 rounded-md items-center mb-2 ${
                isUpdatingPayment ? "bg-blue-400" : "bg-blue-600"
              }`}
              onPress={handlePayAmountEnter}
              disabled={isUpdatingPayment}
              activeOpacity={0.7}
            >
              {isUpdatingPayment ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white font-medium">Enter</Text>
              )}
            </TouchableOpacity>
            
            {!isUpdatingPayment && (
              <TouchableOpacity
                className="w-full py-3 items-center rounded-md"
                onPress={() => {
                  setPayModalVisible(false);
                  setSelectedReceipt(null);
                  setPayAmount("");
                }}
                activeOpacity={0.7}
              >
                <Text className="text-blue-600 font-medium">Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MFReceiptList;