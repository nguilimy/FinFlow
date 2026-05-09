import { View, Text } from "react-native";

export default function AuthHeader() {
  return (
    <View className="bg-[#FF2929] pt-16 pb-8 px-6 rounded-b-[30px] items-center justify-center">
      <View className="w-16 h-16 bg-white rounded-full items-center justify-center mb-4 shadow-sm">
        <Text className="text-[#FF2929] text-2xl font-bold">FF</Text>
      </View>
      <Text className="text-white text-3xl font-bold mb-2 tracking-tight">FinFlow</Text>
      <Text className="text-white/80 text-sm font-medium">Smart Finance Made Simple</Text>
    </View>
  );
}
