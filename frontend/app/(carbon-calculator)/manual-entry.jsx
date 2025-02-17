import { 
  View, 
  Text, 
  ActivityIndicator, 
  StyleSheet,
  ImageBackground,
  Platform
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomKeyboardView from '../../components/CustomKeyboardView';
import axios from 'axios';
import { images } from "../../constants";

// Import the custom dropdown components
import DropdownMenu from '../../components/DropdownMenu/DropdownMenu';
import { MenuTrigger } from '../../components/DropdownMenu/MenuTrigger';
import { MenuOption } from '../../components/DropdownMenu/MenuOption';

const ManualEntry = () => {
  const [form, setForm] = useState({
    product_name: '',
    category: '',
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

  // Controls the visibility of the custom dropdown
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const validateFields = () => {
    const newErrors = {};

    if (!form.product_name.trim()) {
      newErrors.product_name = "Product Name is required.";
    }

    if (!form.category.trim()) {
      newErrors.category = "Product Category is required.";
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
          product_name: form.product_name,
          category: form.category,
          weight: form.weight || null,
          material_type: form.material_type || null,
          energy_consumption: form.energy_consumption || null,
          usage_frequency: form.usage_frequency || null,
          lifespan: form.lifespan || null,
          disposal_plan: form.disposal_plan || null,
          package_material: form.package_material || null,
          manu_location: form.manu_location || null,
          additional_info: form.additional_info || null,
        };

        const carbonfootprint = await axios.post(
          'http://10.0.0.191:3000/calculate-carbon-footprint',
          product_details
        );

        const reductiontips = await axios.post(
          'http://10.0.0.191:3000/reduce-carbon-footprint',
          product_details
        );

        router.push({
          pathname: '/results',
          params: {
            footprint: carbonfootprint.data.footprint,
            tips: reductiontips.data.tips,
            ...product_details
          },
        });
      } catch (error) {
        setErrors({ general: error.message });
        console.log('Error calculating carbon footprint: ', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <ImageBackground source={images.background} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <CustomKeyboardView>
          <View style={styles.mainContainer}>
            <View style={styles.headerContainer}>
              <Ionicons
                name="arrow-back-outline"
                size={24}
                color="white"
                onPress={() => {
                  router.back();
                }}
              />
              <Text style={styles.headerText}>Carbon Footprint Calculator</Text>
            </View>

            {/* Product Name */}
            <FormField
              title="Product Name"
              value={form.product_name}
              placeholder="(e.g., Laptop, Mug, Electric Car)"
              handleChangeText={(e) => setForm({ ...form, product_name: e })}
              containerStyles={{ marginTop: 20 }}
            />
            {errors.product_name && (
              <Text style={styles.errorMessage}>{errors.product_name}</Text>
            )}

            {/* Category Dropdown */}
            <Text style={styles.dropdownLabel}>Product Category</Text>
            <View style={styles.dropdownContainer}>
              <DropdownMenu
                visible={isMenuVisible}
                handleOpen={() => setIsMenuVisible(true)}
                handleClose={() => setIsMenuVisible(false)}
                dropdownWidth={350} // Adjust if needed
                dropdownStyle={{
                  marginTop: Platform.OS === 'android' ? -10 : 0,
                }}
                trigger={
                  <MenuTrigger>
                    <View style={styles.dropdownTouchable}>
                      <Text style={styles.dropdownText}>
                        {form.category || '-- Choose an option --'}
                      </Text>
                      <Ionicons name="chevron-down" size={20} color="#000" />
                    </View>
                  </MenuTrigger>
                }
              >
                <MenuOption
                  onSelect={() => {
                    setForm({ ...form, category: 'Transportation' });
                    setIsMenuVisible(false);
                  }}
                >
                  <Text>Transportation</Text>
                </MenuOption>
                <MenuOption
                  onSelect={() => {
                    setForm({ ...form, category: 'Energy Usage' });
                    setIsMenuVisible(false);
                  }}
                >
                  <Text>Energy Usage</Text>
                </MenuOption>
                <MenuOption
                  onSelect={() => {
                    setForm({ ...form, category: 'Food Consumption' });
                    setIsMenuVisible(false);
                  }}
                >
                  <Text>Food Consumption</Text>
                </MenuOption>
                <MenuOption
                  onSelect={() => {
                    setForm({ ...form, category: 'Consumer Goods & Shopping' });
                    setIsMenuVisible(false);
                  }}
                >
                  <Text>Consumer Goods & Shopping</Text>
                </MenuOption>
                <MenuOption
                  onSelect={() => {
                    setForm({ ...form, category: 'Waste Management & Recycling' });
                    setIsMenuVisible(false);
                  }}
                >
                  <Text>Waste Management & Recycling</Text>
                </MenuOption>
              </DropdownMenu>
            </View>
            {errors.category && (
              <Text style={styles.errorMessage}>{errors.category}</Text>
            )}

            {/* Usage Frequency */}
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

            {/* Weight */}
            <FormField
              title="Weight (Optional)"
              value={form.weight}
              placeholder="(e.g., 2 kg, 500 g, 1.5 tons)"
              handleChangeText={(e) => setForm({ ...form, weight: e })}
              containerStyles={{ marginTop: 20 }}
            />

            {/* Material Type */}
            <FormField
              title="Material Type (Optional)"
              value={form.material_type}
              placeholder="(e.g., plastic, metal, wood)"
              handleChangeText={(e) => setForm({ ...form, material_type: e })}
              containerStyles={{ marginTop: 20 }}
            />

            {/* Energy Consumption */}
            <FormField
              title="Energy Consumption (Optional)"
              value={form.energy_consumption}
              placeholder="(e.g., 50 kWh/year, 150W)"
              handleChangeText={(e) => setForm({ ...form, energy_consumption: e })}
              containerStyles={{ marginTop: 20 }}
            />

            {/* Expected Lifespan */}
            <FormField
              title="Expected Lifespan (Optional)"
              value={form.lifespan}
              placeholder="(e.g., 5 years, 10 years, 20 years)"
              handleChangeText={(e) => setForm({ ...form, lifespan: e })}
              containerStyles={{ marginTop: 20 }}
              keyboardType="numeric"
            />

            {/* Disposal Plan */}
            <FormField
              title="End-of-Life Disposal Plan (Optional)"
              value={form.disposal_plan}
              placeholder="(e.g., recyclable, landfill, compostable)"
              handleChangeText={(e) => setForm({ ...form, disposal_plan: e })}
              containerStyles={{ marginTop: 20 }}
            />

            {/* Packaging Material */}
            <FormField
              title="Packaging Material (Optional)"
              value={form.package_material}
              placeholder="(e.g., cardboard, foam, plastic wrap)"
              handleChangeText={(e) => setForm({ ...form, package_material: e })}
              containerStyles={{ marginTop: 20 }}
            />

            {/* Manufacturing Region */}
            <FormField
              title="Manufacturing Region (Optional)"
              value={form.manu_location}
              placeholder="(e.g., China, USA, Japan)"
              handleChangeText={(e) => setForm({ ...form, manu_location: e })}
              containerStyles={{ marginTop: 20 }}
            />

            {/* Additional Information */}
            <FormField
              title="Additional Information (Optional)"
              value={form.additional_info}
              placeholder="(e.g., petrol, 60% metal, solar-powered)"
              handleChangeText={(e) => setForm({ ...form, additional_info: e })}
              containerStyles={{ marginTop: 20 }}
              formFieldStyles={{ height: 148, paddingTop: 4, alignItems: 'stretch' }}
              multiline={true}
            />

            {errors.general && (
              <Text style={styles.errorMessage}>{errors.general}</Text>
            )}

            {isSubmitting ? (
              <ActivityIndicator 
                size="large" 
                color="#fff" 
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
    </ImageBackground>
  );
};

export default ManualEntry;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', 
  },
  safeArea: {
    backgroundColor: 'transparent', 
    flex: 1,
  },
  mainContainer: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 25,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 10,
  },
  headerText: {
    color: '#000',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  errorMessage: {
    color: '#ef4444', 
    marginTop: 4,
    fontWeight: '600',
    fontSize: 15,
  },

  // Dropdown for Category
  dropdownLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 5,
    color: '#fff',
  },
  dropdownContainer: {
    marginBottom: 10,
  },
  dropdownTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 8,
    opacity: 0.85,
  },
  dropdownText: {
    fontSize: 15,
    color: '#000',
  },
});
