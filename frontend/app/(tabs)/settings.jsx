import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { signOut } from 'firebase/auth';
import CustomButton from '../../components/CustomButton';
import { router } from 'expo-router';
import { auth } from '../../lib/firebase';
import Ionicons from '@expo/vector-icons/Ionicons';

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
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <Text style={styles.subtitle}>Support</Text>
      
      <TouchableOpacity style={styles.rowButton}>
        <Ionicons name="help-circle-outline" size={24} color="black" style={styles.icon} />
        <Text style={styles.rowButtonText}>Get Help</Text>
        <Ionicons name="chevron-forward" size={24} color="black" style={styles.arrowIcon} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.rowButton}>
        <Ionicons name="information-circle-outline" size={24} color="black" style={styles.icon} />
        <Text style={styles.rowButtonText}>About</Text>
        <Ionicons name="chevron-forward" size={24} color="black" style={styles.arrowIcon} />
      </TouchableOpacity>
      
      <Text style={styles.subtitle}>Legal</Text>
      
      <TouchableOpacity style={styles.rowButton}>
        <Ionicons name="document-text-outline" size={24} color="black" style={styles.icon} />
        <Text style={styles.rowButtonText}>Terms of Service</Text>
        <Ionicons name="chevron-forward" size={24} color="black" style={styles.arrowIcon} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.rowButton}>
        <Ionicons name="document-text-outline" size={24} color="black" style={styles.icon} />
        <Text style={styles.rowButtonText}>Privacy Policy</Text>
        <Ionicons name="chevron-forward" size={24} color="black" style={styles.arrowIcon} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.rowButton}>
        <Ionicons name="document-text-outline" size={24} color="black" style={styles.icon} />
        <Text style={styles.rowButtonText}>Do Not Sell My Info</Text>
        <Ionicons name="chevron-forward" size={24} color="black" style={styles.arrowIcon} />
      </TouchableOpacity>
      
      <CustomButton
        title="Log Out"
        handlePress={handleSignOut}
        containerStyles={{ marginTop: 23, marginBottom: 30, marginHorizontal: 30, backgroundColor: '#68B637' }}
      />
    </SafeAreaView>
  )
}

export default Settings

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    paddingTop: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 16,
    paddingTop: 18,
    paddingBottom: 4,
  },
  rowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  icon: {
    marginRight: 12,
  },
  rowButtonText: {
    flex: 1,
    fontSize: 16,
  },
  arrowIcon: {
    marginLeft: 'auto',
  }
});
