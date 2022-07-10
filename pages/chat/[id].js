import { ArrowRightIcon } from "@chakra-ui/icons"
import { Avatar, Flex, Heading, IconButton, Input, Button, Text } from "@chakra-ui/react"
import Sidebar from "../../components/Sidebar"
import Head from "next/head"
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from "firebase/auth"
import { auth, db } from "../../firebaseconfig"
import { useRouter } from "next/router"
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, orderBy, query } from "firebase/firestore"

const Topbar = () => {
    return (
        <Flex align = "center" w = "100%" h = "81px" p = {3}>
            <Avatar src = "" marginEnd = {3}/>
            <Heading size = "md" flex = {1}>Zenitsu</Heading>
            <Button bg = "red.50" color = "red.500" 
            marginEnd = "2" p = {4} 
            _hover = {{bg: "red.100", cursor: "pointer"}} 
            onClick = {() => signOut(auth)}>
                Sign Out
            </Button>
        </Flex>
    )
}

const Bottombar = () => {
    return (
        <Flex borderTop = "1px solid" borderTopColor = "gray.200" p = {3}>
            <Input placeholder = "Type a message..." marginEnd = {3}/>
            <IconButton icon = {<ArrowRightIcon/>} size = "md" color = "#433491" />
        </Flex>
    )
}

export default function Chat () {

    const [user] = useAuthState(auth);

    const router = useRouter();
    const { id } = router.query;

    const q = query(collection(db, `chats/${id}/messages`), orderBy('timestamp'));
    const [messages] = useCollectionData(q);

    const getMessages = () => messages?.map(msg => {
        const sender = msg.sender === user.email;

        return (
            <Flex key = {Math.random()} alignSelf = {sender ? "flex-start" : "flex-end"} bg = {sender ? "gray.100" : "#433491"} borderRadius = "lg" w = "fit-content" minWidth = "100px" p = {3} m = {1} color = {sender ? "black" : "white"}>
                <Text>{msg.text}</Text>
            </Flex>
        )       
    })

    return (
        <Flex h = "100vh">
            <Head>
                <title>Comms</title>
            </Head>
            <Sidebar/>
            <Flex flex = {1} direction = "column" onClick={() => getMessages()}>
                <Topbar/>
                <Flex flex = {1} direction = "column" pt = {4} mx = {5} overflowY = "auto" sx = {{scrollbarWidth: "none"}}>
                    {getMessages()}
                </Flex>
                <Bottombar/>
            </Flex>
        </Flex>
    )
}