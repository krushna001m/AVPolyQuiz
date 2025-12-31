import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    StyleSheet,
    Image,
    ActivityIndicator,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { launchImageLibrary } from "react-native-image-picker";
import storage from "@react-native-firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { auth } from "../firebase/firebaseConfig";

const Firebase_Realtime_DB_URL =
    "https://avpolyquiz-162f0-default-rtdb.firebaseio.com";

export default function UploadProfilePhoto({ navigation }) {
    const [photo, setPhoto] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            const data = await AsyncStorage.getItem("loggedInUser");
            if (data) {
                const u = JSON.parse(data);
                setUser(u);
                setPhoto(u.photoURL || null);
            }
        };
        loadUser();
    }, []);

    const pickImage = async () => {
        const res = await launchImageLibrary({
            mediaType: "photo",
            quality: 0.7,
        });

        if (res.didCancel) return;

        const asset = res.assets[0];

        // 🔒 Size validation (max 5MB)
        if (asset.fileSize > 5 * 1024 * 1024) {
            Alert.alert("Error", "Image size must be under 5MB");
            return;
        }

        setPhoto(asset.uri);
        uploadImage(asset.uri);
    };

    const uploadImage = async (uri) => {
        try {
            setUploading(true);

            const ref = storage().ref(
                `profilePhotos/${user.uid}.jpg`
            );

            await ref.putFile(uri);
            const photoURL = await ref.getDownloadURL();

            // 🔐 Update Realtime DB
            const token = await auth.currentUser.getIdToken();
            await axios.patch(
                `${Firebase_Realtime_DB_URL}/users/${user.uid}.json?auth=${token}`,
                { photoURL }
            );

            const updatedUser = { ...user, photoURL };
            await AsyncStorage.setItem(
                "loggedInUser",
                JSON.stringify(updatedUser)
            );

            setUser(updatedUser);
            Alert.alert("Success", "Profile photo updated");

        } catch (error) {
            console.log("PHOTO UPLOAD ERROR 👉", error);
            Alert.alert("Error", "Upload failed. Try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile Photo</Text>

            {/* 🔹 PHOTO PREVIEW */}
            <View style={styles.photoWrapper}>
                {photo ? (
                    <Image
                        source={{ uri: photo }}
                        style={styles.photo}
                    />
                ) : (
                    <MaterialIcons
                        name="account-circle"
                        size={110}
                        color="#9ca3af"
                    />
                )}
            </View>

            {/* 🔹 ACTION BUTTON */}
            <TouchableOpacity
                style={styles.uploadBtn}
                onPress={pickImage}
                disabled={uploading}
            >
                {uploading ? (
                    <ActivityIndicator color="#ffffff" />
                ) : (
                    <>
                        <MaterialIcons
                            name="photo-camera"
                            size={22}
                            color="#ffffff"
                        />
                        <Text style={styles.uploadText}>
                            Choose & Upload Photo
                        </Text>
                    </>
                )}
            </TouchableOpacity>

            {/* 🔹 INFO */}
            <Text style={styles.infoText}>
                JPG / PNG • Max 5MB
            </Text>
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
        marginBottom: 25,
        color: "#111827",
    },

    photoWrapper: {
        alignItems: "center",
        marginBottom: 30,
    },

    photo: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 3,
        borderColor: "#4f46e5",
    },

    uploadBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#4f46e5",
        paddingVertical: 16,
        borderRadius: 14,
        elevation: 3,
    },

    uploadText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 10,
    },

    infoText: {
        textAlign: "center",
        marginTop: 15,
        color: "#6b7280",
        fontSize: 13,
    },
});
