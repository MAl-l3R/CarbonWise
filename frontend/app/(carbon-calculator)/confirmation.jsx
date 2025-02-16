// import React, { useState } from 'react';
// import { View, Text, Button, StyleSheet, ImageBackground, ScrollView, ActivityIndicator, Alert } from 'react-native';
// import CustomButton from '../../components/CustomButton';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import { images } from '../../constants';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import FormField from '../../components/FormField';
// import axios from 'axios'; // Import axios
// import Ionicons from '@expo/vector-icons/Ionicons';

// const Confirmation = () => {
//   const [form, setForm] = useState({
//     product_type: '',
//     additional_info: '', // Ensure consistency
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   const router = useRouter();
//   const params = useLocalSearchParams();
//   const productName = params.description || "Unknown Product";

//   const submit = async () => {
//     if (isSubmitting) return; // Prevent multiple submissions
//     setIsSubmitting(true);

//     try {
//       const productDetails = {
//         product_name: productName,
//         additional_info: form.additional_info || null,
//       };

//       // Send API requests
//       const [carbonFootprint, reductionTips] = await Promise.all([
//         axios.post('http://localhost:3000/calculate-carbon-footprint', productDetails),
//         axios.post('http://localhost:3000/reduce-carbon-footprint', productDetails),
//       ]);

//       // Navigate to results page
//       router.push({
//         pathname: '/results',
//         params: {
//           footprint: carbonFootprint.data.footprint,
//           tips: reductionTips.data.tips,
//           ...productDetails,
//         },
//       });

//     } catch (error) {
//       Alert.alert('Error', 'Failed to calculate carbon footprint. Please try again.');
//       console.error('Error:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const tryagain = () => {
//     router.push('/upload-image');
//   };

//   return (
//     <ImageBackground source={images.background} style={styles.background}>
//       <SafeAreaView style={styles.safeArea}>
//       <View style={styles.headerContainer}>
//         <Ionicons
//           name="arrow-back-outline"
//           size={24}
//           color="white"
//           onPress={() => {
//             router.back();
//           }}
//         />
//         <Text style={styles.headerText}>Carbon Footprint Calculator</Text>
//       </View>
//         <ScrollView style={styles.mainContainer}>
//           <View style={styles.resultCard}>
//             <Text style={styles.description}>Recognized Object:</Text>
//             <Text style={styles.responseText}>{productName}</Text>
//           </View>

//           <FormField
//               title="Additional Information (Optional)"
//               value={form.additional_info}
//               placeholder="(e.g., petrol, 60% metal, solar-powered)"
//               handleChangeText={(e) => setForm({ ...form, additional_info: e })}
//               containerStyles={{ marginTop: 20 }}
//               formFieldStyles={{height: 148, paddingTop: 4, alignItems: 'stretch', backgroundColor: 'rgba(255, 255, 255, 0.85)'}}
//               multiline={true}
//             />

//             {isSubmitting ? (
//               <ActivityIndicator size="large" color="#fff" style={{ marginTop: 23, marginBottom: 30 }} />
//             ) : (
//               <View>
//               <CustomButton
//                 title="Calculate"
//                 handlePress={submit}
//                 containerStyles={{ marginTop: 23, marginBottom: 30 }}
//                 isLoading={isSubmitting}
//               />
//               <CustomButton
//                 title="Try again"
//                 textStyles={styles.text_color}
//                 handlePress={tryagain}
//                 containerStyles={{ marginTop: 1, marginBottom: 30 }}
//                 isLoading={isSubmitting}
//               />
//               </View>
              

        
//             )}
          
//         </ScrollView>
//       </SafeAreaView>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     resizeMode: 'cover',
//   },
//   safeArea: {
//     backgroundColor: 'transparent',
//     flex: 1,
//   },
//   mainContainer: {
//     width: '100%',
//     height: '100%',
//     paddingHorizontal: 25,
//   },
//   resultCard: {
//     backgroundColor: 'rgba(255, 255, 255, 0.85)',
//     borderRadius: 12,
//     padding: 16,
//     marginVertical: 20,
//     alignItems: 'center',
//   },
//   description: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   responseText: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   text_color: {
//     color: 'red',
//   },
//   headerText: {
//     color: 'white',
//     fontSize: 22,
//     fontWeight: 'bold',
//   },
//   headerContainer: {
//     flexDirection: 'row', // flex-row
//     alignItems: 'center', // items-center
//     gap: 12, // gap-3 => approximately 12px
//     paddingTop: 10, // pt-4 => 4*4 = 16
//   },
// });

// export default Confirmation;

// 


import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CustomButton from '../../components/CustomButton';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { images } from '../../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';

const Confirmation = () => {
  const [form, setForm] = useState({
    product_type: '',
    additional_info: '',
    functionality: '', // Store the selected category
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPickerVisible, setIsPickerVisible] = useState(false); // Controls the Picker modal visibility

  const router = useRouter();
  const params = useLocalSearchParams();
  const productName = params.description || 'Unknown Product';

  const submit = async () => {
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);

    // 1) Check if "functionality" was selected
    if (!form.functionality) {
      Alert.alert('Error', 'Please select a category before continuing!');
      setIsSubmitting(false);
      return;
    }

    try {
      const productDetails = {
        product_name: productName,
        additional_info: form.additional_info || null,
        functionality: form.functionality, // We already checked it's not empty
      };

      // Send API requests
      const [carbonFootprint, reductionTips] = await Promise.all([
        axios.post('http://localhost:3000/calculate-carbon-footprint', productDetails),
        axios.post('http://localhost:3000/reduce-carbon-footprint', productDetails),
      ]);

      // Navigate to results page
      router.push({
        pathname: '/results',
        params: {
          footprint: carbonFootprint.data.footprint,
          tips: reductionTips.data.tips,
          ...productDetails,
        },
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to calculate carbon footprint. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tryagain = () => {
    router.push('/upload-image');
  };

  // Handle picking a category
  const handlePickerChange = (itemValue) => {
    setForm((prev) => ({ ...prev, functionality: itemValue }));
    // If user selected an actual category (non-empty), close the modal
    if (itemValue) {
      setIsPickerVisible(false);
    }
  };

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
          <Text style={styles.headerText}>Carbon Footprint Calculator</Text>
        </View>

        <ScrollView
          style={styles.mainContainer}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Recognized Object Card */}
          <View style={styles.resultCard}>
            <Text style={styles.description}>Recognized Object:</Text>
            <Text style={styles.responseText}>{productName}</Text>
          </View>

          {/* Custom Dropdown Field */}
          <Text style={styles.dropdownLabel}>Select Category:</Text>
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              onPress={() => setIsPickerVisible(true)}
              style={styles.dropdownTouchable}
            >
              <Text style={styles.dropdownText}>
                {form.functionality || '-- Choose an option --'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Modal with Picker */}
          <Modal
            visible={isPickerVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setIsPickerVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Category</Text>
                <Picker
                  selectedValue={form.functionality}
                  onValueChange={handlePickerChange}
                  style={{ width: '100%' }}
                >
                  <Picker.Item label="-- Choose an option --" value="" />
                  <Picker.Item label="Transportation" value="Transportation" />
                  <Picker.Item label="Energy Usage" value="Energy Usage" />
                  <Picker.Item label="Food Consumption" value="Food Consumption" />
                  <Picker.Item
                    label="Consumer Goods & Shopping"
                    value="Consumer Goods & Shopping"
                  />
                  <Picker.Item
                    label="Waste Management & Recycling"
                    value="Waste Management & Recycling"
                  />
                </Picker>
              </View>
            </View>
          </Modal>

          {/* Additional Info Field */}
          <FormField
            title="Additional Information (Optional)"
            value={form.additional_info}
            placeholder="(e.g., petrol, 60% metal, solar-powered)"
            handleChangeText={(val) => setForm({ ...form, additional_info: val })}
            containerStyles={{ marginTop: 20 }}
            formFieldStyles={{
              height: 148,
              paddingTop: 4,
              alignItems: 'stretch',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
            }}
            multiline
          />

          {/* Submission Buttons */}
          {isSubmitting ? (
            <ActivityIndicator
              size="large"
              color="#fff"
              style={{ marginTop: 23, marginBottom: 30 }}
            />
          ) : (
            <View>
              <CustomButton
                title="Calculate"
                handlePress={submit}
                containerStyles={{ marginTop: 23, marginBottom: 30 }}
              />
              <CustomButton
                title="Try again"
                textStyles={styles.text_color}
                handlePress={tryagain}
                containerStyles={{ marginTop: 1, marginBottom: 30 }}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Confirmation;

const styles = StyleSheet.create({
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 10,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  headerText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  dropdownLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
    color: '#fff',
  },
  dropdownContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 8,
    marginBottom: 20,
  },
  dropdownTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  dropdownText: {
    fontSize: 15,
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
});
