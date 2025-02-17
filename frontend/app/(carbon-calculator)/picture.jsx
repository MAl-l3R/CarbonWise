// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   Alert,
//   Image,
//   StyleSheet,
//   ActivityIndicator,
//   ImageBackground
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import * as FileSystem from "expo-file-system";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { router } from "expo-router";

// import CustomButton from "../../components/CustomButton";
// import { images } from "../../constants";


// // If using .env or react-native-dotenv, import your backend URL here
// // import { BACKEND_URL } from '@env';

// export default function MergedTakeOrUploadPicture() {
//   // ---- States from both files ----
//   const [imageUri, setImageUri] = useState(null);
//   const [detectedObjects, setDetectedObjects] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // ----------------- TAKE PICTURE -----------------
//   const takePicture = async () => {
//     try {
//       const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
//       if (permissionResult.status !== "granted") {
//         Alert.alert("Permission Denied", "Camera permissions are required!");
//         return;
//       }

//       const result = await ImagePicker.launchCameraAsync({
//         allowsEditing: true, // Enables cropping
//         aspect: [4, 4], // Aspect ratio for cropping
//         quality: 1, // High quality
//       });

//       if (!result.canceled) {
//         setImageUri(result.assets[0].uri);
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert("Error", "An error occurred while taking the picture.");
//     }
//   };

//   // ----------------- PICK IMAGE -----------------
//   const pickImage = async () => {
//     try {
//       const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (permissionResult.status !== "granted") {
//         Alert.alert("Permission Denied", "Camera roll permissions are required!");
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 4],
//         quality: 1,
//       });

//       if (!result.canceled) {
//         setImageUri(result.assets[0].uri);
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert("Error", "An error occurred while selecting an image.");
//     }
//   };

//   // ----------------- ANALYZE IMAGE -----------------
//   const analyzeImage = async () => {
//     setIsSubmitting(true);

//     if (!imageUri) {
//       Alert.alert("Error", "Please take or select a picture first.");
//       setDetectedObjects("");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       // Convert image to Base64
//       const base64Image = await FileSystem.readAsStringAsync(imageUri, {
//         encoding: FileSystem.EncodingType.Base64,
//       });

//       // Example: fetch your backend endpoint
//       const response = await fetch(`http://10.0.0.234:3000/detect-objects`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ base64Image }),
//       });
//       const responseJson = await response.json();

//     //   // For demonstration, we call a different endpoint:
//     //   const response = await fetch(`http:/detect-objects`, {
//     //     method: "POST",
//     //     headers: { "Content-Type": "application/json" },
//     //     body: JSON.stringify({ base64Image }),
//     //   });
//     //   const responseJson = await response.json();

      
//     //   const responseJson = { objects: "Computer keyboard", success: true };

//       console.log("BACKEND RESPONSE:", responseJson);

//       if (responseJson.success === true) {
//         setDetectedObjects(responseJson.objects);

//         // Navigate if needed
//         router.push({
//           pathname: "/confirmation",
//           params: { description: responseJson.objects },
//         });

//         // Clear local state if you'd like after navigation
//         setDetectedObjects("");
//       } else {
//         setDetectedObjects("No objects detected. Try another image.");
//       }
//     } catch (error) {
//       console.error("Analysis Error:", error);
//       Alert.alert("Error", "An error occurred while analyzing the image.");
//       setDetectedObjects("");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // ----------------- TRY AGAIN -----------------
//   const tryAgain = () => {
//     // Clear the selected image and any detected objects
//     setImageUri(null);
//     setDetectedObjects("");
//     setIsSubmitting(false);
//   };

//   // ----------------- RENDER -----------------
//   return (
//     <ImageBackground source={images.background} style={styles.background}>
//       <SafeAreaView style={styles.safeArea}>
//         {/* Header */}
//         <View style={styles.headerContainer}>
//           <Ionicons
//             name="arrow-back-outline"
//             size={24}
//             color="white"
//             onPress={() => {
//               router.back();
//             }}
//           />
//           {/* Two titles (from each file) side by side */}
         
//           <Text style={styles.headerTextUpload}>Carbon Footprint Calculator</Text>
//         </View>

//         {/* Show the chosen/taken image */}
//         {imageUri && (
//           <Image
//             source={{ uri: imageUri }}
//             style={[styles.imageTake, styles.imageUpload]}
//           />
//         )}

//         {/* If no image & not submitting => show "Take Picture" & "Select Image" */}
//         {!imageUri && !isSubmitting && (
//           <View>
//             <CustomButton
//               title="Take Picture"
//               handlePress={takePicture}
//               containerStyles={{ marginTop: 23,
//                 marginBottom: 30,
//                 marginHorizontal: 30,
//                 paddingBottom: 200, }}
//                 backgroundImage={images.camera}
//                 backgroundStartsRight={true}
//             />

//             <CustomButton
//               title="Select Image"
//               handlePress={pickImage}
//               containerStyles={{
//                 marginTop: 23,
//                 marginBottom: 30,
//                 marginHorizontal: 30,
//                 paddingBottom: 200,
//               }}
//               backgroundImage={images.gallery}
//               isLoading={isSubmitting}
//               backgroundStartsRight={true}
//             />
//           </View>
//         )}

//         {/* If we have an image & not submitting => show "Analyze Image" and "Try Again" */}
//         {imageUri && !isSubmitting && (
//           <View>
//             <CustomButton
//               title="Analyze Image"
//               handlePress={analyzeImage}
//               containerStyles={{
//                 marginTop: 23,
//                 marginBottom: 30,
//                 marginHorizontal: 30,
            
//               }}
//               isLoading={isSubmitting}
//             />

//             <CustomButton
//               title="Try Again"
//               handlePress={tryAgain}
//               containerStyles={{
//                 marginTop: 10,
//                 marginBottom: 30,
//                 marginHorizontal: 30,
//               }}
//               textStyles={styles.text_color}
//               isLoading={false}
//             />
//           </View>
//         )}

//         {/* If isSubmitting => show spinner */}
//         {isSubmitting && (
//           <ActivityIndicator
//             size="large"
//             color="#fff"
//             style={{ marginTop: 23, marginBottom: 30 }}
//           />
//         )}

//         {/* Display any detected objects if not navigating away immediately */}
//         {detectedObjects !== "" && (
//           <View style={styles.resultsContainer}>
//             <Text style={styles.resultTitle}>Localized Objects:</Text>
//             <Text style={styles.objectText}>{detectedObjects}</Text>
//           </View>
//         )}
//       </SafeAreaView>
//     </ImageBackground>
//   );
// }

// // --------------------- STYLES ---------------------
// const styles = StyleSheet.create({
//   // From upload-picture.jsx
//   container: {
//     backgroundColor: "#ffffff",
//     flex: 1,
//     paddingHorizontal: 25,
//   },

//   // From take-picture.jsx
//   resultsContainer: {
//     marginTop: 20,
//     paddingHorizontal: 10,
//     alignItems: "flex-start",
//     width: "100%",
//   },
//   resultTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   objectText: {
//     fontSize: 16,
//     color: "#000",
//   },

//   // Common background
//   background: {
//     flex: 1,
//     resizeMode: "cover",
//   },

//   // SafeArea style from upload-picture
//   safeArea: {
//     backgroundColor: "transparent",
//     flex: 1,
//   },

//   // Header container
//   headerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     paddingTop: 10,
//     marginBottom: 10,
//     paddingHorizontal: 16,
//   },

//   // Original "headerText" from take-picture (white text)
//   headerTextTake: {
//     color: "#fff",
//     fontSize: 22,
//     fontWeight: "bold",
//   },
//   // Original "headerText" from upload-picture (black text)
//   headerTextUpload: {
//     color: "#fff",
//     fontSize: 22,
//     fontWeight: "bold",
//   },

//   // Merged image style – keep both sets of rules from each file
//   imageTake: {
//     width: 250,
//     height: 250,
//     marginBottom: 20,
//     borderRadius: 10,
//     resizeMode: "cover",
//   },
//   imageUpload: {
//     marginTop: 30,
//     marginLeft: 75,
//     resizeMode: "cover",
//   },
//   text_color: {
//     color: 'red',
//   },
  
// });

import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  Image,
  StyleSheet,
  ActivityIndicator,
  ImageBackground
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import CustomButton from "../../components/CustomButton";
import { images } from "../../constants";

export default function MergedTakeOrUploadPicture() {
  const [imageUri, setImageUri] = useState(null);
  const [detectedObjects, setDetectedObjects] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ----------------- TAKE PICTURE -----------------
  const takePicture = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.status !== "granted") {
        Alert.alert("Permission Denied", "Camera permissions are required!");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while taking the picture.");
    }
  };

  // ----------------- PICK IMAGE -----------------
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
        aspect: [4, 4],
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

  // ----------------- ANALYZE IMAGE -----------------
  const analyzeImage = async () => {
    setIsSubmitting(true);

    if (!imageUri) {
      Alert.alert("Error", "Please take or select a picture first.");
      setDetectedObjects("");
      setIsSubmitting(false);
      return;
    }

    try {
      // Convert image to Base64
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Post to your backend
      const response = await fetch(`http://10.0.0.234:3000/detect-objects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64Image }),
      });
      const responseJson = await response.json();

      console.log("BACKEND RESPONSE:", responseJson);

      if (responseJson.success === true) {
        // Check if the "objects" field indicates "No objects detected..."
        if (responseJson.objects === "No objects detected. Try another image.") {
          // Show pop-up error
          Alert.alert("Error", "No objects detected. Try another image.");
          // Remain on this page (don't navigate)
          setDetectedObjects("");
        } else {
          // Normal case -> navigate to Confirmation page
          setDetectedObjects(responseJson.objects);
          router.push({
            pathname: "/confirmation",
            params: { description: responseJson.objects },
          });
          // Optionally reset local state
          setDetectedObjects("");
        }
      } else {
        // success === false => show pop-up error
        Alert.alert("Error", "No objects detected. Try another image.");
        setDetectedObjects("");
      }
    } catch (error) {
      console.error("Analysis Error:", error);
      Alert.alert("Error", "An error occurred while analyzing the image.");
      setDetectedObjects("");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ----------------- TRY AGAIN -----------------
  const tryAgain = () => {
    // Clear the selected image and any detected objects
    setImageUri(null);
    setDetectedObjects("");
    setIsSubmitting(false);
  };

  // ----------------- RENDER -----------------
  return (
    <ImageBackground source={images.background} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Ionicons
            name="arrow-back-outline"
            size={24}
            color="white"
            onPress={() => {
              router.back();
            }}
          />
          <Text style={styles.headerTextUpload}>Carbon Footprint Calculator</Text>
        </View>

        {/* Show the chosen/taken image */}
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={[styles.imageTake, styles.imageUpload]}
          />
        )}

        {/* If no image & not submitting => show "Take Picture" & "Select Image" */}
        {!imageUri && !isSubmitting && (
          <View>
            <CustomButton
              title="Take Picture"
              handlePress={takePicture}
              containerStyles={{
                marginTop: 23,
                marginBottom: 30,
                marginHorizontal: 30,
                paddingBottom: 200,
              }}
              backgroundImage={images.camera}
              backgroundStartsRight={true}
            />

            <CustomButton
              title="Select Image"
              handlePress={pickImage}
              containerStyles={{
                marginTop: 23,
                marginBottom: 30,
                marginHorizontal: 30,
                paddingBottom: 200,
              }}
              backgroundImage={images.gallery}
              isLoading={isSubmitting}
              backgroundStartsRight={true}
            />
          </View>
        )}

        {/* If we have an image & not submitting => show "Analyze Image" and "Try Again" */}
        {imageUri && !isSubmitting && (
          <View>
            <CustomButton
              title="Analyze Image"
              handlePress={analyzeImage}
              containerStyles={{
                marginTop: 23,
                marginBottom: 30,
                marginHorizontal: 30,
              }}
              isLoading={isSubmitting}
            />

            <CustomButton
              title="Try Again"
              handlePress={tryAgain}
              containerStyles={{
                marginTop: 10,
                marginBottom: 30,
                marginHorizontal: 30,
              }}
              textStyles={styles.text_color}
              isLoading={false}
            />
          </View>
        )}

        {/* If isSubmitting => show spinner */}
        {isSubmitting && (
          <ActivityIndicator
            size="large"
            color="#fff"
            style={{ marginTop: 23, marginBottom: 30 }}
          />
        )}

        {/* Display any detected objects (if you want) */}
        {detectedObjects !== "" && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultTitle}>Localized Objects:</Text>
            <Text style={styles.objectText}>{detectedObjects}</Text>
          </View>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}

// --------------------- STYLES ---------------------
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    flex: 1,
    paddingHorizontal: 25,
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
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  safeArea: {
    backgroundColor: "transparent",
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 10,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  headerTextUpload: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  imageTake: {
    width: 250,
    height: 250,
    marginBottom: 20,
    borderRadius: 10,
    resizeMode: "cover",
  },
  imageUpload: {
    marginTop: 30,
    marginLeft: 75,
    resizeMode: "cover",
  },
  text_color: {
    color: "red",
  },
});
