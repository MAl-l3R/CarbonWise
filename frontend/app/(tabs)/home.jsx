import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from "../../constants";
import { useAuth } from '../../lib/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';


const Home = () => {
  const { loading, currentUser } = useAuth();

  useEffect(()=>{
    if (!loading && !currentUser) {
      router.replace('/');
    }
  }, [loading, currentUser])

  return (
    <ImageBackground source={images.background} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Home</Text>
        <ActivityIndicator/>
    
        
        
      </SafeAreaView>
    </ImageBackground>
  )
}

export default Home;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover", // Ensures the image scales appropriately
  },
  container: { 
    flex: 1, 
    backgroundColor: "transparent", // Background transparency for the image to show
    alignItems: "center", 
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    paddingTop: 10,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#fff",
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
});
