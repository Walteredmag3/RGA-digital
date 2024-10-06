import { View, Text, StyleSheet } from "react-native";
import { Button } from "@/components/Button";
import {router} from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { useOAuth } from "@clerk/clerk-expo";
import * as Liking from "expo-linking"



WebBrowser.maybeCompleteAuthSession()

export default function SignIn() {
    const [isLoading, setIsLoading] = useState(false)
    const googleOAuth = useOAuth({ strategy: "oauth_google"})
    async function onGoogleSignIn(){
        try {
            setIsLoading(true)
            const redirectUrl = Liking.createURL("/")
            const oAuthFlow = await googleOAuth.startOAuthFlow({redirectUrl : redirectUrl})

            if(oAuthFlow.authSessionResult?.type === "success"){
                if(oAuthFlow.setActive){
                    await oAuthFlow.setActive({ session: oAuthFlow.createdSessionId})
                }
            }else {
                setIsLoading(false)
            }
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }
    useEffect(() => {

        WebBrowser.warmUpAsync();

        return () => {
            WebBrowser.coolDownAsync();
        };
    }, []);
    return (
        <View style={styles.container} >
            <Text style={styles.title} >Entrar</Text>
            <Button icon="logo-google" title="Entrar com Google" onPress={onGoogleSignIn} isLoading={isLoading} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        justifyContent: "center",
        gap: 12
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
    },
}) 