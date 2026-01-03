import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function StudentDashboard({ navigation }) {
    const [student, setStudent] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const data = await AsyncStorage.getItem("loggedInUser");
                if (data) {
                    setStudent(JSON.parse(data));
                }
            } catch (e) {
                console.log("USER LOAD ERROR:", e);
            }
        };
        loadUser();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#4f46e5" />

            {/* HEADER */}
            <View style={styles.headerCard}>
                <View style={styles.headerRow}>
                    <View style={styles.avatar}>
                        <MaterialIcons
                            name="school"
                            size={28}
                            color="#4f46e5"
                        />
                    </View>

                    <View style={{ marginLeft: 12, flex: 1 }}>
                        <Text style={styles.welcomeText}>Welcome back,</Text>
                        <Text style={styles.nameText}>
                            {student?.name || "Student"}
                        </Text>
                        <Text style={styles.roleText}>
                            Student • Quiz Participant
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.profileBtn}
                        onPress={() => navigation.navigate("Profile")}
                    >
                        <MaterialIcons
                            name="person"
                            size={22}
                            color="#e0e7ff"
                        />
                    </TouchableOpacity>
                </View>

                <Text style={styles.headerSubText}>
                    Attempt quizzes, track your performance and stay updated with notifications.
                </Text>
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
                    bg="#ecfdf3"
                    iconColor="#16a34a"
                    onPress={() => navigation.navigate("ResultScreen")}
                />

                <DashboardCard
                    title="Notifications"
                    icon="bell-outline"
                    bg="#fef3c7"
                    iconColor="#d97706"
                    onPress={() => navigation.navigate("Notifications")}
                />

                <DashboardCard
                    title="My Profile"
                    icon="account-circle-outline"
                    bg="#fee2e2"
                    iconColor="#dc2626"
                    onPress={() => navigation.navigate("Profile")}
                />
            </View>

            {/* FOOTER */}
            <Text style={styles.footerText}>
                Learn • Practice • Perform better every day.
            </Text>
        </View>
    );
}

/* REUSABLE DASHBOARD CARD */
function DashboardCard({ title, icon, bg, iconColor, onPress }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={[styles.card, { backgroundColor: bg }]}
        >
            <MaterialCommunityIcons name={icon} size={30} color={iconColor} />
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
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#e0e7ff",
        alignItems: "center",
        justifyContent: "center",
    },
    profileBtn: {
        padding: 8,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#818cf8",
    },
    welcomeText: {
        color: "#e0e7ff",
        fontSize: 14,
    },
    nameText: {
        color: "#ffffff",
        fontSize: 22,
        fontWeight: "bold",
    },
    roleText: {
        color: "#c7d2fe",
        fontSize: 13,
        marginTop: 2,
    },
    headerSubText: {
        marginTop: 14,
        color: "#e5e7eb",
        fontSize: 13,
        lineHeight: 18,
    },

    /* Grid */
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    card: {
        width: "48%",
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
        marginTop: 12,
        color: "#6b7280",
        fontSize: 12,
    },
});
