import React, { useState } from "react";
import { View, Text, Alert, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";



import CustomButton from "../../components/CustomButton";

export default function DetectObject() {
  const [imageUri, setImageUri] = useState(null);
  const [detectedObjects, setDetectedObjects] = useState("");

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
        
      const endpoint = `https://vision.googleapis.com/v1/images:annotate?key=${api_key}`;

      // Convert image to Base64
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Prepare request body
      const requestData = {
        requests: [
          {
            image: { content: base64Image },
            features: [{ type: "OBJECT_LOCALIZATION", maxResults: 10 }],
          },
        ],
      };

      // Make API Call
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const responseJson = await response.json();
      console.log("VISION API RESPONSE:", responseJson);

      if (
        responseJson.responses &&
        responseJson.responses[0]?.localizedObjectAnnotations?.length > 0
      ) {
        const detectedNames = responseJson.responses[0].localizedObjectAnnotations
          .map((obj) => obj.name)
          .join(", ");
        setDetectedObjects(detectedNames);
      } else {
        setDetectedObjects("No objects detected. Try another image.");
      }
    } catch (error) {
      console.error("Analysis Error:", error);
      Alert.alert("Error", "An error occurred while analyzing the image.");
    }
  };

  return (
    <View style={styles.container}>
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

      {detectedObjects && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultTitle}>Localized Objects:</Text>
          <Text style={styles.objectText}>{detectedObjects}</Text>
        </View>
      )}
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
    paddingHorizontal: 10,
    alignItems: "flex-start",
    width: "100%",
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  objectText: {
    fontSize: 16,
    color: "#000",
  },
});
