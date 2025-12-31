import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import { auth } from "../firebase/firebaseConfig";
import { updateEmail } from "firebase/auth";

const Firebase_Realtime_DB_URL =
    "https://avpolyquiz-162f0-default-rtdb.firebaseio.com";

export default function EditProfile({ navigation }) {
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [erpNo, setErpNo] = useState("");

    useEffect(() => {
        const loadUser = async () => {
            const data = await AsyncStorage.getItem("loggedInUser");
            if (data) {
                const u = JSON.parse(data);
                setUser(u);
                setName(u.name || "");
                setMobile(u.mobile || "");
                setEmail(u.email || "");
                setErpNo(u.erpNo || "");
            }
        };
        loadUser();
    }, []);

    const handleUpdate = async () => {
        if (name.trim().length < 3) {
            Alert.alert("Error", "Name must be at least 3 characters");
            return;
        }

        if (!/^[6-9]\d{9}$/.test(mobile)) {
            Alert.alert("Error", "Enter valid 10-digit mobile number");
            return;
        }

        if (!email.includes("@")) {
            Alert.alert("Error", "Invalid email address");
            return;
        }

        if (!erpNo.trim()) {
            Alert.alert("Error", "ERP Number is required");
            return;
        }

        try {
            const uid = user.uid;
            const token = await auth.currentUser.getIdToken();

            // 🔐 Update Firebase Auth Email if changed
            if (email !== auth.currentUser.email) {
                await updateEmail(auth.currentUser, email);
            }

            const updatedData = {
                name: name.trim(),
                mobile: mobile.trim(),
                email: email.trim(),
                erpNo: erpNo.trim(),
                updatedAt: Date.now(),
            };

            // ✅ PATCH (UPDATE ONLY FIELDS)
            await axios.patch(
                `${Firebase_Realtime_DB_URL}/users/${uid}.json?auth=${token}`,
                updatedData
            );

            const updatedUser = { ...user, ...updatedData };

            await AsyncStorage.setItem(
                "loggedInUser",
                JSON.stringify(updatedUser)
            );

            Alert.alert("Success", "Profile updated successfully");
            navigation.goBack();

        } catch (error) {
            console.log("UPDATE PROFILE ERROR 👉", error);
            Alert.alert(
                "Error",
                "Unable to update profile. Please login again."
            );
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Profile</Text>

            <View style={styles.card}>
                <InputField
                    icon="person"
                    placeholder="Full Name"
                    value={name}
                    onChangeText={setName}
                />

                <InputField
                    icon="school"
                    placeholder="ERP Number"
                    value={erpNo}
                    onChangeText={setErpNo}
                />

                <InputField
                    icon="email"
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />

                <InputField
                    icon="phone"
                    placeholder="Mobile Number"
                    value={mobile}
                    onChangeText={setMobile}
                    keyboardType="phone-pad"
                    maxLength={10}
                />
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
                <MaterialIcons name="save" size={22} color="#fff" />
                <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>
        </View>
    );
}

/* 🔹 REUSABLE INPUT FIELD */
function InputField({ icon, ...props }) {
    return (
        <View style={styles.inputWrapper}>
            <MaterialIcons
                name={icon}
                size={22}
                color="#4f46e5"
                style={{ marginRight: 10 }}
            />
            <TextInput
                {...props}
                style={styles.input}
                placeholderTextColor="#9ca3af"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f9fafb",
    },

    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 20,
        color: "#111827",
        textAlign: "center",
    },

    card: {
        backgroundColor: "#ffffff",
        borderRadius: 18,
        padding: 18,
        elevation: 3,
        marginTop: 10,
    },

    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 14,
    },

    input: {
        flex: 1,
        fontSize: 15,
        color: "#111827",
    },

    saveBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#4f46e5",
        paddingVertical: 16,
        borderRadius: 14,
        marginTop: 390,
        elevation: 3,
    },

    saveText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8,
    },
});
