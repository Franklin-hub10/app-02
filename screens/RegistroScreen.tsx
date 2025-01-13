import { StyleSheet,  Text,  TextInput,  TouchableOpacity,  View, Alert, Image,  Modal,} from "react-native";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { ref, set } from "firebase/database";
import { auth, db } from '../config/Config';


export default function RegistroScreen({ navigation }: any) {
    const [correo, setCorreo] = useState("");
    const [contrasenia, setContrasenia] = useState("");
    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [isModalVisible, setModalVisible] = useState(false); // Estado para el modal

    // Función para abrir la cámara
    const openCamera = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
        setModalVisible(false); // Cerrar el modal
    };

    // Función para abrir la galería
    const openGallery = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
        setModalVisible(false); // Cerrar el modal
    };
    function registro() {
        if (!correo || !contrasenia || !nombre || !telefono || !image) {
            Alert.alert("Error", "Por favor completa todos los campos, incluida la foto.");
            return;
        }
    
        createUserWithEmailAndPassword(auth, correo, contrasenia)
            .then((userCredential) => {
                const user = userCredential.user;
    
                // Guardar datos adicionales en Realtime Database
                const userId = user.uid; // Obtén el UID del usuario
                set(ref(db, `usuarios/${userId}`), {
                    nombre: nombre,
                    telefono: telefono,
                    correo: correo,
                    image: image,
                })
                    .then(() => {
                        Alert.alert("Registro exitoso", "Datos guardados correctamente.");
                        navigation.navigate("Welcome");
                    })
                    .catch((error) => {
                        Alert.alert("Error", "No se pudieron guardar los datos: " + error.message);
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                let mensaje = "Ocurrió un error al registrarte.";
    
                switch (errorCode) {
                    case "auth/email-already-in-use":
                        mensaje = "El correo ya está en uso. Por favor usa otro.";
                        break;
                    case "auth/invalid-email":
                        mensaje = "El correo ingresado no es válido.";
                        break;
                    case "auth/weak-password":
                        mensaje = "La contraseña debe tener al menos 6 caracteres.";
                        break;
                    default:
                        mensaje = `Error: ${error.message}`;
                        break;
                }
    
                Alert.alert("Error", mensaje);
            });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registro</Text>

            {/* Mostrar imagen debajo del título "Registro" */}
            {image && (
                <View style={styles.imagePreviewContainer}>
                    <Text style={styles.imagePreviewText}>Imagen seleccionada:</Text>
                    <Image source={{ uri: image }} style={styles.image} />
                </View>
            )}

            <TouchableOpacity
                style={styles.selectImageButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.buttonText}>Seleccionar foto</Text>
            </TouchableOpacity>

            <TextInput
                style={styles.input}
                placeholder="Nombre"
                placeholderTextColor="#aaa"
                onChangeText={(texto) => setNombre(texto)}
                autoCapitalize="words"
            />

            <TextInput
                style={styles.input}
                placeholder="Teléfono"
                placeholderTextColor="#aaa"
                onChangeText={(texto) => setTelefono(texto)}
                keyboardType="phone-pad"
            />

            <TextInput
                style={styles.input}
                placeholder="Correo Electrónico"
                placeholderTextColor="#aaa"
                onChangeText={(texto) => setCorreo(texto)}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#aaa"
                onChangeText={(texto) => setContrasenia(texto)}
                secureTextEntry={true}
                autoCapitalize="none"
            />

            {/* Modal para elegir opción */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Seleccionar Foto</Text>
                        <TouchableOpacity style={styles.modalButton} onPress={openCamera}>
                            <Text style={styles.buttonText}>Tomar foto</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={openGallery}>
                            <Text style={styles.buttonText}>Seleccionar de galería</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity style={styles.button} onPress={registro}>
                <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.registerText}>¿Ya tienes una cuenta? Inicia sesión</Text>
            </TouchableOpacity>
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
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#4CAF50",
        marginBottom: 10,
    },
    input: {
        height: 50,
        fontSize: 18,
        backgroundColor: "#ffffff",
        marginVertical: 10,
        borderRadius: 10,
        paddingHorizontal: 20,
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
    },
    button: {
        marginTop: 20,
        backgroundColor: "#4CAF50",
        borderRadius: 10,
        width: "100%",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    selectImageButton: {
        backgroundColor: "#4CAF50",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 10,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#ffffff",
        textAlign: "center",
    },
    registerText: {
        marginTop: 10,
        fontSize: 16,
        color: "#4CAF50",
        textDecorationLine: "underline",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        width: "80%",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
    },
    modalButton: {
        backgroundColor: "#4CAF50",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 10,
        width: "100%",
        alignItems: "center",
    },
    closeButton: {
        backgroundColor: "#FF5252",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 10,
        width: "100%",
        alignItems: "center",
    },
    imagePreviewContainer: {
        alignItems: "center",
        marginBottom: 10,
    },
    imagePreviewText: {
        fontSize: 16,
        color: "#333",
        marginBottom: 10,
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 100,
    },
});
