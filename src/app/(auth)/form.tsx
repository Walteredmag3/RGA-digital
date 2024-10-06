import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image, Alert, ScrollView, Pressable } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@clerk/clerk-expo';
import * as ImagePicker from 'expo-image-picker';
import { enableScreens } from 'react-native-screens';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native'; // Importar useNavigation
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../config/firebaseConfig'; // Importe o Firestore do arquivo de configuração
import { Link, router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

enableScreens();

export default function Form() {
    const { user } = useUser();
    const [caregiverName, setCaregiverName] = useState("");
    const [petName, setPetName] = useState("");
    const [pedigree, setPedigree] = useState("");
    const [sex, setSex] = useState("");
    const [height, setHeight] = useState("");
    const [size, setSize] = useState("");
    const [description, setDescription] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [image, setImage] = useState(null);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão Necessária', 'Precisamos de permissão para acessar sua biblioteca de fotos!');
                setHasPermission(false);
            } else {
                setHasPermission(true);
            }
        })();
        
        loadSavedData(); // Carrega os dados salvos no dispositivo

    }, []);

    const loadSavedData = async () => {
        const savedCaregiverName = await SecureStore.getItemAsync('caregiverName');
        const savedPetName = await SecureStore.getItemAsync('petName');
        const savedPedigree = await SecureStore.getItemAsync('pedigree');
        const savedSex = await SecureStore.getItemAsync('sex');
        const savedHeight = await SecureStore.getItemAsync('height');
        const savedSize = await SecureStore.getItemAsync('size');
        const savedDescription = await SecureStore.getItemAsync('description');
        const savedWhatsapp = await SecureStore.getItemAsync('whatsapp');
        const savedImage = await SecureStore.getItemAsync('image');

        if (savedCaregiverName) setCaregiverName(savedCaregiverName);
        if (savedPetName) setPetName(savedPetName);
        if (savedPedigree) setPedigree(savedPedigree);
        if (savedSex) setSex(savedSex);
        if (savedHeight) setHeight(savedHeight);
        if (savedSize) setSize(savedSize);
        if (savedDescription) setDescription(savedDescription);
        if (savedWhatsapp) setWhatsapp(savedWhatsapp);
        if (savedImage) setImage(savedImage);
    }

    const imagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });


        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }

    const handleSaveData = async () => {
        try {

            // Armazena dados localmente
            await SecureStore.setItemAsync('caregiverName', caregiverName);
            await SecureStore.setItemAsync('petName', petName);
            await SecureStore.setItemAsync('pedigree', pedigree);
            await SecureStore.setItemAsync('sex', sex);
            await SecureStore.setItemAsync('height', height);
            await SecureStore.setItemAsync('size', size);
            await SecureStore.setItemAsync('description', description);
            await SecureStore.setItemAsync('whatsapp', whatsapp);
            await SecureStore.setItemAsync('image', image || '');

            const docRef = await addDoc(collection(db, "pets"), {
                caregiverName,
                petName,
                pedigree,
                sex,
                height,
                size,
                description,
                whatsapp,
                image: image || null, // Salva a URI da imagem, se houver
                userId: user?.imageUrl // Associa o documento ao usuário atual
            });
            Alert.alert("Sucesso", "As informações do pet foram salvas com sucesso!");
            router.push("/photo"); // Redireciona para a tela de foto após salvar
        } catch (e) {
            console.error("Erro ao salvar o documento: ", e);
            Alert.alert("Erro", "Ocorreu um erro ao salvar as informações.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Image source={{ uri: user?.imageUrl }} style={styles.userImage} />
                    <View style={styles.textContainer}>
                        <Text style={styles.welcomeText}>Bem-vindo</Text>
                        <Text style={styles.userName}>{user?.fullName || 'Usuário'}</Text>
                        <Pressable onPress={imagePicker} style={styles.imageContainer}>
                            {!image ? (
                                <Image
                                    source={require("./../../../assets/images/FotoP.png")}
                                    style={styles.placeholderImage}
                                />
                            ) : (
                                <Image
                                    source={{ uri: image }}
                                    style={styles.selectedImage}
                                />
                            )}
                        </Pressable>
                    </View>
                </View>

                <Text style={styles.formTitle}>Informações do Pet</Text>

                {/* Inputs para informações do pet */}
                <TextInput style={styles.input} placeholder="Nome do Tutor" value={caregiverName} onChangeText={setCaregiverName} />
                <TextInput style={styles.input} placeholder="WhatsApp para contato" value={whatsapp} onChangeText={setWhatsapp} keyboardType="phone-pad" />
                <TextInput style={styles.input} placeholder="Nome do Pet" value={petName} onChangeText={setPetName} />
                <TextInput style={styles.input} placeholder="Pedigree" value={pedigree} onChangeText={setPedigree} />

                <Text style={styles.label}>Sexo</Text>
                <View style={styles.radioContainer}>
                    <TouchableOpacity onPress={() => setSex('Macho')} style={sex === 'Macho' ? styles.radioSelected : styles.radio}>
                        <Text style={styles.radioText}>Macho</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSex('Fêmea')} style={sex === 'Fêmea' ? styles.radioSelected : styles.radio}>
                        <Text style={styles.radioText}>Fêmea</Text>
                    </TouchableOpacity>
                </View>

                <TextInput style={styles.input} placeholder="Altura (cm)" keyboardType="numeric" value={height} onChangeText={setHeight} />

                <Text style={styles.label}>Porte</Text>
                <View style={styles.radioContainer}>
                    <TouchableOpacity onPress={() => setSize('Pequeno')} style={size === 'Pequeno' ? styles.radioSelected : styles.radio}>
                        <Text style={styles.radioText}>Pequeno</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSize('Médio')} style={size === 'Médio' ? styles.radioSelected : styles.radio}>
                        <Text style={styles.radioText}>Médio</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSize('Grande')} style={size === 'Grande' ? styles.radioSelected : styles.radio}>
                        <Text style={styles.radioText}>Grande</Text>
                    </TouchableOpacity>
                </View>

                <TextInput style={[styles.input, styles.textArea]} placeholder="Descreva como é o seu pet" value={description} onChangeText={setDescription} multiline numberOfLines={4} />

                <TouchableOpacity style={styles.button} onPress={handleSaveData}>
                    <Text style={styles.buttonText}>Criar ID</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#eef2ff'

    },
    scrollContainer: {
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    userImage: {
        width: 80,
        height: 50,
        borderRadius: 25,
        alignSelf: 'flex-start',
    },
    textContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    welcomeText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    userName: {
        fontSize: 16,
        color: '#666',
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        width: '130%'
    },
    selectedImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderColor: '#000',
        borderWidth: 2,
    },
    placeholderImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 10,
        alignSelf: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        borderRadius: 8,
        fontSize: 16,
    },
    textArea: {
        height: 100,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    radioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    radio: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    radioSelected: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        backgroundColor: '#ddd',
    },
    radioText: {
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
});
