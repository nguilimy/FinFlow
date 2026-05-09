import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SocialAuthButtons() {
  return (
    <View className="items-center w-full">
      <TouchableOpacity className="w-full h-14 bg-white border border-gray-200 rounded-xl flex-row items-center justify-center mb-6" activeOpacity={0.7}>
        <Ionicons name="logo-google" size={24} color="#DB4437" />
        <Text className="ml-3 text-gray-700 font-medium text-base">Continue with Google</Text>
      </TouchableOpacity>
      
      <TouchableOpacity activeOpacity={0.7}>
        <Text className="text-[#FF2929] font-medium text-base">Use Biometric</Text>
      </TouchableOpacity>
    </View>
  );
}
