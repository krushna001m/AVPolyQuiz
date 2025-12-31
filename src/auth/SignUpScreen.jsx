import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Firebase_Realtime_DB_URL =
    "https://avpolyquiz-162f0-default-rtdb.firebaseio.com";

export default function SignUpScreen({ navigation }) {
    const [role, setRole] = useState("student");
    const [name, setName] = useState("");
    const [erpNo, setErpNo] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const isValidEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const isValidMobile = (mobile) =>
        /^[6-9]\d{9}$/.test(mobile); // Indian numbers


    const handleSignUp = async () => {
        // 🔴 Empty checks
        if (!name.trim()) {
            Alert.alert("Validation Error", "Name is required");
            return;
        }

        if (name.trim().length < 3) {
            Alert.alert("Validation Error", "Name must be at least 3 characters");
            return;
        }

        if (!email.trim()) {
            Alert.alert("Validation Error", "Email is required");
            return;
        }

        if (!isValidEmail(email.trim())) {
            Alert.alert("Validation Error", "Enter a valid email address");
            return;
        }

        if (!mobile.trim()) {
            Alert.alert("Validation Error", "Mobile number is required");
            return;
        }

        if (!isValidMobile(mobile.trim())) {
            Alert.alert("Validation Error", "Enter a valid 10-digit mobile number");
            return;
        }

        if (role === "student" && !erpNo.trim()) {
            Alert.alert("Validation Error", "ERP Number is mandatory for students");
            return;
        }

        if (role === "student" && erpNo.trim().length < 4) {
            Alert.alert("Validation Error", "ERP Number is too short");
            return;
        }

        if (!password) {
            Alert.alert("Validation Error", "Password is required");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Validation Error", "Password must be at least 6 characters");
            return;
        }

        try {
            // 🔐 Firebase Auth
            const userCred = await createUserWithEmailAndPassword(
                auth,
                email.trim(),
                password
            );

            const uid = userCred.user.uid;
            const token = await userCred.user.getIdToken();

            const userData = {
                uid,
                name: name.trim(),
                role,
                erpNo: role === "student" ? erpNo.trim() : "",
                email: email.trim(),
                mobile: mobile.trim(),
                createdAt: Date.now(),
            };

            // ✅ SAVE USER IN RTDB (AUTHENTICATED)
            await axios.put(
                `${Firebase_Realtime_DB_URL}/users/${uid}.json?auth=${token}`,
                userData
            );

            await AsyncStorage.setItem(
                "loggedInUser",
                JSON.stringify(userData)
            );

            Alert.alert("Success", "Account created successfully");
            navigation.replace("Login");

        } catch (error) {
            console.log("SIGNUP ERROR 👉", error);

            let message = "Signup failed";

            // 🔐 Firebase Auth errors
            if (error.code === "auth/email-already-in-use") {
                message = "Email already registered";
            } else if (error.code === "auth/invalid-email") {
                message = "Invalid email address";
            } else if (error.code === "auth/weak-password") {
                message = "Weak password";
            }

            // 🌐 Realtime DB errors
            else if (error.response?.data?.error === "Permission denied") {
                message = "Database permission denied (check rules)";
            }

            Alert.alert("Error", message);
        }

    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>

            <View style={styles.roleContainer}>
                <TouchableOpacity
                    style={[styles.roleBtn, role === "student" && styles.activeRole]}
                    onPress={() => setRole("student")}
                >
                    <Text style={[styles.roleText, role === "student" && styles.activeRoleText]}>
                        Student
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.roleBtn, role === "teacher" && styles.activeRole]}
                    onPress={() => setRole("teacher")}
                >
                    <Text style={[styles.roleText, role === "teacher" && styles.activeRoleText]}>
                        Teacher
                    </Text>
                </TouchableOpacity>
            </View>

            <TextInput
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                autoCapitalize="none"
            />

            {role === "student" && (
                <TextInput
                    placeholder="ERP Number"
                    value={erpNo}
                    onChangeText={setErpNo}
                    style={styles.input}
                />
            )}

            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
            />

            <TextInput
                placeholder="Mobile Number"
                value={mobile}
                onChangeText={setMobile}
                style={styles.input}
                keyboardType="phone-pad"
                maxLength={10}
            />

            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginText}>
                    Already have an account? Login
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#ffffff",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 25,
    },
    roleContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 20,
    },
    roleBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 20,
        marginHorizontal: 8,
    },
    activeRole: {
        backgroundColor: "#4f46e5",
    },
    roleText: {
        fontWeight: "bold",
        color: "#111827",
    },
    activeRoleText: {
        color: "#ffffff",
    },
    input: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 14,
    },
    button: {
        backgroundColor: "#4f46e5",
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 10,
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    loginText: {
        textAlign: "center",
        marginTop: 15,
        color: "#4f46e5",
        fontWeight: "bold",
    },
});
