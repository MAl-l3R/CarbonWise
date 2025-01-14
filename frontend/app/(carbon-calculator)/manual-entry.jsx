import { 
  View, 
  Text, 
  ActivityIndicator, 
  StyleSheet 
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomKeyboardView from '../../components/CustomKeyboardView';
import axios from 'axios';

const ManualEntry = () => {
  const [form, setForm] = useState({
    product: '',
    functionality: '',
    weight: '',
    material_type: '',
    energy_consumption: '',
    usage_frequency: '',
    lifespan: '',
    disposal_plan: '',
    package_material: '',
    manu_location: '',
    additional_info: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateFields = () => {
    const newErrors = {};

    if (!form.product.trim()) {
      newErrors.product = "Product Name is required.";
    }

    if (!form.functionality.trim()) {
      newErrors.functionality = "Product Functionality is required.";
    }

    if (!form.usage_frequency.trim()) {
      newErrors.usage_frequency = "Usage Frequency is required.";
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
        const product_details = {
          product: form.product,
          functionality: form.functionality,
          weight: form.weight || null,
          material_type: form.material_type || null,
          energy_consumption: form.energy_consumption || null,
          usage_frequency: form.usage_frequency || null,
          lifespan: form.lifespan || null,
          disposal_plan: form.disposal_plan || null,
          package_material: form.package_material || null,
          manu_location: form.manu_location || null,
          additional_info: form.additional_info || null,
        }

        const carbonfootprint = await axios.post(
          'http://localhost:3000/calculate-carbon-footprint',
          product_details
        );

        const reductiontips = await axios.post(
          'http://localhost:3000/reduce-carbon-footprint',
          product_details
        );
  
        // console.log('Carbon Footprint:', carbonfootprint.data.footprint);
        // console.log('Reduction Tips:', reductiontips.data.tips);

        router.push({
          pathname: '/results',
          params: {footprint: carbonfootprint.data.footprint, tips: reductiontips.data.tips, ...product_details},
        });

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
          <View style={styles.headerContainer}>
            <Ionicons
              name="arrow-back-outline"
              size={24}
              color="black"
              onPress={() => {
                router.back();
              }}
            />
            <Text style={styles.headerText}>Carbon Footprint Calculator</Text>
          </View>

          {/* Form Field - Product Name */}
          <FormField
            title="Product Name"
            value={form.product}
            placeholder="(e.g., Laptop, Mug, Electric Car)"
            handleChangeText={(e) => setForm({ ...form, product: e })}
            containerStyles={{ marginTop: 20 }}
          />
          {errors.product && (
            <Text style={styles.errorMessage}>{errors.product}</Text>
          )}

          {/* Form Field - Functionality */}
          <FormField
            title="Functionality"
            value={form.functionality}
            placeholder="(e.g., electronic, kitchenware, vehicle)"
            handleChangeText={(e) => setForm({ ...form, functionality: e })}
            containerStyles={{ marginTop: 20 }}
          />
          {errors.functionality && (
            <Text style={styles.errorMessage}>{errors.functionality}</Text>
          )}

          {/* Form Field - Usage Frequency */}
          <FormField
            title="Usage Frequency"
            value={form.usage_frequency}
            placeholder="(e.g., daily, 4 hours/week, mileage)"
            handleChangeText={(e) => setForm({ ...form, usage_frequency: e })}
            containerStyles={{ marginTop: 20 }}
          />
          {errors.usage_frequency && (
            <Text style={styles.errorMessage}>{errors.usage_frequency}</Text>
          )}

          {/* Form Field - Weight */}
          <FormField
            title="Weight (Optional)"
            value={form.weight}
            placeholder="(e.g., 2 kg, 500 g, 1.5 tons)"
            handleChangeText={(e) => setForm({ ...form, weight: e })}
            containerStyles={{ marginTop: 20 }}
          />

          {/* Form Field - Material Type */}
          <FormField
            title="Material Type (Optional)"
            value={form.material_type}
            placeholder="(e.g., plastic, metal, wood)"
            handleChangeText={(e) => setForm({ ...form, material_type: e })}
            containerStyles={{ marginTop: 20 }}
          />

          {/* Form Field - Energy Consumption */}
          <FormField
            title="Energy Consumption (Optional)"
            value={form.energy_consumption}
            placeholder="(e.g., 50 kWh/year, 150W)"
            handleChangeText={(e) => setForm({ ...form, energy_consumption: e })}
            containerStyles={{ marginTop: 20 }}
          />

          {/* Form Field - Expected Lifespan */}
          <FormField
            title="Expected Lifespan (Optional)"
            value={form.lifespan}
            placeholder="(e.g., 5 years, 10 years, 20 years)"
            handleChangeText={(e) => setForm({ ...form, lifespan: e })}
            containerStyles={{ marginTop: 20 }}
            keyboardType="numeric"
          />

          {/* Form Field - Disposal Plan */}
          <FormField
            title="End-of-Life Disposal Plan (Optional)"
            value={form.disposal_plan}
            placeholder="(e.g., recyclable, landfill, compostable)"
            handleChangeText={(e) => setForm({ ...form, disposal_plan: e })}
            containerStyles={{ marginTop: 20 }}
          />

          {/* Form Field - Packaging Material */}
          <FormField
            title="Packaging Material (Optional)"
            value={form.package_material}
            placeholder="(e.g., cardboard, foam, plastic wrap)"
            handleChangeText={(e) => setForm({ ...form, package_material: e })}
            containerStyles={{ marginTop: 20 }}
          />

          {/* Form Field - Manufacturing Location */}
          <FormField
            title="Manufacturing Region (Optional)"
            value={form.manu_location}
            placeholder="(e.g., China, USA, Japan)"
            handleChangeText={(e) => setForm({ ...form, manu_location: e })}
            containerStyles={{ marginTop: 20 }}
          />

          {/* Form Field - Additional Information */}
          <FormField
            title="Additional Information (Optional)"
            value={form.additional_info}
            placeholder="(e.g., petrol, 60% metal, solar-powered)"
            handleChangeText={(e) => setForm({ ...form, additional_info: e })}
            containerStyles={{ marginTop: 20 }}
            formFieldStyles={{height: 148, paddingTop: 4}}
            multiline={true}
          />

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
              title="Calculate"
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

export default ManualEntry;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff', // Replace with your actual primary color
    flex: 1,
  },
  mainContainer: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 25, // px-4 => 16
  },
  headerContainer: {
    flexDirection: 'row', // flex-row
    alignItems: 'center', // items-center
    gap: 12, // gap-3 => approximately 12px
    paddingTop: 16, // pt-4 => 4*4 = 16
    paddingBottom: 4,
  },
  headerText: {
    color: '#000',
    fontSize: 22,   // text-xl => 20
    fontWeight: 'bold',
  },
  errorMessage: {
    color: '#ef4444', 
    marginTop: 4,
  },
});
