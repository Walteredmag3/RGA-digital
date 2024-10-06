import * as SecureStore from 'expo-secure-store';

export async function saveToken(key: string, value: string) {
    try {
        await SecureStore.setItemAsync(key, value);
    } catch (error) {
        console.error("Erro ao salvar o token:", error);
    }
}

export async function getToken(key: string) {
    try {
        return await SecureStore.getItemAsync(key);
    } catch (error) {
        console.error("Erro ao obter o token:", error);
    }
}

export const tokenCache = { getToken, saveToken };



