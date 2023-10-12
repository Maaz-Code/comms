// import { CloseIcon } from "@chakra-ui/icons"
import { Avatar, Button, Flex, Text, useDisclosure } from "@chakra-ui/react"
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from "../firebaseconfig";
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, addDoc } from "firebase/firestore";
import getOtherEmail from "../utils/getOtherEmail";
import {useRouter} from "next/router";
import DialogBox from "./DialogBox.js";

const Sidebar = () => {
    const [user] = useAuthState(auth);
    const [snapshot] = useCollection(collection(db, 'chats'));
    const chats = snapshot?.docs.map(doc => ({id: doc.id, ...doc.data()}));
    const router = useRouter();
    const { isOpen, onClose, onOpen } = useDisclosure();
    
    const redirect = (id) => {
        router.push(`/chat/${id}`);
    }

    const chatList = () => {
        return (
            chats?.filter(chat => chat.users.includes(user.email))
            .map ( 
                chat => 
                    <Flex key = {Math.random()} align = "center" p = {3} _hover = {{bg: "gray.200", cursor: "pointer"}} 
                    onClick = {() => redirect(chat.id)}>
                        <Avatar src = "" marginEnd = {3}/>
                        <Text>{getOtherEmail(chat.users, user)}</Text>
                    </Flex>
            )
        )
    }

    const chatAlreadyExists = (email) => chats?.find(chat => chat.users.includes(email) && chat.users.includes(user.email));

    const newChat = async(input) => {
        if(!chatAlreadyExists(input) && (input != user.email) && (input != null)) {
            await addDoc(collection(db, 'chats'), {users: [user.email, input]});
        }
    }

    // const closeSidebar = () => {
    //     console.log("close sidebar");
    // }

    return (
        <>
        {<DialogBox isOpen={isOpen} onClose={onClose} newChat={newChat}/>}
        <Flex 
        w = "330px"
        h = "100vh"
        borderEnd = "1px solid"
        borderColor = "gray.200"
        direction = "column"
        className = "sidebar"
        >
            <Flex 
            w = "100%" h = "81px" 
            justifyContent = "space-between" 
            align = "center" p = {3} 
            >
                <Flex align = "center">
                    <Avatar src = {user.photoURL} marginEnd = {3}/>
                    <Text fontSize = "lg">{user.displayName}</Text>
                </Flex>
                {/* <IconButton isRound icon = {<CloseIcon/>} size = "sm" color = "#1E293B" onClick={closeSidebar()}/> */}
            </Flex>

            <Button bg = "blue.50" color = "blue.500" m = {5} p = {4} _hover = {{bg: "blue.100", cursor: "pointer"}}
            onClick = {() => onOpen()}>
                New Chat
            </Button>

            <Flex overflowY = "auto" direction = "column" sx = {{scrollbarWidth: "none"}} flex = {1}>
                {chatList()}
            </Flex>
        </Flex>
        </>
    )
}

export default Sidebar