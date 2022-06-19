import { ChatIcon } from "@chakra-ui/icons"
import { Box, Button, Center, Stack } from "@chakra-ui/react"
import { useSignInWithGoogle } from "react-firebase-hooks/auth"
import Head from "next/head"
import { auth } from "../firebaseconfig"

const Login = () => {
    const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

    return (
        <>
        <Head>
            <title>Login to Comms</title>
        </Head>

        <Center h = "100vh">
            <Stack
            align = "center"
            bgColor = "#433491"
            p = {16}
            spacing = {12}
            boxShadow = "lg"
            rounded = "3xl"
            >
                <Box 
                bgColor = "gray.300"
                w = "fit-content"
                p = {5}
                rounded = "3xl"
                boxShadow = "md"
                >
                    <ChatIcon w = "100px" h = "100px" color = "black" />
                </Box>
                <Button boxShadow = "md" onClick={() => signInWithGoogle("", {promp: "select_account"})}>Sign in with Google</Button>
            </Stack>
        </Center>
        </>
    )
}

export default Login