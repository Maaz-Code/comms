import { MessageSquare } from "lucide-react"
import { Box, Button, Center, Stack, Flex, Text } from "@chakra-ui/react"
import Head from "next/head"
import { useState } from "react"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../firebaseconfig"
import { toaster } from "../utils/toasters"

const signInErrors = {
    "auth/popup-blocked": "Allow pop-ups for this site, then try signing in again.",
    "auth/popup-closed-by-user": "The sign-in window was closed. Try again when you’re ready.",
    "auth/network-request-failed": "Check your internet connection and try again.",
    "auth/unauthorized-domain": "Google sign-in is unavailable on this domain.",
};

const Login = ({ sessionError }) => {
    const [signingIn, setSigningIn] = useState(false);
    const [error, setError] = useState("");

    const signInWithGoogle = async () => {
        setSigningIn(true);
        setError("");
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        try {
            await signInWithPopup(auth, provider);
            toaster.success({ title: "Signed in" });
        } catch (error) {
            setError(signInErrors[error.code] ?? "Couldn’t sign in with Google. Please try again.");
        } finally {
            setSigningIn(false);
        }
    };

    return (
        <>
        <Head>
            <title>Login to Comms</title>
        </Head>
        <div className = "area" aria-hidden="true">
            <ul className = "circles">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div >
        <Center minH="100dvh" px={4} bgColor="#B9D0EC">
            <Flex flexDirection="column" align="center" position="relative">
                <Text className = "headerText" textAlign = "center" w = "100%">Comms</Text>
                <Stack
                align = "center"
                bgColor = "#1E293B"
                p={{ base: 8, sm: 20 }}
                gap={5}
                marginBottom = {10}
                boxShadow = "xl"
                rounded = "xl"
                >
                    <Box 
                    bgColor = "#B9D0EC"
                    w = "fit-content"
                    p = {6}
                    rounded = "3xl"
                    boxShadow = "md"
                    >
                        <MessageSquare size={100} color="black" />
                    </Box>
                    <Button boxShadow="md" onClick={signInWithGoogle} loading={signingIn} loadingText="Signing in…" p={4}>
                        Sign in with Google
                    </Button>
                    {(error || sessionError) && (
                        <Text role="alert" color="red.200" maxW="16rem" textAlign="center">
                            {error || "Couldn’t restore your session. Please try signing in again."}
                        </Text>
                    )}
                </Stack>
            </Flex>
        </Center>
        </>
    )
}

export default Login
