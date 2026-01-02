import React, { useState } from "react";
import {
    View,
    Text,
    Alert,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Input from "../components/Input";
import PrimaryButton from "../components/PrimaryButton";
import { sendNotification } from "../services/notificationService";

export default function SendNotification() {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

    const handleSend = async () => {
        if (!title.trim() || !message.trim()) {
            Alert.alert("Error", "All fields required");
            return;
        }

        try {
            setSending(true);
            await sendNotification(title.trim(), message.trim());
            Alert.alert("Success", "Notification sent");
            setTitle("");
            setMessage("");
        } catch (e) {
            console.log("NOTIFICATION ERROR:", e);
            Alert.alert("Error", "Failed to send notification");
        } finally {
            setSending(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "#f9fafb" }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: 24 }}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.title}>Send Notification</Text>
                <Text style={styles.subtitle}>
                    Quickly inform students about upcoming quizzes, deadlines and results.
                </Text>

                <View style={styles.card}>
                    <View style={styles.badgeRow}>
                        <View style={styles.badge}>
                            <MaterialIcons
                                name="campaign"
                                size={16}
                                color="#4f46e5"
                            />
                            <Text style={styles.badgeText}>Broadcast to all students</Text>
                        </View>
                    </View>

                    <Input
                        label="Title"
                        placeholder="Enter notification title"
                        value={title}
                        onChangeText={setTitle}
                    />
                    <Input
                        label="Message"
                        placeholder="Write your message"
                        value={message}
                        onChangeText={setMessage}
                        multiline
                        numberOfLines={4}
                    />

                    <PrimaryButton
                        title={sending ? "Sending..." : "Send Notification"}
                        onPress={handleSend}
                        disabled={sending}
                        iconName="send"
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 4,
        color: "#111827",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 13,
        color: "#6b7280",
        marginBottom: 18,
        textAlign: "center",
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 18,
        padding: 18,
        elevation: 3,
    },
    badgeRow: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginBottom: 12,
    },
    badge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#eef2ff",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
    },
    badgeText: {
        marginLeft: 6,
        fontSize: 11,
        color: "#4f46e5",
        fontWeight: "500",
    },
});
