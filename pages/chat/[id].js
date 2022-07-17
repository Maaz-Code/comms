import { ArrowRightIcon } from "@chakra-ui/icons"
import { Avatar, Flex, Heading, IconButton, Input, Button, Text, FormControl } from "@chakra-ui/react"
import Sidebar from "../../components/Sidebar"
import Head from "next/head"
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from "firebase/auth"
import { auth, db } from "../../firebaseconfig"
import { useRouter } from "next/router"
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';
import { collection, orderBy, query, doc, addDoc, serverTimestamp } from "firebase/firestore"
import getOtherEmail from "../../utils/getOtherEmail";
import { useState, useRef, useEffect } from "react";

const Topbar = ({username}) => {
    return (
        <Flex align = "center" w = "100%" h = "81px" p = {3}>
            <Avatar src = "" marginEnd = {3}/>
            <Heading size = "md" flex = {1}>{username}</Heading>
            <Button bg = "red.50" color = "red.500" 
            marginEnd = "2" p = {4} 
            _hover = {{bg: "red.100", cursor: "pointer"}} 
            onClick = {() => signOut(auth)}>
                Sign Out
            </Button>
        </Flex>
    )
}

const Bottombar = ({id, user}) => {
    const [input, setInput] = useState("");
    const sendMessage = async(e) => {
        e.preventDefault();
        if(input.length > 0) {
            await addDoc(collection(db, `chats/${id}/messages`), {
                text: input,
                sender: user.email,
                timestamp: serverTimestamp()
            })
            setInput("");
        }
    }

    return (
        <FormControl display = "flex" borderTop = "1px solid" borderTopColor = "gray.200" p = {3} onSubmit = {sendMessage} as = "form">
            <Input placeholder = "Type a message..." marginEnd = {3} autoComplete = "off" 
            onChange={e => setInput(e.target.value)} value = {input}/>
            <IconButton icon = {<ArrowRightIcon/>} size = "md" color = "#433491" type = "submit"/>
        </FormControl>
    )
}

export default function Chat () {
    const scrollToLatestChat = useRef();
    const [user] = useAuthState(auth);

    const router = useRouter();
    const { id } = router.query;

    const q = query(collection(db, `chats/${id}/messages`), orderBy('timestamp'));
    const [messages] = useCollectionData(q);
    const [chat] = useDocumentData(doc(db, "chats", id));

    const getMessages = () => messages?.map(msg => {
        const sender = msg.sender === user.email;

        return (
            <Flex key = {Math.random()} alignSelf = {sender ? "flex-start" : "flex-end"} bg = {sender ? "gray.100" : "#433491"} borderRadius = "lg" w = "fit-content" minWidth = "50px" p = {3} m = {1} color = {sender ? "black" : "white"}>
                <Text>{msg.text}</Text>
            </Flex>
        )       
    })

    useEffect(() => {
        setTimeout(
            scrollToLatestChat.current.scrollIntoView({
                behavior: "smooth",
                block: "start"
            }), 100)
    ,[messages]})

    return (
        <Flex h = "100vh">
            <Head>
                <title>Comms</title>
            </Head>
            <Sidebar/>
            <Flex flex = {1} direction = "column" onClick={() => getMessages()}>
                <Topbar username = {getOtherEmail(chat?.users, user)}/>
                <Flex flex = {1} direction = "column" pt = {4} mx = {5} overflowY = "auto" sx = {{scrollbarWidth: "none"}}>
                    {getMessages()}
                    <div ref = {scrollToLatestChat}></div>
                </Flex>
                <Bottombar id = {id} user = {user}/>
            </Flex>
        </Flex>
    )
}