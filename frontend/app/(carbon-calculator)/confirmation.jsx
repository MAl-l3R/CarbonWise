import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ImageBackground, ScrollView, ActivityIndicator, Alert } from 'react-native';
import CustomButton from '../../components/CustomButton';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { images } from '../../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import axios from 'axios'; // Import axios
import Ionicons from '@expo/vector-icons/Ionicons';

const Confirmation = () => {
  const [form, setForm] = useState({
    product_type: '',
    additional_info: '', // Ensure consistency
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const params = useLocalSearchParams();
  const productName = params.description || "Unknown Product";

  const submit = async () => {
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);

    try {
      const productDetails = {
        product_name: productName,
        additional_info: form.additional_info || null,
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

  return (
    <ImageBackground source={images.background} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
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
        <ScrollView style={styles.mainContainer}>
          <View style={styles.resultCard}>
            <Text style={styles.description}>Recognized Object:</Text>
            <Text style={styles.responseText}>{productName}</Text>
          </View>

          <FormField
              title="Additional Information (Optional)"
              value={form.additional_info}
              placeholder="(e.g., petrol, 60% metal, solar-powered)"
              handleChangeText={(e) => setForm({ ...form, additional_info: e })}
              containerStyles={{ marginTop: 20 }}
              formFieldStyles={{height: 148, paddingTop: 4, alignItems: 'stretch', backgroundColor: 'rgba(255, 255, 255, 0.85)'}}
              multiline={true}
            />

            {isSubmitting ? (
              <ActivityIndicator size="large" color="#fff" style={{ marginTop: 23, marginBottom: 30 }} />
            ) : (
              <View>
              <CustomButton
                title="Calculate"
                handlePress={submit}
                containerStyles={{ marginTop: 23, marginBottom: 30 }}
                isLoading={isSubmitting}
              />
              <CustomButton
                title="Try again"
                textStyles={styles.text_color}
                handlePress={tryagain}
                containerStyles={{ marginTop: 1, marginBottom: 30 }}
                isLoading={isSubmitting}
              />
              </View>
              

        
            )}
          
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

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

export default Confirmation;
