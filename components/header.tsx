import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type HeaderProps = {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
};

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  rightComponent,
}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="white" 
        translucent={Platform.OS === 'android'} 
      />
      <View 
        style={{ 
          paddingTop: Platform.OS === 'ios' ? insets.top : insets.top + 10,
          backgroundColor: 'white',
        }}
        className="border-b border-gray-200 shadow-sm"
      >
        <View className="flex-row items-center justify-between px-4 py-3">
          <View className="w-10">
            {showBackButton && (
              <TouchableOpacity
                onPress={handleBackPress}
                className="p-1"
              >
                <ArrowLeft size={24} color="#1E40AF" />
              </TouchableOpacity>
            )}
          </View>
          
          <Text className="text-lg font-semibold text-gray-800 flex-1 text-center">
            {title}
          </Text>
          
          <View className="w-10">
            {rightComponent}
          </View>
        </View>
      </View>
    </>
  );
};

export default Header;