import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
} from "react-native";
import { updatePassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function ChangePassword({ navigation }) {
    const [password, setPassword] = useState("");

    const handleChange = async () => {
        if (password.length < 6) {
            Alert.alert("Error", "Password too short");
            return;
        }

        try {
            await updatePassword(auth.currentUser, password);
            Alert.alert("Success", "Password changed");
            navigation.goBack();
        } catch (e) {
            Alert.alert("Error", "Please login again");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Change Password</Text>

            <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.btn} onPress={handleChange}>
                <MaterialIcons name="lock-reset" size={22} color="#fff" />
                <Text style={styles.btnText}>Update Password</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20 
    },
    title: { 
        fontSize: 22, 
        fontWeight: "bold", 
        marginTop: 10,
        marginBottom: 20,
        textAlign: "center"
    },
    input: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 12,
        padding: 14,
        marginBottom: 19,
    },
    btn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#4f46e5",
        padding: 14,
        borderRadius: 12,
        marginTop: 680,
    },
    btnText: { 
        color: "#fff", 
        fontWeight: "bold", 
        marginLeft: 8 
    },
});
