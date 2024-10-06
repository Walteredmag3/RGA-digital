import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store'; // Para armazenamento seguro
import { router } from 'expo-router';
import { enableScreens } from 'react-native-screens';




enableScreens();

export default function PhotoScreen() {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [imageUri, setImageUri] = useState(null); // Estado para armazenar a URI da imagem
    const [formData, setFormData] = useState({
                caregiverName: '',
                petName: '',
                pedigree: '',
                sex: '',
                height: '',
                size: '',
                description: '',
                whatsapp: '',
                image: '', 
                userId: '',
    });


    // Solicitar permissões para acessar a biblioteca de imagens
    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão Necessária', 'Precisamos de permissão para acessar sua biblioteca de fotos!');
            }
        })();
    }, []);

    // Função para abrir a galeria e escolher uma imagem
    const imagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false, // Define como false para não permitir edição
            quality: 1,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri); // Armazena a URI da imagem selecionada
        }
    };

    // Função para deletar todas as informações
    const handleDelete = async () => {
        try {
            await SecureStore.deleteItemAsync('formData'); // Ajuste a chave conforme necessário
            Alert.alert("Informações deletadas", "Todas as informações foram removidas.");
            router.push("/"); // Redireciona para a tela inicial
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível deletar as informações.");
        }
    };

    // Função para abrir o modal com o QR Code
    const openQRCode = () => {
        setModalVisible(true);
    };

    // Função para fechar o modal com o QR Code
    const closeQRCode = () => {
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            {/* Mostra a imagem selecionada, ou uma imagem padrão se não houver imagem */}
            <Image
                source={{ uri: imageUri || 'https://via.placeholder.com/400x600.png?text=User+Photo' }} // URI da imagem selecionada
                style={styles.image} // Aplique o estilo da imagem aqui
            />

            {/* Contêiner para os botões sobrepostos à imagem */}
            <View style={styles.buttonContainer}>
                {/* Botão para escolher uma imagem */}
                <TouchableOpacity
                    style={[styles.button]}
                    onPress={imagePicker} // Chama a função para escolher uma imagem
                >
                    <Text style={styles.buttonText}>Selecionar Imagem</Text>
                </TouchableOpacity>

                {/* Botão QR Code */}
                <TouchableOpacity
                    style={[styles.button, styles.qrButton]}
                    onPress={openQRCode}
                >
                    <Text style={styles.buttonText}>Mostrar QR Code</Text>
                </TouchableOpacity>

                {/* Botão Modificar */}
                <TouchableOpacity
                    style={[styles.button, styles.smallButton]}
                    onPress={() => {
                        router.push("/(auth)/form"); // Redireciona para a rota "/form"
                    }}
                >
                    <Text style={styles.buttonText}>Modificar</Text>
                </TouchableOpacity>

                {/* Botão Deletar */}
                <TouchableOpacity
                    style={[styles.button, styles.smallButton, styles.deleteButton]}
                    onPress={handleDelete}
                >
                    <Text style={styles.buttonText}>Excluir</Text>
                </TouchableOpacity>
            </View>

            {/* Modal para exibir o QR Code */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeQRCode}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Image
                            source={{ uri: 'https://via.placeholder.com/200x200.png?text=QR+Code' }} // Substitua pela URI real do QR Code
                            style={styles.qrCodeModal}
                        />
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={closeQRCode}
                        >
                            <Text style={styles.buttonText}>Fechar</Text>
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
        backgroundColor: '#f5f5f5',
        position: 'relative',
    },
    image: {
        width: '100%', // A imagem ocupa toda a largura da tela
        height: '100%', // A imagem ocupa toda a altura da tela
        resizeMode: 'cover', // Ajusta a imagem para preencher a tela
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        alignItems: 'flex-start',
        zIndex: 1, // Garante que os botões estejam sobre a imagem
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    qrButton: {
        backgroundColor: '#28a745', // Cor diferenciada para o botão QR Code
    },
    smallButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    deleteButton: {
        backgroundColor: '#ff4d4d',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparente para o fundo do modal
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    qrCodeModal: {
        width: 200,
        height: 200,
        borderWidth: 2,
        borderColor: '#000', // Borda preta
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
});
