import { ImageBackground, StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { images } from "../../constants";
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomButton from '../../components/CustomButton';

const Results = () => {
  const item = useLocalSearchParams();

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

  // Save Product to Firebase function
  const saveProduct = async () => {
      try {
        // Save item to Firebase

        // On success, redirect to user's dashboard in home screen
        router.replace('/home');
      } catch (error) {
        console.error('Error saving product: ', error);
      }
    };

  return (
    <ImageBackground source={images.background} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.mainContainer}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <Ionicons
              name="arrow-back-outline"
              size={24}
              color="white"
              onPress={() => router.back()}
            />
            <Text style={styles.headerText}>Results</Text>
          </View>

          {/* Content */}
          {/* Carbon Footprint Display */}
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Carbon Footprint</Text>
            <Text style={styles.resultValue}>{item.footprint}</Text>
          </View>

          {/* Reduction Tips Section */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>How to Reduce Your Carbon Footprint for Your {item.product}?</Text>
            {item.tips ? (
              <Text style={styles.tipText}>
                {renderTipsWithBold(item.tips)}
              </Text>
            ) : (
              <Text style={styles.noTipsText}>No tips available for this item.</Text>
            )}
          </View>

          <CustomButton
            title="Save Product"
            handlePress={saveProduct}
            containerStyles={{
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Results;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Ensures the background image scales properly
  },
  safeArea: {
    backgroundColor: 'transparent', // Transparent to let the background image show
    flex: 1,
  },
  mainContainer: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 25,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#324958', // Dark greenish text color
    marginBottom: 10,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E5A4F', // Slightly lighter green
  },
  tipsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#324958',
    marginBottom: 10,
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
