import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import CustomButton from "../../components/CustomButton";
import { images } from "../../constants";

const Add = () => {
  const router = useRouter();

  return (
    <ImageBackground source={images.background} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Add Item</Text>

        <Text style={styles.subtitle}>
          How would you like to add your item? Fill out the checklist for detailed results or upload a photo for a quick estimate.
        </Text>

        {/* Navigate to ManualEntryForm */}
        <CustomButton
          title="Enter Details Manually"
          handlePress={() => router.push("/manual-entry")}
          containerStyles={{ marginTop: 20, height: 260, width: "100%" }}
          textStyles={{ fontWeight: "bold", fontSize: 24 }}
          backgroundImage={images.document}
          backgroundStartsLeft={true}
        />

        {/* Navigate to Upload Image
        <CustomButton
          title="Upload Product Image"
          handlePress={() => router.push("/upload-image")}
          containerStyles={{ marginTop: 20, height: 165, width: "100%" }}
          textStyles={{ fontWeight: "bold", fontSize: 24 }}
          backgroundImage={images.camera}
          backgroundStartsRight={true}
        /> */}
        <CustomButton
          title="Product Picture"
          handlePress={() => router.push("/picture")}
          containerStyles={{ marginTop: 20, height: 260, width: "100%" }}
          textStyles={{ fontWeight: "bold", fontSize: 24 }}
          backgroundImage={images.camera}
          backgroundStartsRight={true}
        />

        {/* <Button
          title="Take Picture"
          onPress={() => router.push("/take-picture")}
          style={{ marginTop: 20 }}
        /> */}
        
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Add;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover", // Ensures the image scales appropriately
  },
  container: { 
    flex: 1, 
    backgroundColor: "transparent", // Background transparency for the image to show
    alignItems: "center", 
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    paddingTop: 10,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#fff", // White text for better visibility on the background
  },
  subtitle: {
    fontSize: 17,
    fontWeight: 600,
    paddingTop: 6,
    textAlign: "center",
    color: "#fff", // White text for better visibility
  },
});
