import { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";

interface InputFieldProps extends TextInputProps {
  label?: string;
  isPassword?: boolean;
  error?: string;
}

export default function InputField({ label, isPassword, error, ...props }: InputFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(!isPassword);

  return (
    <View className="mb-4">
      {label && <Text className="text-sm font-medium text-gray-700 mb-1.5">{label}</Text>}
      <View 
        className={`flex-row items-center border bg-white rounded-xl px-4 h-14 ${
          error ? "border-red-500" : "border-gray-200"
        }`}
      >
        <TextInput
          className="flex-1 text-base text-gray-900"
          placeholderTextColor={theme.colors.muted}
          secureTextEntry={isPassword && !isPasswordVisible}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} className="p-2 -mr-2">
            <Ionicons 
              name={isPasswordVisible ? "eye-off" : "eye"} 
              size={20} 
              color={theme.colors.muted} 
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-xs text-red-500 mt-1.5">{error}</Text>}
    </View>
  );
}
