import React, { useState } from "react";
import { View, Text, Alert, Image, StyleSheet, ActivityIndicator, ImageBackground } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomButton from "../../components/CustomButton";
import { images } from '../../constants';
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from 'expo-router';

// 1) Pull in your backend URL from .env

// If using react-native-dotenv, you might do: import { BACKEND_URL } from '@env';

export default function DetectObject() {
  const [imageUri, setImageUri] = useState(null);
  const [detectedObjects, setDetectedObjects] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
     
    setIsSubmitting(true);
    if (!imageUri) {
      Alert.alert("Error", "Please select an image first.");
      setDetectedObjects("");
      setIsSubmitting(false);
      return;
    }

    try {
      // Convert image to Base64
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      

      // Make API Call to your own server
      // const response = await fetch(`http://10.0.0.234:3000/detect-objects`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ base64Image }),
      // });

      // const responseJson = await response.json();
      const responseJson = {"objects": "Computer keyboard", "success": true}
      console.log("BACKEND RESPONSE:", responseJson);

      if (responseJson.success === true) {
        setDetectedObjects(responseJson.objects);
        router.push({
          pathname: '/confirmation',
          params: {description: responseJson.objects},
        });
        setDetectedObjects("");
        setIsSubmitting(false);

      } else {
        setDetectedObjects("No objects detected. Try another image.");
        setDetectedObjects("");
        setIsSubmitting(false);

      }
    } catch (error) {
      console.error("Analysis Error:", error);
      Alert.alert("Error", "An error occurred while analyzing the image.");
      setDetectedObjects("");
      setIsSubmitting(false);

    }
  };

  return (
     <ImageBackground source={images.background} style={styles.background}>
    <SafeAreaView style={styles.safeArea}>

      {/* Header and Back button */}
      <View style={styles.headerContainer}>
        <Ionicons
          name="arrow-back-outline"
          size={24}
          color="white"
          onPress={() => {
            router.back();
          }}
        />
        <Text style={styles.headerText}>Carbon Footprint Calculator</Text>
      </View>
      

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      {isSubmitting ? (
                    <ActivityIndicator size="large" color="#fff" style={{ marginTop: 23, marginBottom: 30 }} />
                  ) : (
                    <View>

      <CustomButton
        title="Select Image"
        handlePress={pickImage}
        containerStyles={{marginTop: 23,
          marginBottom: 30,
          marginHorizontal: 30,
          paddingBottom: 200,
        }}
        isLoading={isSubmitting}
        
      />

      <CustomButton
        title="Analyze Image"
        handlePress={analyzeImage}
        containerStyles={{marginTop: 23,
          marginBottom: 30,
          marginHorizontal: 30}}
        isLoading={isSubmitting}
      />
      </View>
                  )

}

    </SafeAreaView>
    </ImageBackground>
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
    marginTop: 30,
    marginLeft:75,
    resizeMode: "cover",
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
  
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  safeArea: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  mainContainer: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 25,
  },
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
    alignItems: 'center',
  },
  description: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  responseText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  text_color: {
    color: 'red',
  },
  headerText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerContainer: {
    flexDirection: 'row', // flex-row
    alignItems: 'center', // items-center
    gap: 12, // gap-3 => approximately 12px
    paddingTop: 10, // pt-4 => 4*4 = 16
  },
});
