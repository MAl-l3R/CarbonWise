import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';

const Results = () => {
  const item = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{JSON.stringify(item, null, 2)}</Text>
    </View>
  );
};

export default Results;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'left',
  },
});
