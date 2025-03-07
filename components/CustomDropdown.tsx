import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import { ChevronDown, ChevronLeft, User, Search } from "lucide-react-native";

const CustomDropdown = ({
  label,
  data,
  onSelect,
  selectedValue,
  disabled = false,
  error = "",
}: {
  label: string;
  data: { label: string; value: string }[];
  onSelect: (value: string) => void;
  selectedValue: string;
  disabled?: boolean;
  error?: string;
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-1">{label}</Text>
      <View>
        <TouchableOpacity
          onPress={() => !disabled && setVisible(!visible)}
          disabled={disabled}
          className={`w-full px-4 py-3.5 border rounded-lg flex-row justify-between items-center ${
            disabled
              ? "bg-gray-50 border-gray-200"
              : error
              ? "border-red-500 bg-red-50"
              : "bg-white border-gray-300"
          }`}
        >
          <Text
            className={`${
              disabled
                ? "text-gray-500"
                : error
                ? "text-red-800"
                : "text-gray-800"
            }`}
          >
            {selectedValue
              ? data.find((item) => item.value === selectedValue)?.label ||
                selectedValue
              : "Select an option"}
          </Text>

          <ChevronDown
            size={18}
            color={disabled ? "#9CA3AF" : error ? "#EF4444" : "#4B5563"}
          />
        </TouchableOpacity>

        {error && <Text className="text-red-600 text-xs mt-1">{error}</Text>}

        {/* Using Modal with centered positioning */}
        <Modal
          visible={visible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setVisible(false)}>
            <View className="flex-1 justify-center items-center bg-black bg-opacity-30">
              <View
                className="w-4/5 bg-white border border-gray-200 rounded-lg shadow-lg"
                style={{ maxHeight: 300 }}
              >
                <ScrollView className="py-1">
                  {data.map((item) => (
                    <TouchableOpacity
                      key={item.value}
                      className="w-full px-4 py-3.5 border-b border-gray-100"
                      onPress={() => {
                        onSelect(item.value);
                        setVisible(false);
                      }}
                    >
                      <Text className="text-gray-800">{item.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </View>
  );
};

export default CustomDropdown;
