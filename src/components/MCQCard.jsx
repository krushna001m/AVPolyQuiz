import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function MCQCard({
    question,
    options = [],
    onSelect,
    selectedIndex = null,
}) {
    return (
        <View style={styles.card}>
            <Text style={styles.question}>{question}</Text>

            {options.map((opt, index) => (
                <TouchableOpacity
                    key={index}
                    style={[
                        styles.option,
                        selectedIndex === index && styles.selectedOption,
                    ]}
                    onPress={() => onSelect(index)}
                    activeOpacity={0.7}
                >
                    <Text
                        style={[
                            styles.optionText,
                            selectedIndex === index && styles.selectedText,
                        ]}
                    >
                        {opt}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 14,
        padding: 18,
        elevation: 3,
    },
    question: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
    },
    option: {
        padding: 14,
        borderRadius: 10,
        backgroundColor: "#f1f5f9",
        marginBottom: 12,
    },
    selectedOption: {
        backgroundColor: "#4f46e5",
    },
    optionText: {
        fontSize: 15,
    },
    selectedText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
