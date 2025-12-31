import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function PrimaryButton({ title, iconName, onPress }) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <View style={styles.row}>
                {iconName && (
                    <MaterialCommunityIcons
                        name={iconName}
                        size={22}
                        color="#ffffff"
                        style={{ marginRight: 10 }}
                    />
                )}
                <Text style={styles.text}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#4f46e5",
        paddingVertical: 16,
        borderRadius: 14,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
