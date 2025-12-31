import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function StudentDashboard({ navigation }) {
    const [student, setStudent] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            const data = await AsyncStorage.getItem("loggedInUser");
            if (data) {
                setStudent(JSON.parse(data));
            }
        };
        loadUser();
    }, []);

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.headerCard}>
                <View style={styles.headerRow}>
                    <MaterialIcons name="school" size={42} color="#ffffff" />
                    <View style={{ marginLeft: 12 }}>
                        <Text style={styles.welcomeText}>Welcome</Text>
                        <Text style={styles.nameText}>
                            {student?.name || "Student"}
                        </Text>
                        <Text style={styles.erpText}>
                            ERP No: {student?.erpNo || "-"}
                        </Text>
                    </View>
                </View>
            </View>

            {/* ACTION GRID */}
            <View style={styles.grid}>
                <DashboardCard
                    title="Available Quizzes"
                    icon="clipboard-text-outline"
                    bg="#eef2ff"
                    iconColor="#4f46e5"
                    onPress={() => navigation.navigate("QuizList")}
                />

                <DashboardCard
                    title="My Results"
                    icon="chart-bar"
                    bg="#ecfeff"
                    iconColor="#0891b2"
                    onPress={() => navigation.navigate("ResultScreen")}
                />

                <DashboardCard
                    title="Notifications"
                    icon="bell-outline"
                    bg="#fff7ed"
                    iconColor="#ea580c"
                    onPress={() => navigation.navigate("Notifications")}
                />

                <DashboardCard
                    title="My Profile"
                    icon="account-circle-outline"
                    bg="#f0fdf4"
                    iconColor="#16a34a"
                    onPress={() => navigation.navigate("Profile")}
                />
            </View>

            {/* 🔹 FOOTER */}
            <Text style={styles.footerText}>
                Focus • Practice • Perform
            </Text>
        </View>
    );
}

/* REUSABLE DASHBOARD CARD */
function DashboardCard({ title, icon, bg, iconColor, onPress }) {
    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: bg }]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <MaterialCommunityIcons
                name={icon}
                size={34}
                color={iconColor}
            />
            <Text style={styles.cardText}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f9fafb",
    },

    /* Header */
    headerCard: {
        backgroundColor: "#4f46e5",
        padding: 22,
        borderRadius: 18,
        marginBottom: 25,
        elevation: 4,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    welcomeText: {
        color: "#e0e7ff",
        fontSize: 16,
    },
    nameText: {
        color: "#ffffff",
        fontSize: 22,
        fontWeight: "bold",
    },
    erpText: {
        color: "#c7d2fe",
        fontSize: 14,
        marginTop: 2,
    },

    /* Grid */
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },

    card: {
        width: "48%",              // 2 cards per row
        borderRadius: 16,
        paddingVertical: 26,
        paddingHorizontal: 14,
        marginBottom: 16,
        alignItems: "center",
        elevation: 2,
    },

    cardText: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: "600",
        color: "#111827",
        textAlign: "center",
    },

    footerText: {
        textAlign: "center",
        marginTop: 420,
        color: "#6b7280",
        fontSize: 13,
    },
});
