import { KeyboardAvoidingView, ScrollView, View, Platform } from 'react-native'
import React from 'react'

const ios = Platform.OS === 'ios'
export default function CustomKeyboardView({ children, inChat }) {
    let kavConfig = {}
    let svConfig = {}
    if (inChat) {
        kavConfig = { keyboardVerticalOffset: 75 }
        svConfig = { contentContainerStyle: { flex: 1 } }
    }
    return (
        <KeyboardAvoidingView
            behavior={ios ? 'padding' : 'height'}
            style={{ flex: 1 }}
            {...kavConfig}
        >

            {inChat ? (
                <View
                    style={{ flex: 1 }}
                    bounce={false}
                    showsHorizontalScrollIndicator={false}
                    {...svConfig}
                >
                    {children}
                </View>
            ) : (
                <ScrollView
                    style={{ flex: 1 }}
                    bounce={false}
                    showsHorizontalScrollIndicator={false}
                    {...svConfig}
                >
                    {children}
                </ScrollView>
            )}
        </KeyboardAvoidingView>
    )
}