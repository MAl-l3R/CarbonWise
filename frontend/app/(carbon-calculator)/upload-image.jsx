// SelectImge.jsx (or DetectObject.jsx)
import React, { useState } from "react";
import { View, Text, Alert, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import CustomButton from "../../components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DetectObject() {
  const [imageUri, setImageUri] = useState(null);
  const [detectedObjects, setDetectedObjects] = useState(""); // Store only object names

  // Step 1: Pick Image
  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.status !== "granted") {
        Alert.alert("Permission Denied", "Camera roll permissions are required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while selecting an image.");
    }
  };

  // Step 2: Analyze Image
  const analyzeImage = async () => {
    if (!imageUri) {
      Alert.alert("Error", "Please select an image first.");
      return;
    }

    try {
      // Convert image to Base64
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Adjust URL based on your environment:
      // For Android Emulator => "http://10.0.2.2:3000/detect-objects"
      // For iOS Simulator   => "http://localhost:3000/detect-objects"
      // For real device     => "http://YOUR_LOCAL_IP:3000/detect-objects"
      const response = await fetch("http://localhost:3000/detect-objects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ base64Image }),
      });

      const jsonData = await response.json();

      if (jsonData.success) {
        // Show only the 'objects' field
        setDetectedObjects(jsonData.objects);
      } else {
        Alert.alert("Error", jsonData.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Analysis Error:", error);
      Alert.alert("Error", "An error occurred while analyzing the image.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Object Localization</Text>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <CustomButton
        title="Select Image"
        handlePress={pickImage}
        containerStyles={{ marginBottom: 20 }}
      />

      <CustomButton
        title="Analyze Image"
        handlePress={analyzeImage}
        containerStyles={{ marginBottom: 20 }}
      />

      {detectedObjects !== "" && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultTitle}>Detected Objects:</Text>
          <Text style={styles.objectText}>{detectedObjects}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 20,
    borderRadius: 10,
    resizeMode: "cover",
  },
  resultsContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "flex-start",
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  objectText: {
    fontSize: 16,
    color: "#333",
  },
});
