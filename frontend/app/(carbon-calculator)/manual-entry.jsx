import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  ActivityIndicator, 
  Alert, 
  Platform, 
  StyleSheet 
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { auth, db } from '../../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../../lib/AuthContext';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import CustomKeyboardView from '../../components/CustomKeyboardView';

const SignUp = () => {
  const [form, setForm] = useState({
    name: '',
    contents: '',
    weight: '',
    composition: '',
    location: '',
    usage: '',
    additional_usage: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateFields = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required.";
    } 

    return newErrors;
  };

  const submit = async () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      setIsSubmitting(true);
      try {
        // send to backend

      } catch (error) {
        setErrors({ general: error.message });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomKeyboardView >
        <View style={styles.mainContainer}>
          <Text style={styles.title}>Carbon Footprint Calculator</Text>

          {/* Form Field - Name */}
          <FormField
            title="Product Name"
            value={form.name}
            placeholder="Product Name"
            handleChangeText={(e) => setForm({ ...form, name: e })}
            containerStyles={{ marginTop: 20 }} // Replaces "mt-10" => 10*4=40
          />
          {errors.name && (
            <Text style={styles.errorMessage}>{errors.name}</Text>
          )}

          {/* Form Field - Contents */}
          <FormField
            title="Contents (Optional)"
            value={form.contents}
            placeholder="Contents"
            handleChangeText={(e) => setForm({ ...form, contents: e })}
            containerStyles={{ marginTop: 20 }}
          />
          {errors.contents && (
            <Text style={styles.errorMessage}>{errors.contents}</Text>
          )}

          {/* Form Field - Weight */}
          <FormField
            title="Weight (Optional)"
            value={form.weight}
            placeholder="Weight (e.g., in kg)"
            handleChangeText={(e) => setForm({ ...form, weight: e })}
            containerStyles={{ marginTop: 20 }}
            keyboardType="numeric" // For numeric input
          />
          {errors.weight && (
            <Text style={styles.errorMessage}>{errors.weight}</Text>
          )}

          {/* Form Field - Composition */}
          <FormField
            title="Material Composition (Optional)"
            value={form.composition}
            placeholder="Material Composition (e.g., Steel 50%, Plastic 20%)"
            handleChangeText={(e) => setForm({ ...form, composition: e })}
            containerStyles={{ marginTop: 20 }}
          />
          {errors.composition && (
            <Text style={styles.errorMessage}>{errors.composition}</Text>
          )}

          {/* Form Field - Location */}
          <FormField
            title="Manufacturing Location (Optional)"
            value={form.location}
            placeholder="Manufacturing location"
            handleChangeText={(e) => setForm({ ...form, location: e })}
            containerStyles={{ marginTop: 20 }}
          />
          {errors.location && (
            <Text style={styles.errorMessage}>{errors.location}</Text>
          )}

          {/* Form Field - Usage */}
          <FormField
            title="Usage (Optional)"
            value={form.usage}
            placeholder="Usage"
            handleChangeText={(e) => setForm({ ...form, usage: e })}
            containerStyles={{ marginTop: 20 }}
          />
          {errors.usage && (
            <Text style={styles.errorMessage}>{errors.usage}</Text>
          )}

          {/* Form Field - Additional Usage */}
          <FormField
            title="Additional Usage (Optional)"
            value={form.additional_usage}
            placeholder="Additional Usage (if any)"
            handleChangeText={(e) => setForm({ ...form, additional_usage: e })}
            containerStyles={{ marginTop: 20 }}
          />
          {errors.additional_usage && (
            <Text style={styles.errorMessage}>{errors.additional_usage}</Text>
          )}

          {errors.general && (
            <Text style={styles.errorMessage}>{errors.general}</Text>
          )}

          {isSubmitting ? (
            <ActivityIndicator 
              size="large" 
              color="#0000ff" 
              style={{ marginTop: 23, marginBottom: 30 }} 
            />
          ) : (
            <CustomButton
              title="Submit"
              handlePress={submit}
              containerStyles={{ marginTop: 23, marginBottom: 30 }}
              isLoading={isSubmitting}
            />
          )}
        </View>
      </CustomKeyboardView>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff', // Replace with your actual primary color
    flex: 1,
  },
  mainContainer: {
    width: '100%',
    height: '100%',
    // justifyContent: 'center',
    paddingHorizontal: 25, // px-4 => 16
  },
  title: {
    color: '#000',
    fontSize: 20,   // text-xl => 20
    fontWeight: 'bold',
    marginTop: 10,  // mt-4 => 16
  },
  errorMessage: {
    color: '#ef4444', 
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  footerText: {
    fontSize: 14,         // text-sm
    color: '#000',        // text-black
    textAlign: 'right',   // text-right
    fontFamily: 'pregular', 
    width: '66.6667%',    // w-2/3
    marginLeft: 20,       // ml-5 => 20
  },
  signInLink: {
    fontSize: 14,          // text-sm
    fontWeight: 'bold',
    color: '#68B637',      // Replace with your "secondary" color if you have one
    marginLeft: 4,         // ml-1 => 4
    width: '33.3333%',     // w-1/3
  },
});
