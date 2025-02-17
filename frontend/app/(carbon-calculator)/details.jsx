// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ImageBackground,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import Ionicons from '@expo/vector-icons/Ionicons';

// import { images } from '../../constants';
// import CustomButton from '../../components/CustomButton';
// import FormField from '../../components/FormField';

// // Firestore
// import { db } from '../../lib/firebase';
// import { doc, deleteDoc } from 'firebase/firestore';
// import { useAuth } from '../../lib/AuthContext';

// /** 
//  * Helper to convert a Firestore Timestamp object or date string
//  * into a human-readable date/time string.
//  */
// const parseTimestamp = (ts) => {
//   if (!ts) return 'N/A';

//   // If it's an object containing 'seconds' (e.g. Firestore Timestamp)
//   // In some versions, it might have _seconds or nanoseconds.
//   if (typeof ts === 'object' && (ts.seconds || ts._seconds)) {
//     const seconds = ts.seconds ?? ts._seconds;
//     const d = new Date(seconds * 1000);
//     return d.toLocaleString();
//   }

//   // If it's already a string, try to parse it as a date
//   if (typeof ts === 'string') {
//     const maybeDate = new Date(ts);
//     if (!isNaN(maybeDate.getTime())) {
//       return maybeDate.toLocaleString();
//     }
//   }

//   return 'N/A';
// };

// const Details = () => {
//   const router = useRouter();
//   const { currentUser } = useAuth();
//   const {
//     id,
//     product_name,
//     functionality,
//     footprint,
//     additional_info,
//     tips,
//     date_added,
//   } = useLocalSearchParams();

//   // Convert the date_added param (which might be a Firestore Timestamp or string)
//   const dateValue = parseTimestamp(date_added);

//   // Delete product
//   const handleDelete = async () => {
//     try {
//       if (!id) {
//         Alert.alert('Error', 'No product ID was provided.');
//         return;
//       }
//       if (!currentUser || !currentUser.uid) {
//         Alert.alert('Error', 'No user is logged in.');
//         return;
//       }

//       // Delete from Firestore
//       const docRef = doc(db, 'accounts', currentUser.uid, 'products', id);
//       await deleteDoc(docRef);

//       // Navigate back to Home
//       router.replace('/home');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to delete product. Please try again.');
//       console.error('Error deleting product:', error);
//     }
//   };

//   // Cancel => navigate back to home
//   const handleCancel = () => {
//     router.replace('/home');
//   };

//   return (
//     <ImageBackground source={images.background} style={styles.background}>
//       <SafeAreaView style={styles.safeArea}>
//         {/* Header */}
//         <View style={styles.headerContainer}>
//           <Ionicons
//             name="arrow-back-outline"
//             size={24}
//             color="white"
//             onPress={() => router.back()}
//           />
//           <Text style={styles.headerText}>Product Details</Text>
//         </View>

//         <ScrollView
//           style={styles.mainContainer}
//           contentContainerStyle={{ paddingBottom: 40 }}
//         >
//           {/* 
//             Each attribute is displayed in its own FormField.
//             editable={false} => disables typing
//           */}

//           <FormField
//             title="Product Name"
//             value={product_name || 'Unknown Product'}
//             placeholder=""
//             containerStyles={styles.fieldContainer}
//             formFieldStyles={styles.fieldStyle}
//             editable={false}
//           />

//           <FormField
//             title="Functionality"
//             value={functionality || 'N/A'}
//             placeholder=""
//             containerStyles={styles.fieldContainer}
//             formFieldStyles={styles.fieldStyle}
//             editable={false}
//           />

//           <FormField
//             title="Footprint"
//             value={footprint || 'N/A'}
//             placeholder=""
//             containerStyles={styles.fieldContainer}
//             formFieldStyles={styles.fieldStyle}
//             editable={false}
//           />



//           <FormField
//             title="Tips"
//             value={tips || 'N/A'}
//             placeholder=""
//             multiline
//             containerStyles={styles.fieldContainer}
//             formFieldStyles={[styles.fieldStyle, { height: 390 }]}
//             editable={false}
//             scrollEnabled={true}
            
//           />

//           {/* Delete / Cancel */}
//           <View style={{ marginTop: 30 }}>
//             <CustomButton
//               title="Delete"
//               handlePress={handleDelete}
//               containerStyles={{ marginBottom: 20 }}
//               textStyles={{ color: 'red' }}
//             />
//             <CustomButton
//               title="Cancel"
//               handlePress={handleCancel}
              
//             />
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </ImageBackground>
//   );
// };

// export default Details;

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     resizeMode: 'cover',
//   },
//   safeArea: {
//     backgroundColor: 'transparent',
//     flex: 1,
//   },
//   mainContainer: {
//     width: '100%',
//     height: '100%',
//     paddingHorizontal: 25,
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     paddingTop: 10,
//     marginBottom: 10,
//     paddingHorizontal: 16,
//   },
//   headerText: {
//     color: 'white',
//     fontSize: 22,
//     fontWeight: 'bold',
//   },
//   fieldContainer: {
//     marginTop: 12,
//     scrollEnabled: true,
//   },
//   fieldStyle: {
//     backgroundColor: 'rgba(255, 255, 255, 0.85)',
//     paddingTop: 4,
//   },
// });

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { images } from '../../constants';
import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';

// Firestore
import { db } from '../../lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../../lib/AuthContext';

/** 
 * Helper to convert a Firestore Timestamp object or date string
 * into a human-readable date/time string.
 */
const parseTimestamp = (ts) => {
  if (!ts) return 'N/A';

  if (typeof ts === 'object' && (ts.seconds || ts._seconds)) {
    const seconds = ts.seconds ?? ts._seconds;
    const d = new Date(seconds * 1000);
    return d.toLocaleString();
  }

  if (typeof ts === 'string') {
    const maybeDate = new Date(ts);
    if (!isNaN(maybeDate.getTime())) {
      return maybeDate.toLocaleString();
    }
  }

  return 'N/A';
};

const Details = () => {
  const router = useRouter();
  const { currentUser } = useAuth();

  // Read product attributes from query params
  const {
    id,
    product_name,
    functionality,
    footprint,
    additional_info,
    tips,
    date_added,
  } = useLocalSearchParams();

  // Convert the date_added param (if any)
  const dateValue = parseTimestamp(date_added);

  // Delete product
  const handleDelete = async () => {
    try {
      if (!id) {
        Alert.alert('Error', 'No product ID was provided.');
        return;
      }
      if (!currentUser || !currentUser.uid) {
        Alert.alert('Error', 'No user is logged in.');
        return;
      }

      const docRef = doc(db, 'accounts', currentUser.uid, 'products', id);
      await deleteDoc(docRef);

      router.replace('/home');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete product. Please try again.');
      console.error('Error deleting product:', error);
    }
  };

  // Cancel => navigate back to home
  const handleCancel = () => {
    router.replace('/home');
  };

  return (
    <ImageBackground source={images.background} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Ionicons
            name="arrow-back-outline"
            size={24}
            color="white"
            onPress={() => router.back()}
          />
          <Text style={styles.headerText}>Product Details</Text>
        </View>

        {/* Use a ScrollView so content can exceed screen height */}
        <ScrollView
          style={styles.mainContainer}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Product Name */}
          <FormField
            title="Product Name"
            value={product_name || 'Unknown Product'}
            placeholder=""
            containerStyles={styles.fieldContainer}
            formFieldStyles={styles.fieldStyle}
            editable={false}
          />

          {/* Functionality */}
          <FormField
            title="Functionality"
            value={functionality || 'N/A'}
            placeholder=""
            containerStyles={styles.fieldContainer}
            formFieldStyles={styles.fieldStyle}
            editable={false}
          />

          {/* Footprint */}
          <FormField
            title="Footprint"
            value={footprint || 'N/A'}
            placeholder=""
            containerStyles={styles.fieldContainer}
            formFieldStyles={styles.fieldStyle}
            editable={false}
          />

          {/* Tips */}
          <FormField
            title="Tips"
            value={tips || 'N/A'}
            placeholder=""
            multiline
            containerStyles={styles.fieldContainer}
            // Provide a maxHeight so it doesn't take up the entire screen
            formFieldStyles={[
              styles.fieldStyle,
              { maxHeight: 200, textAlignVertical: 'top' },
            ]}
            editable={false}
            ScrollView={true}
          />

          {/* Optional: Additional Info 
              If you want to show "additional_info" 
              you can uncomment below:
          */}
          {/* <FormField
            title="Additional Info"
            value={additional_info || 'N/A'}
            placeholder=""
            multiline
            containerStyles={styles.fieldContainer}
            formFieldStyles={[
              styles.fieldStyle,
              { maxHeight: 200, textAlignVertical: 'top' },
            ]}
            editable={false}
          /> */}

          {/* Delete / Cancel */}
          <View style={{ marginTop: 30 }}>
            <CustomButton
              title="Delete"
              handlePress={handleDelete}
              containerStyles={{ marginBottom: 20 }}
              textStyles={{ color: 'red' }}
            />
            <CustomButton
              title="Cancel"
              handlePress={handleCancel}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Details;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  safeArea: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  // Let the ScrollView handle the page height
  mainContainer: {
    width: '100%',
    // Removed height: '100%' so the content can scroll
    paddingHorizontal: 25,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 10,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  headerText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  fieldContainer: {
    marginTop: 12,
  },
  fieldStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingTop: 4,
  },
});
