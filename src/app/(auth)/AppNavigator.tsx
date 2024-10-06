// AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Form from './form'; // Atualize o caminho conforme necessário
import PhotoScreen from './photo'; // Crie este componente ou atualize o caminho

// Definindo os tipos de parâmetros para cada rota
export type RootStackParamList = {
    Form: undefined;
    PhotoScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Form">
                <Stack.Screen name="Form" component={Form} />
                <Stack.Screen name="PhotoScreen" component={PhotoScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
