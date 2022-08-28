import { ChatIcon } from "@chakra-ui/icons"
import { Box, Button, Center, Stack, useToast } from "@chakra-ui/react"
import { useSignInWithGoogle } from "react-firebase-hooks/auth"
import Head from "next/head"
import { auth } from "../firebaseconfig"

const Login = () => {
    const toast = useToast();
    const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

    return (
        <>
        <Head>
            <title>Login to Comms</title>
        </Head>
        <div className = "area" >
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
        <Center h = "100vh" bgColor = "#B9D0EC">
            <Stack
            align = "center"
            bgColor = "#1E293B"
            p = {16}
            spacing = {12}
            boxShadow = "md"
            rounded = "xl"
            >
                <Box 
                bgColor = "#FFFFFF"
                w = "fit-content"
                p = {5}
                rounded = "3xl"
                boxShadow = "md"
                >
                    <ChatIcon w = "100px" h = "100px" color = "black" />
                </Box>
                <Button boxShadow = "md" onClick={() => {signInWithGoogle("", {prompt: "select_account"}, toast({title: 'Login in process...', status: 'info', duration: 8000, isClosable: true, position: 'bottom-left'}))}} bgColor = "#FFFFFF">
                    Sign in with Google
                </Button>
            </Stack>
        </Center>
        </>
    )
}

export default Login