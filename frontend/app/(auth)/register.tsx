import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import { API_URL, fetchWithTimeout } from "../../utils/api";

export default function RegisterScreen() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const evaluatePasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let strength = 0;
    if (pass.length > 5) strength += 1;
    if (pass.length > 7 && /[0-9]/.test(pass)) strength += 1;
    if (pass.length > 8 && /[A-Z]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) strength += 1;
    return strength;
  };

  const strength = evaluatePasswordStrength(form.password);
  const strengthLabels = ["Weak", "Fair", "Strong"];
  const strengthColors = ["bg-red-500", "bg-yellow-500", "bg-green-500"];

  const validate = () => {
    let valid = true;
    let newErrors: Record<string, string> = {};

    if (!form.fullName) { newErrors.fullName = "Full name is required"; valid = false; }
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) { newErrors.email = "Valid email is required"; valid = false; }
    if (!form.password || form.password.length < 6) { newErrors.password = "Password must be at least 6 characters"; valid = false; }
    if (form.password !== form.confirmPassword) { newErrors.confirmPassword = "Passwords do not match"; valid = false; }

    setErrors(newErrors);
    return valid;
  };

  const handleRegister = async () => {
    if (validate() && acceptedTerms) {
      setLoading(true);
      try {
        console.log("Registering via:", `${API_URL}/auth/register`);
        const response = await fetchWithTimeout(`${API_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            full_name: form.fullName,
            email: form.email,
            phone: form.phone,
            password: form.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(typeof data.detail === "string" ? data.detail : "Registration failed");
        }

        // TODO: Save token to SecureStore
        router.replace("/(tabs)/dashboard");
      } catch (err: any) {
        Alert.alert("Registration Failed", err.message || "An error occurred during registration.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View className="flex-1 bg-white pt-16">
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
        <View className="mb-8 mt-4">
          <Text className="text-[32px] font-bold text-gray-900 mb-2">Create Account</Text>
          <Text className="text-gray-500 text-base">Sign up to get started</Text>
        </View>

        <View className="mb-6">
          <InputField
            placeholder="Full Name"
            value={form.fullName}
            onChangeText={(text) => setForm({ ...form, fullName: text })}
            error={errors.fullName}
          />
          <InputField
            placeholder="Email Address"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
            error={errors.email}
          />
          <InputField
            placeholder="Phone Number (Optional)"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(text) => setForm({ ...form, phone: text })}
          />
          <InputField
            placeholder="Password"
            isPassword
            value={form.password}
            onChangeText={(text) => setForm({ ...form, password: text })}
            error={errors.password}
          />
          
          {/* Password Strength Indicator */}
          {form.password.length > 0 && (
            <View className="flex-row items-center space-x-2 mb-4 mt-1">
              <View className="flex-1 flex-row h-1.5 space-x-1">
                {[0, 1, 2].map((index) => (
                  <View 
                    key={index} 
                    className={`flex-1 rounded-full ${
                      strength > index ? strengthColors[strength - 1] : "bg-gray-200"
                    }`} 
                  />
                ))}
              </View>
              <Text className="text-xs text-gray-500 w-12 text-right">
                {strength > 0 ? strengthLabels[strength - 1] : "Weak"}
              </Text>
            </View>
          )}

          <InputField
            placeholder="Confirm Password"
            isPassword
            value={form.confirmPassword}
            onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
            error={errors.confirmPassword}
          />

          <TouchableOpacity 
            className="flex-row items-center mt-2" 
            onPress={() => setAcceptedTerms(!acceptedTerms)}
            activeOpacity={0.7}
          >
            <View className={`w-5 h-5 rounded border items-center justify-center mr-3 ${
              acceptedTerms ? "bg-[#FF2929] border-[#FF2929]" : "border-gray-300"
            }`}>
              {acceptedTerms && <Ionicons name="checkmark" size={14} color="white" />}
            </View>
            <Text className="text-gray-600 text-sm flex-1">
              I agree to the <Text className="text-[#FF2929] font-medium">Terms & Conditions</Text> and <Text className="text-[#FF2929] font-medium">Privacy Policy</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <PrimaryButton 
          title="Sign Up" 
          onPress={handleRegister} 
          loading={loading}
          disabled={!acceptedTerms}
        />

        <View className="flex-row items-center my-6">
          <View className="flex-1 h-[1px] bg-gray-200" />
          <Text className="text-gray-400 mx-4 text-sm">or sign up with</Text>
          <View className="flex-1 h-[1px] bg-gray-200" />
        </View>

        <TouchableOpacity className="w-full h-14 bg-white border border-gray-200 rounded-xl flex-row items-center justify-center mb-6">
          <Ionicons name="logo-google" size={24} color="#DB4437" />
          <Text className="ml-3 text-gray-700 font-medium text-base">Continue with Google</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-auto pb-4">
          <Text className="text-gray-600">Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text className="text-[#FF2929] font-bold">Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </View>
  );
}
