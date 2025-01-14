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
      </Stack>
      <StatusBar style="auto" />
      {/* <StatusBar backgroundColor='#ffffff' style='dark' /> */}
    </>
  )
}

export default CarbonCalculatorLayout
