import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CarbonCalculator = () => {
  const [formData, setFormData] = useState({
    name: '',
    contents: '',
    weight: '',
    composition: '',
    location: '',
    usage: '',
    additional_usage: '',
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    Alert.alert('Form Submitted', `Data: ${JSON.stringify(formData, null, 2)}`);
    // You can replace this with logic to send the data to a backend or further process it.
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Carbon Calculator</Text>

      {/* Name */}
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={formData.name}
        onChangeText={(text) => handleChange('name', text)}
      />

      {/* Contents */}
      <TextInput
        style={styles.input}
        placeholder="Contents"
        value={formData.contents}
        onChangeText={(text) => handleChange('contents', text)}
      />

      {/* Weight */}
      <TextInput
        style={styles.input}
        placeholder="Weight (e.g., in kg)"
        value={formData.weight}
        onChangeText={(text) => handleChange('weight', text)}
        keyboardType="numeric"
      />

      {/* Composition */}
      <TextInput
        style={styles.input}
        placeholder="Composition (e.g., Steel 50%, Plastic 20%)"
        value={formData.composition}
        onChangeText={(text) => handleChange('composition', text)}
      />

      {/* Location */}
      <TextInput
        style={styles.input}
        placeholder="Manufacturing Location"
        value={formData.location}
        onChangeText={(text) => handleChange('location', text)}
      />

      {/* Usage */}
      <TextInput
        style={styles.input}
        placeholder="Usage"
        value={formData.usage}
        onChangeText={(text) => handleChange('usage', text)}
      />

      {/* Additional Usage */}
      <TextInput
        style={styles.input}
        placeholder="Additional Usage (if any)"
        value={formData.additional_usage}
        onChangeText={(text) => handleChange('additional_usage', text)}
      />

      {/* Submit Button */}
      <Button title="Submit" onPress={handleSubmit} />
    </SafeAreaView>
  );
};

export default CarbonCalculator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
});
