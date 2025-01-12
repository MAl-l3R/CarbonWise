import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import React from 'react'

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
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
      <Text style={[styles.buttonText, textStyles]}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#68B637', // Replace with your "bg-secondary" color
    borderRadius: 12,       // rounded-xl
    minHeight: 40,          // min-h-[40px]
    justifyContent: 'center',
    alignItems: 'center',
    // Android Shadow
    elevation: 8,
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  opacity50: {
    opacity: 0.5, // For isLoading
  },
  buttonText: {
    color: '#fff',        // Replace with your "text-primary" color
    width: '100%',        // w-full
    fontWeight: 'bold',
    textAlign: 'center',  // text-center
  },
})
