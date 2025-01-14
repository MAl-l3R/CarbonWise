import React from "react";
import { View, Text, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const Add = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>

      
      {/* Navigate to Carbon Calculator */}
      <Button
        title="Go to Carbon Calculator"
        onPress={() => router.push("/CarbonCalculator")}
      />

      {/* Navigate to Select Image */}
      <Button
        title="Go to Select Image"
        onPress={() => router.push("/SelectImage")}
        style={{ marginTop: 20 }}
      />
    </SafeAreaView>
  );
};

export default Add;
