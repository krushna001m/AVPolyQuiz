import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";

export default function PrimaryButton({
    title,
    onPress,
    loading = false,
    disabled = false,
    style,
}) {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                (disabled || loading) && styles.disabled,
                style,
            ]}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color="#ffffff" />
            ) : (
                <Text style={styles.text}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#4f46e5",
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 12,
    },
    disabled: {
        opacity: 0.6,
    },
    text: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
});
