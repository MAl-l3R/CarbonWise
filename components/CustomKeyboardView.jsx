import { View, Text, Platform, KeyboardAvoidingView, ScrollView } from 'react-native'
import React from 'react'

const ios = Platform.OS == 'ios';
const CustomKeyboardView = ({children, inChat}) => {
    let kavConfig = {};
    let scrollViewConfig = {};
    if(inChat) {
        kavConfig = {keyboardVerticalOffset: 20};
        scrollViewConfig = {contentContainerStyle: {flex:1}};
    }
  return (
    <KeyboardAvoidingView
        className="flex-1"
        behavior={ios ? 'padding' : 'height'}
        {...kavConfig}
    >
        <ScrollView
            className="flex-1"
            bounces={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            {...scrollViewConfig}
        >
            {children}
        </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default CustomKeyboardView
