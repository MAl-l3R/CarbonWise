import React from 'react';
import { 
  View, 
  Text, 
  Platform, 
  KeyboardAvoidingView, 
  ScrollView, 
  StyleSheet 
} from 'react-native';

const ios = Platform.OS === 'ios';

const CustomKeyboardView = ({ children }) => {

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={ios ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scroll}
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CustomKeyboardView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
});
