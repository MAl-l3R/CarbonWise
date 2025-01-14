import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import CustomButton from "../../components/CustomButton";

const Add = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>Add Item</Text>
      
      {/* Navigate to ManualEntryForm */}
      <CustomButton
        title="Enter Details Manually"
        handlePress={() => router.push("/manual-entry")}
        containerStyles={{ marginTop: 30, height: 256, width: '90%' }}
        textStyles={{ fontWeight: 'bold', fontSize: 24 }}
      />

      {/* Navigate to Upload Image */}
      <CustomButton
        title="Upload Product Image"
        handlePress={() => router.push("/upload-image")}
        containerStyles={{ marginTop: 40, height: 256, width: '90%' }}
        textStyles={{ fontWeight: 'bold', fontSize: 24 }}
      />

      <Button
        title="Take Picture"
        onPress={() => router.push("/take-picture")}
        style={{ marginTop: 20 }}
      />

    </SafeAreaView>
  );
};

export default Add;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff", 
    alignItems: "center", 
  },
  title: {
    fontSize: 24,
    paddingTop: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
});
