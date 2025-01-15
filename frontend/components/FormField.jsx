import React, { useState } from 'react'
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { icons } from '../constants';

const FormField = ({
  title, 
  value, 
  placeholder, 
  handleChangeText, 
  editable, 
  labelStyles, 
  containerStyles, 
  keyboardType, 
  formFieldStyles, 
  secureTextEntry = false, 
  multiline = false, 
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  // Dynamically set the border color based on focus
  const dynamicInputContainerStyle = {
    borderColor: isFocused ? '#68B637' : '#f3f4f6',
  }

  return (
    <View style={[styles.container, containerStyles]}>
      <Text style={[styles.label, labelStyles]}>{title}</Text>

      <View style={[styles.inputContainer, formFieldStyles, dynamicInputContainerStyle]}>
        <TextInput
          style={styles.input}
          value={value}
          editable={editable}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          multiline={multiline}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={!showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField

const styles = StyleSheet.create({
  container: {
    marginBottom: 8, 
  },
  label: {
    color: '#fff',
    fontWeight: 600,
    fontSize: 16,
    fontFamily: 'pmedium',
    marginBottom: 7,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    minHeight: 56,
    width: '100%',
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 2,
    // base borderColor is #f3f4f6, but overridden dynamically on focus
    borderColor: '#f3f4f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  input: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'pmedium',
    flex: 1,
    paddingRight: 8,
  },
});
