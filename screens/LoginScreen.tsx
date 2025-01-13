import { Alert, Button, Modal, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/Config';




export default function LoginScreen({ navigation }: any) {
    const [correo, setCorreo] = useState('');
    const [contrasenia, setContrasenia] = useState('');
    const [verModal, setVerModal] = useState(false);
    const [correoRestablecer, setCorreoRestablecer] = useState('');

    function login() {
        signInWithEmailAndPassword(auth, correo, contrasenia)
            .then((userCredential) => {
                const user = userCredential.user;
                navigation.navigate('MainTabs');
            })
            .catch((error) => {
                const errorCode = error.code;
                let titulo = 'Error';
                let mensaje = 'Ocurrió un error desconocido.';
    
                switch (errorCode) {
                    case 'auth/wrong-password':
                        titulo = 'Error en la contraseña';
                        mensaje = 'Contraseña incorrecta. Por favor, verifícala.';
                        break;

                        case 'auth/invalid-credential':
                        titulo = 'Credenciales incorrectas';
                        mensaje = 'Por favor, verifícala.';
                        break;
    
                    case 'auth/user-not-found':
                        titulo = 'Usuario no encontrado';
                        mensaje = 'Por favor verifica el correo ingresado.';
                        break;
    
                    case 'auth/invalid-email':
                        titulo = 'Correo inválido';
                        mensaje = 'El correo ingresado no es válido. Por favor verifica.';
                        break;
    
                    case 'auth/user-disabled':
                        titulo = 'Usuario deshabilitado';
                        mensaje = 'La cuenta está deshabilitada. Contacta al soporte.';
                        break;
    
                    case 'auth/too-many-requests':
                        titulo = 'Demasiados intentos';
                        mensaje = 'Has intentado iniciar sesión demasiadas veces. Intenta más tarde.';
                        break;
    
                    case 'auth/network-request-failed':
                        titulo = 'Error de red';
                        mensaje = 'No se pudo conectar. Verifica tu conexión a internet.';
                        break;
    
                    case 'auth/internal-error':
                        titulo = 'Error interno';
                        mensaje = 'Ocurrió un error inesperado. Intenta más tarde.';
                        break;
    
                    default:
                        mensaje = `Código de error: ${errorCode}`;
                        break;
                }
    
                Alert.alert(titulo, mensaje);
            });
    }
    

    function restablecer() {
        sendPasswordResetEmail(auth, correoRestablecer)
            .then(() => {
                Alert.alert('Mensaje', 'Se ha enviado un mensaje a su correo.');
                setVerModal(false);
            })
            .catch((error) => {
                const errorCode = error.code;
                Alert.alert('Error', errorCode);
            });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Inicio de Sesión</Text>

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

            <TouchableOpacity style={styles.button} onPress={login}>
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
                <Text style={styles.registerText}>Crear una cuenta</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setVerModal(true)}>
                <Text style={styles.forgotText}>Olvidé mi contraseña</Text>
            </TouchableOpacity>

            <Modal visible={verModal} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Restablecer Contraseña</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Correo Electrónico"
                            placeholderTextColor="#aaa"
                            onChangeText={(texto) => setCorreoRestablecer(texto)}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <TouchableOpacity style={styles.modalButton} onPress={restablecer}>
                            <Text style={styles.modalButtonText}>Restablecer</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setVerModal(false)}>
                            <Text style={styles.closeModalText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 20,
    },
    input: {
        height: 50,
        fontSize: 16,
        backgroundColor: '#ffffff',
        marginVertical: 10,
        borderRadius: 8,
        paddingHorizontal: 15,
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    button: {
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    registerText: {
        marginTop: 15,
        fontSize: 16,
        color: '#4CAF50',
        textDecorationLine: 'underline',
    },
    forgotText: {
        marginTop: 10,
        fontSize: 16,
        color: '#4CAF50',
        textDecorationLine: 'underline',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 15,
    },
    modalButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        width: '100%',
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    modalButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeModalText: {
        marginTop: 15,
        fontSize: 16,
        color: '#FF5252',
        textDecorationLine: 'underline',
    },
});
