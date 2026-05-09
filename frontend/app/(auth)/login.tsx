import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import SocialAuthButtons from "../../components/SocialAuthButtons";
import { API_URL, fetchWithTimeout } from "../../utils/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      console.log("Logging in via:", `${API_URL}/auth/login`);
      const response = await fetchWithTimeout(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      // TODO: Save token to SecureStore
      router.replace("/(tabs)/dashboard");
    } catch (err: any) {
      Alert.alert("Login Failed", err.message || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white pt-16">
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
        <View className="mb-10 mt-4">
          <Text className="text-[32px] font-bold text-gray-900 mb-2">Welcome Back!</Text>
          <Text className="text-gray-500 text-base">Sign in to continue</Text>
        </View>

        <View className="mb-6">
          <InputField
            placeholder="Email or Phone Number"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <InputField
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            isPassword
          />
          
          <View className="flex-row justify-between items-center mt-2">
            <TouchableOpacity 
              className="flex-row items-center" 
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
            >
              <View className={`w-5 h-5 rounded border items-center justify-center mr-2 ${
                rememberMe ? "bg-[#FF2929] border-[#FF2929]" : "border-gray-300"
              }`}>
                {rememberMe && <Ionicons name="checkmark" size={14} color="white" />}
              </View>
              <Text className="text-gray-600 text-sm">Remember me</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7}>
              <Text className="text-[#FF2929] text-sm font-medium">Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </View>

        <PrimaryButton 
          title="Sign In" 
          onPress={handleLogin} 
          loading={loading} 
        />

        <View className="flex-row items-center my-8">
          <View className="flex-1 h-[1px] bg-gray-200" />
          <Text className="text-gray-400 mx-4 text-sm">or continue with</Text>
          <View className="flex-1 h-[1px] bg-gray-200" />
        </View>

        <SocialAuthButtons />

        <View className="flex-row justify-center mt-auto pt-8 pb-4">
          <Text className="text-gray-600">Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text className="text-[#FF2929] font-bold">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </View>
  );
}
