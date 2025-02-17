import { TouchableOpacity, Text, StyleSheet, ImageBackground, View } from 'react-native';
import React from 'react';

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  backgroundImage,
  backgroundStartsLeft,
  backgroundStartsRight,
  backgroundForGallery
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        styles.button,
        isLoading && styles.opacity50,
        containerStyles,
      ]}
      disabled={isLoading}
    >
      {backgroundImage && (
        <ImageBackground
          source={backgroundImage}
          style={[
            styles.backgroundImage,
            backgroundStartsLeft
              ? styles.backgroundStartsLeft
              : backgroundStartsRight
              ? styles.backgroundStartsRight
              : backgroundForGallery
              ? styles.backgroundForGallery
              : null
          ]}
          imageStyle={{ opacity: 0.3, borderRadius: 12 }}
        />
      )}
      <View style={styles.textContainer}>
        <Text style={[styles.buttonText, textStyles]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Replace with your "bg-secondary" color
    borderRadius: 12, // rounded-xl
    minHeight: 40, // min-h-[40px]
    justifyContent: 'center',
    alignItems: 'center',
    // Android Shadow
    elevation: 8,
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    overflow: 'hidden', // Ensure background image respects borderRadius
    position: 'relative',
  },
  opacity50: {
    opacity: 0.5, // For isLoading
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject, // Fills the entire button
  },
  backgroundStartsLeft: {
    width: '140%', // Enlarges the image
    left: '-60%', // Shifts the image to start from the left
  },
  backgroundStartsRight: {
    width: '120%', // Enlarges the image
    left: '-3%',  // Shifts the image to start from the left
    transform: [{ rotate: '10deg' }]
  },
  backgroundForGallery: {
    width: '120%', // Enlarges the image
    left: '-23%', // Shifts the image to start from the left
    transform: [{ rotate: '-10deg' }]
  },
  textContainer: {
    position: 'absolute', // Ensures text remains unaffected by the background
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#324958', // #2E5A4F
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
