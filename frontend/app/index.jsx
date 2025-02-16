import { 
  ActivityIndicator, 
  Image, 
  ScrollView, 
  StyleSheet, 
  Text, 
  View 
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { images } from '../constants';
import { useAuth } from '../lib/AuthContext'; // Import the useAuth hook
import CustomButton from '../components/CustomButton';

const App = () => {
  const { currentUser, setCurrentUser, loading } = useAuth(); // Get the current user and loading state
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && !loading && currentUser) {
      router.replace('/home'); // Redirect to /home if the user is logged in
    }
  }, [isFocused, loading, currentUser]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeAreaLoading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View>
        <View style={styles.mainContainer}>
          <Image
            source={images.logo}
            style={styles.logo}
            resizeMode='contain'
          />
          
           {/* Highlight "CarbonWise" and add a tagline */}
          <View style={styles.headingContainer}>
              <Text style={styles.heading}>
              Welcome to 
              <Text style={styles.carbonPart}> Carbon</Text>
              <Text style={styles.wisePart}>Wise</Text>
              </Text>
              <Text style={styles.tagline}>
              Track your carbon footprint, make a positive impact.
              </Text>
          </View>
                    
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Sign Up"
              handlePress={() => router.push('/sign-up')}
              containerStyles={styles.signUpButton}
              textStyles={{color: 'white'}}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
            </Text>
            <Link href="/sign-in" style={styles.signInLink}>
              Sign In
            </Link>
          </View>
        </View>
      </View>

      <StatusBar backgroundColor='transparent' style='light' />
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  safeAreaLoading: {
    backgroundColor: '#ffffff', // Replace with your "primary" color if you have one
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    backgroundColor: '#ffffff', // Replace with your "primary" color if you have one
    flex: 1,
  },
  mainContainer: {
    width: '100%',
    // If you need an 85% "min-height", consider using a custom dimension or flex.
    // React Native doesn't support 'vh' directly, so this is a rough equivalent:
    minHeight: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50, // px-4 => 16
  },
  logo: {
    width: 300,
    height: 300,
  },
  // Heading + tagline container
  headingContainer: {
      marginTop: 16,
      alignItems: 'center',
      width: '100%',
  },
  heading: {
      fontSize: 24,
      fontWeight: '400',   // Normal weight for "Welcome to"
      color: '#000',
      textAlign: 'center',
  },
  // Emphasize "Carbon" with a dark green shade
  carbonPart: {
      fontSize: 24,
      fontWeight: '700',   // Bold
      color: '#2E8B57',     // Dark green tone
  },
  // Emphasize "Wise" with a complementary color (light green here)
  wisePart: {
      fontSize: 24,
      fontWeight: '700',   // Bold
      color: '#68B637',     // Light green
  },
  tagline: {
      marginTop: 4,
      marginHorizontal: 4,
      fontSize: 15,
      fontWeight: '500',
      color: '#555',
      textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    height: 115,
    paddingHorizontal: 16, // px-4 => 16
  },
  signUpButton: {
    width: '100%',
    marginTop: 30, // mt-5 => 20
    backgroundColor: '#68B637'
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
    color: '#68B637',         // Replace with your "secondary" color if you have one
    marginLeft: 4,         // ml-1 => 4
    width: '33.3333%',     // w-1/3
  },
});
