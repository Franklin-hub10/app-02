import { StyleSheet, Text, View, TouchableOpacity, Alert, Image, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../config/Config"; // Asegúrate de que `db` provenga de Realtime Database
import { ref, onValue } from "firebase/database";
import { signOut } from "firebase/auth";
import Icon from "react-native-vector-icons/Ionicons";

export default function WelcomeScreen({ navigation }: any) {
    const [userData, setUserData] = useState<any>(null); // Estado para los datos del usuario
    const [isLoading, setIsLoading] = useState(true); // Estado para indicar carga

    useEffect(() => {
        const fetchUserData = () => {
            const user = auth.currentUser;

            if (user) {
                const userRef = ref(db, `usuarios/${user.uid}`); // Referencia al nodo del usuario en Realtime Database

                onValue(
                    userRef,
                    (snapshot) => {
                        const data = snapshot.val();
                        if (data) {
                            setUserData(data);
                        } else {
                            Alert.alert("Error", "No se encontraron datos del usuario.");
                        }
                        setIsLoading(false); // Finaliza el estado de carga
                    },
                    (error) => {
                        console.error("Error al leer los datos del usuario:", error);
                        Alert.alert("Error", "No se pudieron cargar los datos del usuario.");
                        setIsLoading(false);
                    }
                );
            } else {
                Alert.alert("Error", "No hay un usuario autenticado.");
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                Alert.alert("Sesión cerrada", "Has cerrado sesión exitosamente.");
                navigation.navigate("Login"); // Redirige a la pantalla de login
            })
            .catch((error) => {
                Alert.alert("Error", "No se pudo cerrar sesión. Por favor, intenta nuevamente.");
            });
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text>Cargando datos del usuario...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Botón de cerrar sesión */}
            <TouchableOpacity style={styles.logoutIcon} onPress={handleLogout}>
                <Icon name="log-out-outline" size={30} color="#4CAF50" />
            </TouchableOpacity>

            {/* Mensaje de bienvenida */}
            <Text style={styles.title}>Bienvenido</Text>

            {/* Mostrar datos del perfil del usuario */}
            {userData ? (
                <View style={styles.profileContainer}>
                    {/* Mostrar imagen del usuario si está disponible */}
                    {userData.image ? (
                        <Image source={{ uri: userData.image }} style={styles.profileImage} />
                    ) : (
                        <Icon name="person-circle-outline" size={100} color="#ccc" />
                    )}
                    <Text style={styles.profileText}>Nombre: {userData.nombre}</Text>
                    <Text style={styles.profileText}>Correo: {userData.correo}</Text>
                    <Text style={styles.profileText}>Teléfono: {userData.telefono}</Text>
                </View>
            ) : (
                <Text style={styles.errorText}>No se pudieron cargar los datos del usuario.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
    },
    logoutIcon: {
        position: "absolute",
        top: 20,
        right: 20,
        padding: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#4CAF50",
        marginBottom: 20,
    },
    profileContainer: {
        alignItems: "center",
        marginTop: 20,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
    },
    profileText: {
        fontSize: 18,
        color: "#333",
        marginBottom: 10,
    },
    errorText: {
        fontSize: 16,
        color: "#FF5252",
        marginTop: 20,
    },
});
