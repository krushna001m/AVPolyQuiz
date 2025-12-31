import React from "react";
import { TextInput, StyleSheet } from "react-native";

export default function Input({
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    keyboardType = "default",
    multiline = false,
    style,
}) {
    return (
        <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            multiline={multiline}
            style={[styles.input, style]}
            placeholderTextColor="#9ca3af"
        />
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: "#ffffff",
        marginBottom: 14,
    },
});
