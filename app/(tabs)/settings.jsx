import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { signOut } from 'firebase/auth';
import CustomButton from '../../components/CustomButton';
import { router } from 'expo-router';
import { auth } from '../../lib/firebase';

const Settings = () => {

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <SafeAreaView>
      <Text>Settings Page</Text>
      <CustomButton
        title="Log Out"
        handlePress={handleSignOut}
        containerStyles={{ marginTop: 23, marginBottom: 30, marginHorizontal: 30, backgroundColor: '#E7201D' }}
      />
    </SafeAreaView>
  )
}

export default Settings
