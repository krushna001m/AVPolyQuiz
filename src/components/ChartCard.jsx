import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ChartCard({ title, value, subtitle }) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.value}>{value}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#eef2ff",
        padding: 16,
        borderRadius: 14,
        marginBottom: 12,
    },
    title: {
        fontSize: 14,
        color: "#374151",
    },
    value: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#4f46e5",
    },
    subtitle: {
        fontSize: 12,
        color: "#6b7280",
        marginTop: 4,
    },
});
