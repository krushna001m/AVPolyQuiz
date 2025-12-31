import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export default function Profile({ navigation }) {
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

    const handleLogout = async () => {
        await AsyncStorage.removeItem("loggedInUser");
        await signOut(auth);
        navigation.replace("Login");
    };

    return (
        <View style={styles.container}>
            {/* 🔹 HEADER */}
            <View style={styles.header}>
                {student?.photoURL ? (
                    <Image
                        source={{ uri: student.photoURL }}
                        style={styles.avatar}
                    />
                ) : (
                    <MaterialIcons
                        name="account-circle"
                        size={90}
                        color="#ffffff"
                    />
                )}

                <Text style={styles.name}>{student?.name}</Text>
                <Text style={styles.erp}>
                    ERP No: {student?.erpNo || "-"}
                </Text>
            </View>

            {/* 🔹 INFO CARD */}
            <View style={styles.infoCard}>
                <InfoRow icon="email" label="Email" value={student?.email} />
                <InfoRow icon="phone" label="Mobile" value={student?.mobile} />
                <InfoRow icon="school" label="Role" value={student?.role} />
            </View>

            {/* 🔹 ACTIONS */}
            <View style={styles.actionsCard}>
                <ActionRow
                    icon="edit"
                    label="Edit Profile"
                    onPress={() => navigation.navigate("EditProfile")}
                />

                <ActionRow
                    icon="photo-camera"
                    label="Upload Profile Photo"
                    onPress={() =>
                        navigation.navigate("UploadProfilePhoto")
                    }
                />

                <ActionRow
                    icon="lock-reset"
                    label="Change Password"
                    onPress={() => navigation.navigate("ChangePassword")}
                />
            </View>

            {/* 🔹 LOGOUT */}
            <TouchableOpacity
                style={styles.logoutBtn}
                onPress={handleLogout}
            >
                <MaterialCommunityIcons
                    name="logout"
                    size={22}
                    color="#ffffff"
                />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

/* 🔹 INFO ROW */
function InfoRow({ icon, label, value }) {
    return (
        <View style={styles.row}>
            <MaterialIcons name={icon} size={22} color="#4f46e5" />
            <View style={{ marginLeft: 12 }}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value || "-"}</Text>
            </View>
        </View>
    );
}

/* 🔹 ACTION ROW */
function ActionRow({ icon, label, onPress }) {
    return (
        <TouchableOpacity
            style={styles.actionRow}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.actionLeft}>
                <MaterialIcons name={icon} size={22} color="#4f46e5" />
                <Text style={styles.actionText}>{label}</Text>
            </View>
            <MaterialIcons
                name="chevron-right"
                size={26}
                color="#9ca3af"
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9fafb",
    },

    /* Header */
    header: {
        backgroundColor: "#4f46e5",
        alignItems: "center",
        paddingVertical: 30,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        elevation: 4,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: "#ffffff",
    },
    name: {
        color: "#ffffff",
        fontSize: 22,
        fontWeight: "bold",
        marginTop: 8,
    },
    erp: {
        color: "#c7d2fe",
        fontSize: 14,
        marginTop: 4,
    },

    /* Info Card */
    infoCard: {
        backgroundColor: "#ffffff",
        margin: 20,
        borderRadius: 18,
        padding: 18,
        elevation: 3,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18,
    },
    label: {
        fontSize: 13,
        color: "#6b7280",
    },
    value: {
        fontSize: 15,
        fontWeight: "600",
        color: "#111827",
        marginTop: 2,
    },

    /* Actions */
    actionsCard: {
        backgroundColor: "#ffffff",
        marginHorizontal: 20,
        borderRadius: 18,
        paddingVertical: 6,
        elevation: 3,
    },
    actionRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
    },
    actionLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    actionText: {
        marginLeft: 14,
        fontSize: 15,
        fontWeight: "500",
        color: "#111827",
    },

    /* Logout */
    logoutBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ef4444",
        margin: 20,
        marginTop:180,
        paddingVertical: 14,
        borderRadius: 14,
        elevation: 3,
    },
    logoutText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8,
    },
});
