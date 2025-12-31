import React, { useState } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import Input from "../components/Input";
import PrimaryButton from "../components/PrimaryButton";
import { sendNotification } from "../services/notificationService";

export default function SendNotification() {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    const handleSend = async () => {
        if (!title || !message) {
            Alert.alert("Error", "All fields required");
            return;
        }

        await sendNotification(title, message);
        Alert.alert("Success", "Notification sent");
        setTitle("");
        setMessage("");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Send Notification</Text>

            <Input placeholder="Title" value={title} onChangeText={setTitle} />
            <Input placeholder="Message" value={message} onChangeText={setMessage} />

            <PrimaryButton title="Send Notification" onPress={handleSend} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
});
