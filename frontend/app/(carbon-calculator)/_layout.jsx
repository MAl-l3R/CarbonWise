import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const CarbonCalculatorLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen 
          name="manual-entry"
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="upload-image"
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="take-picture"
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="results"
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="confirmation"
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="picture"
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="details"
          options={{headerShown: false}}
        />
      </Stack>
      <StatusBar backgroundColor='transparent' style='light' />
    </>
  )
}

export default CarbonCalculatorLayout
