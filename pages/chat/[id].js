import { ArrowRightIcon } from "@chakra-ui/icons"
import { Avatar, Flex, Heading, IconButton, Input, Button, Text, FormControl, useToast } from "@chakra-ui/react"
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
    const toast = useToast();
    return (
        <Flex align = "center" w = "100%" h = "81px" p = {3} borderBottom = "1px solid" borderColor = "gray.300" shadow = "base">
            <Avatar src = "" marginEnd = {3}/>
            <Heading size = "md" flex = {1}>{username}</Heading>
            <Button bg = "white" color = "red.500" 
            marginEnd = "2" p = {4} shadow = "xl"
            _hover = {{bg: "red.100", cursor: "pointer"}} 
            onClick = {() => {signOut(auth); toast({status: 'success', title: 'Signed Out!', duration: 3000, isClosable: true, position: 'top-right'})}}>
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
        <FormControl display = "flex" borderTop = "1px solid" borderTopColor = "gray.200" p = {3} onSubmit = {sendMessage} as = "form" shadow = "base">
            <Input placeholder = "Type a message..." marginEnd = {3} autoComplete = "off" shadow = "xl"
            onChange={e => setInput(e.target.value)} value = {input} bgColor = "white" />
            <IconButton icon = {<ArrowRightIcon/>} shadow = "xl" size = "md" color = "white" type = "submit" bgColor = "#1E293B" _hover = {{bgColor: "none", color: "none", cursor: "pointer"}}/>
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
            <Flex key = {Math.random()} shadow = {sender ? "lg" : "xl"} alignSelf = {sender ? "flex-start" : "flex-end"} bg = {sender ? "white" : "#1E293B"} borderRadius = "lg" w = "fit-content" minWidth = "50px" p = {3} m = {1} color = {sender ? "black" : "white"}>
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
            <Flex flex = {1} direction = "column" onClick={() => getMessages()} bgColor = "ghostwhite">
                <Topbar username = {getOtherEmail(chat?.users, user)}/>
                <Flex flex = {1} direction = "column" pt = {4} px = {4}  overflowY = "auto" sx = {{scrollbarWidth: "none"}}>
                    {getMessages()}
                    <div ref = {scrollToLatestChat}></div>
                </Flex>
                <Bottombar id = {id} user = {user}/>
            </Flex>
        </Flex>
    )
}