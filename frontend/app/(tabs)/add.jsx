import React from "react";
import { View, Text, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const Add = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>

      
      {/* Navigate to ManualEntryForm */}
      <Button
        title="Enter Details Manually"
        onPress={() => router.push("/manual-entry")}
      />

      {/* Navigate to Select Image */}
      <Button
        title="Upload Product Image"
        onPress={() => router.push("/upload-image")}
        style={{ marginTop: 20 }}
      />
    </SafeAreaView>
  );
};

export default Add;
