import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
// Remova as importações de Analytics se não for necessário
// import { getAnalytics, isSupported } from 'firebase/analytics';

// Configuração Firebase
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "rgdog-25d07.firebaseapp.com",
    projectId: "rgdog-25d07",
    storageBucket: "rgdog-25d07.appspot.com",
    messagingSenderId: "378453851985",
    appId: "1:378453851985:web:3c0e18066f0f1595b39d70"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Inicializa o Firebase Auth com Persistência usando AsyncStorage
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

// Inicialização Condicional do Firebase Analytics (Opcional)
const initializeFirebaseAnalytics = async () => {
    try {
        const { isSupported } = require('firebase/analytics');
        const analyticsSupported = await isSupported();
        if (analyticsSupported) {
            const { getAnalytics } = require('firebase/analytics');
            const analytics = getAnalytics(app);
            console.log("Firebase Analytics inicializado com sucesso.");
            // Utilize o analytics conforme necessário
        } else {
            console.log("Firebase Analytics não é suportado neste ambiente.");
        }
    } catch (error) {
        console.error("Erro ao inicializar Firebase Analytics:", error);
    }
};

// Chame a função de inicialização condicional do Analytics
initializeFirebaseAnalytics();

// Função para salvar dados do usuário
const saveUserData = async (user, userData) => {
    const { caregiverName, petName, pedigree, sex, height, size, description, whatsapp, image } = userData;
    try {
        const userDoc = doc(db, "users", user?.uid); // Usando o 'uid' do usuário autenticado
        await setDoc(userDoc, {
            caregiverName,
            petName,
            pedigree,
            sex,
            height,
            size,
            description,
            whatsapp,
            image
        });
        console.log("Dados do usuário salvos com sucesso!");
    } catch (error) {
        console.error("Erro ao salvar dados do usuário: ", error);
    }
};

// Verifica o estado da autenticação
onAuthStateChanged(auth, user => {
    if (user) {
        console.log("Usuário autenticado:", user.uid);
        // Aqui você pode chamar `saveUserData`, passando os dados do usuário conforme necessário
        // Exemplo:
        // const userData = { caregiverName: "Nome", petName: "Pet", ... };
        // saveUserData(user, userData);
    } else {
        console.log("Nenhum usuário autenticado.");
    }
});

export { db, saveUserData, auth, app };
