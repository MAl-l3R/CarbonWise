import React, { useState } from "react";
import { View, Text, Alert, Image, StyleSheet, ActivityIndicator, ImageBackground } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import CustomButton from "../../components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { images } from '../../constants';

// 1) Pull in your backend URL from .env
// If you're using Expo's built-in env approach:

// If using react-native-dotenv, you might do:
// import { BACKEND_URL } from '@env';

export default function TakePicture() {
  const [imageUri, setImageUri] = useState(null);
  const [detectedObjects, setDetectedObjects] = useState("");

  // Step 1: Open Camera
  const takePicture = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.status !== "granted") {
        Alert.alert("Permission Denied", "Camera permissions are required!");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true, // Enables cropping
        aspect: [4, 3], // Aspect ratio for cropping
        quality: 1, // High quality
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while taking the picture.");
    }
  };

  // Step 2: Analyze Image (calls your backend)
  const analyzeImage = async () => {
    if (!imageUri) {
      Alert.alert("Error", "Please take a picture first.");
      return;
    }

    try {
      // Convert image to Base64
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Make API Call to your own server
      const response = await fetch(`http:/detect-objects`, {
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

    <ImageBackground source={images.background} style={styles.background}>

    <SafeAreaView>
    <View style={styles.headerContainer}>
        <Ionicons
          name="arrow-back-outline"
          size={24}
          color="white"
          onPress={() => {
            router.back();
          }}
        />
      <Text style={styles.headerText}>Object Detection</Text>

      </View>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <CustomButton
        title="Take Picture"
        handlePress={takePicture}
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
    </ImageBackground>
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
  background:{
    flex: 1,
    resizeMode: 'cover',
    flexDirection: 'column',
  },
  headertext:{
    color: '#000',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 10,
    paddingBottom: 20,

  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
