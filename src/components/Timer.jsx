import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Timer({ duration, onTimeUp }) {
    // duration in seconds
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp && onTimeUp();
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <View style={styles.container}>
            <Text style={styles.time}>
                ⏱ {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginBottom: 10,
    },
    time: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#dc2626",
    },
});
