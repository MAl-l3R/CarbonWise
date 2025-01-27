import React, { useState } from "react";
import { View, Text, Alert, Image, StyleSheet, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomButton from "../../components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from 'expo-router';

// 1) Pull in your backend URL from .env

// If using react-native-dotenv, you might do: import { BACKEND_URL } from '@env';

export default function DetectObject() {
  const [imageUri, setImageUri] = useState(null);
  const [detectedObjects, setDetectedObjects] = useState("");

  // Step 1: Pick Image from gallery
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

  // Step 2: Analyze Image (calls your backend)
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

      

      // Make API Call to your own server
      const response = await fetch(`http://detect-objects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64Image }),
      });

      const responseJson = await response.json();
      console.log("BACKEND RESPONSE:", responseJson);

      if (responseJson.success === true) {
        setDetectedObjects(responseJson.objects);
      } else {
        setDetectedObjects("No objects detected. Try another image.");
      }
    } catch (error) {
      console.error("Analysis Error:", error);
      Alert.alert("Error", "An error occurred while analyzing the image.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Header and Back button */}
      <View style={styles.headerContainer}>
        <Ionicons
          name="arrow-back-outline"
          size={24}
          color="black"
          onPress={() => {
            router.back();
          }}
        />
        <Text style={styles.headerText}>Carbon Footprint Calculator</Text>
      </View>
      <ActivityIndicator/>

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
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
    paddingHorizontal: 25,
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerText: {
    color: '#000',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
