import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Firebase_Realtime_DB_URL =
    "https://avpolyquiz-162f0-default-rtdb.firebaseio.com";

const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        // 🔴 VALIDATIONS
        if (!email.trim()) {
            Alert.alert("Validation Error", "Email is required");
            return;
        }

        if (!isValidEmail(email.trim())) {
            Alert.alert("Validation Error", "Enter a valid email address");
            return;
        }

        if (!password) {
            Alert.alert("Validation Error", "Password is required");
            return;
        }

        try {
            // 🔐 Firebase Authentication
            const userCred = await signInWithEmailAndPassword(
                auth,
                email.trim(),
                password
            );

            const uid = userCred.user.uid;
            const token = await userCred.user.getIdToken();

            // 📖 Fetch user from RTDB
            const res = await axios.get(
                `${Firebase_Realtime_DB_URL}/users/${uid}.json?auth=${token}`
            );

            const userData = res.data;

            if (!userData) {
                Alert.alert(
                    "Profile Missing",
                    "User data not found. Please contact admin."
                );
                return;
            }

            // 💾 Store locally (same structure as Signup)
            await AsyncStorage.setItem(
                "loggedInUser",
                JSON.stringify({ ...userData, uid })
            );

            Alert.alert("Success", "Login successful");
            navigation.replace("AuthLoading", {
                role: userData.role,
            });


        } catch (error) {
            console.log("LOGIN ERROR 👉", error);

            let message = "Login failed";

            // 🔐 Firebase Auth errors
            if (error.code === "auth/user-not-found") {
                message = "No account found with this email";
            } else if (error.code === "auth/wrong-password") {
                message = "Incorrect password";
            } else if (error.code === "auth/invalid-email") {
                message = "Invalid email address";
            } else if (error.code === "auth/too-many-requests") {
                message = "Too many attempts. Try again later";
            }

            // 🌐 Database / Network errors
            else if (error.response?.data?.error === "Permission denied") {
                message = "Database permission denied. Check rules.";
            } else if (error.message?.includes("Network")) {
                message = "Network error. Check your internet connection.";
            }

            Alert.alert("Error", message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
            />

            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                <Text style={styles.loginText}>
                    New user? Create account
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
    },
    buttonText: {
        color: "#ffffff",
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
