import { View, Text, StyleSheet, ImageBackground } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from "../../constants";

const Home = () => {
  return (
    <ImageBackground source={images.background} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Home</Text>
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
});
