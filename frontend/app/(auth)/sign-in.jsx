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
import { auth } from '../../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../../lib/AuthContext';

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loading, currentUser } = useAuth();

  const validateFields = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!emailPattern.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
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
        const userCredential = await signInWithEmailAndPassword(
          auth, 
          form.email, 
          form.password
        );
        const currentUser = userCredential.user; 
      } catch (error) {
        if (error.code === 'auth/invalid-credential') {
          setErrors({ general: "Invalid credentials." });
        } else {
          setErrors({ general: error.message });
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Redirect to home when user is logged in and data is ready
  useEffect(() => {
    if (currentUser && !loading) {
      router.replace('/home');
    }
  }, [currentUser, loading]); // Only run when currentUser or loading changes

  return (
    <SafeAreaView style={styles.safeArea}>
      <View>
        <View style={styles.mainContainer}>
          <View style={styles.logoContainer}>
            <Image 
              source={images.logo} 
              style={styles.logo} 
              resizeMode='contain'
            />
            <Text style={styles.carbonPart}>Carbon</Text>
            <Text style={styles.wisePart}>Wise</Text>
          </View>

          <Text style={styles.title}>Log in to your account</Text>

          {/* Form Field - Email */}
          <FormField
            title="Email Address"
            value={form.email}
            placeholder="Email Address"
            handleChangeText={(e) => setForm({ ...form, email: e })}
            containerStyles={{ marginTop: 20 }} // Replaces "mt-10" => 10*4=40
            formFieldStyles={{backgroundColor: '#f3f4f6'}}
            labelStyles={{color:'#000', fontWeight: 400}}
            keyboardType="email-address"
          />
          {errors.email && (
            <Text style={styles.errorMessage}>{errors.email}</Text>
          )}

          {/* Form Field - Password */}
          <FormField 
            title="Password"
            placeholder="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            containerStyles={{ marginTop: 20 }} // Replaces "mt-5" => 5*4=20
            formFieldStyles={{backgroundColor: '#f3f4f6'}}
            labelStyles={{color:'#000', fontWeight: 400}}
            secureTextEntry={true}
          />
          {errors.password && (
            <Text style={styles.errorMessage}>{errors.password}</Text>
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
              title="Sign In"
              handlePress={submit}
              containerStyles={{ marginTop: 23, marginBottom: 30, backgroundColor: '#68B637' }}
              textStyles={{color: 'white'}}
              isLoading={isSubmitting}
            />
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
            </Text>
            <Link href="/sign-up" style={styles.signUpLink}>
              Sign Up
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff', // Replace with your actual primary color
    flex: 1,
  },
  mainContainer: {
    width: '100%',
    minHeight: '95%',
    justifyContent: 'center',
    paddingHorizontal: 25, // px-4 => 16
  },
  logoContainer: {
    // flexDirection row => side-by-side 
    flexDirection: 'row', 
    alignItems: 'center',
    marginBottom: 10, // some space below the logo row
    marginLeft: -24,
  },
  logo: {
    width: 75,
    height: 75,
  },
  carbonPart: {
    fontSize: 36,
    fontWeight: '700',
    color: '#2E8B57', // Dark green tone
    marginLeft: -12,
  },
  wisePart: {
    fontSize: 36,
    fontWeight: '700',
    color: '#68B637', // Light green
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
  signUpLink: {
    fontSize: 14,          // text-sm
    fontWeight: 'bold',
    color: '#68B637',         // Replace with your "secondary" color if you have one
    marginLeft: 4,         // ml-1 => 4
    width: '33.3333%',     // w-1/3
  },
});
