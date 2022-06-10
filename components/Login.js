import { ChatIcon } from "@chakra-ui/icons"
import { Box, Button, Center, Stack } from "@chakra-ui/react"
import Head from "next/head"

const Login = () => {
    return (
        <>
        <Head>
            <title>Login</title>
        </Head>

        <Center h = "100vh">
            <Stack
            align = "center"
            bgColor = "gray.600"
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
                <Button boxShadow = "md">Sign in with Google</Button>
            </Stack>
        </Center>
        </>
    )
}

export default Login