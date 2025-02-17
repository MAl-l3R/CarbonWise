import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { images } from '../../constants';
import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';

// Firestore
import { db } from '../../lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../../lib/AuthContext';

/** 
 * Helper to convert a Firestore Timestamp object or date string
 * into a human-readable date/time string.
 */
const parseTimestamp = (ts) => {
  if (!ts) return 'N/A';

  if (typeof ts === 'object' && (ts.seconds || ts._seconds)) {
    const seconds = ts.seconds ?? ts._seconds;
    const d = new Date(seconds * 1000);
    return d.toLocaleString();
  }

  if (typeof ts === 'string') {
    const maybeDate = new Date(ts);
    if (!isNaN(maybeDate.getTime())) {
      return maybeDate.toLocaleString();
    }
  }

  return 'N/A';
};

const Details = () => {
  const router = useRouter();
  const { currentUser } = useAuth();

  // Read product attributes from query params
  const {
    id,
    product_name,
    category,
    footprint,
    additional_info,
    tips,
    date_added,
  } = useLocalSearchParams();

  // Convert the date_added param (if any)
  const dateValue = parseTimestamp(date_added);

  // Delete product
  const handleDelete = async () => {
    try {
      if (!id) {
        Alert.alert('Error', 'No product ID was provided.');
        return;
      }
      if (!currentUser || !currentUser.uid) {
        Alert.alert('Error', 'No user is logged in.');
        return;
      }

      const docRef = doc(db, 'accounts', currentUser.uid, 'products', id);
      await deleteDoc(docRef);

      router.replace('/home');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete product. Please try again.');
      console.error('Error deleting product:', error);
    }
  };

  // Cancel => navigate back to home
  const handleCancel = () => {
    router.replace('/home');
  };

   // Function to parse and render bold text
    const renderTipsWithBold = (tips) => {
      // Regex to identify **bold** text
      const boldRegex = /\*\*(.+?)\*\*/g;
  
      // Split the text into parts (plain text and bold text)
      const parts = tips.split(boldRegex);
  
      // Map through parts and render with appropriate style
      return parts.map((part, index) =>
        boldRegex.test(`**${part}**`) ? (
          <Text key={index} style={{ fontWeight: 'bold', color: '#324958' }}>
            {part}
          </Text>
        ) : (
          <Text key={index} style={{ color: '#324958' }}>
            {part}
          </Text>
        )
      );
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
            onPress={() => router.back()}
          />
          <Text style={styles.headerText}>Product Details</Text>
        </View>

        {/* Use a ScrollView so content can exceed screen height */}
        <ScrollView
          style={styles.mainContainer}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Product Name */}
          <FormField
            title="Product Name"
            value={product_name || 'Unknown Product'}
            placeholder=""
            containerStyles={styles.fieldContainer}
            formFieldStyles={styles.fieldStyle}
            editable={false}
          />

          {/* Category */}
          <FormField
            title="Category"
            value={category || 'N/A'}
            placeholder=""
            containerStyles={styles.fieldContainer}
            formFieldStyles={styles.fieldStyle}
            editable={false}
          />

          {/* Footprint */}
          <FormField
            title="Carbon Footprint"
            value={footprint || 'N/A'}
            placeholder=""
            containerStyles={styles.fieldContainer}
            formFieldStyles={styles.fieldStyle}
            editable={false}
          />

          {/* Reduction Tips Section */}
          <Text style={styles.tipsTitle}>Carbon Footprint Reduction Tips</Text>
          <View style={styles.tipsContainer}>
            {tips ? (
              <Text style={styles.tipText}>
                {renderTipsWithBold(tips)}
              </Text>
            ) : (
              <Text style={styles.noTipsText}>No tips available for this item.</Text>
            )}
          </View>

          {/* Delete / Cancel */}
          <View style={{ marginTop: 30 }}>
            <CustomButton
              title="Delete"
              handlePress={handleDelete}
              containerStyles={{ marginBottom: 20 }}
              textStyles={{ color: 'red' }}
            />
            <CustomButton
              title="Cancel"
              handlePress={handleCancel}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Details;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  safeArea: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  // Let the ScrollView handle the page height
  mainContainer: {
    width: '100%',
    // Removed height: '100%' so the content can scroll
    paddingHorizontal: 25,
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
  fieldContainer: {
    marginTop: 12,
  },
  fieldStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingTop: 4,
  },
  tipsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Semi-transparent white background
    borderRadius: 12,
    padding: 20,
    marginTop: 12,
    marginBottom: 20,
  },
  tipsTitle: {
    color: '#fff',
    fontWeight: 600,
    fontSize: 16,
    fontFamily: 'pmedium',
    marginTop: 12,
  },
  tipText: {
    fontSize: 16,
    color: '#324958',
    lineHeight: 22, // Ensures proper spacing for multi-line text
    textAlign: 'justify',
  },
  noTipsText: {
    fontSize: 16,
    color: '#6D6D6D',
    fontStyle: 'italic',
    textAlign: 'justify',
  }, 
});
