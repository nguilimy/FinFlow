import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { theme } from "../constants/theme";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function PrimaryButton({ title, onPress, loading, disabled }: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`w-full h-14 rounded-xl items-center justify-center flex-row ${
        disabled ? "bg-red-300" : "bg-[#FF2929]"
      }`}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.white} />
      ) : (
        <Text className="text-white text-lg font-semibold">{title}</Text>
      )}
    </TouchableOpacity>
  );
}
