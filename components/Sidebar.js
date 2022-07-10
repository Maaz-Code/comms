import { CloseIcon } from "@chakra-ui/icons"
import { Avatar, Button, Flex, IconButton, Text } from "@chakra-ui/react"
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from "../firebaseconfig";
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, addDoc } from "firebase/firestore";
import getOtherEmail from "../utils/getOtherEmail";
import {useRouter} from "next/router";

const Sidebar = () => {
    const [user] = useAuthState(auth);
    const [snapshot] = useCollection(collection(db, 'chats'));
    const chats = snapshot?.docs.map(doc => ({id: doc.id, ...doc.data()}));
    const router = useRouter();
    
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

    const newChat = async() => {
        const input = prompt("Enter email of the recipient");
        if(!chatAlreadyExists(input) && (input != user.email) && (input != null)) {
            await addDoc(collection(db, 'chats'), {users: [user.email, input]});
        }
    }

    return (
        <Flex 
        w = "300px"
        h = "100%"
        borderEnd = "1px solid"
        borderColor = "gray.200"
        direction = "column"
        >
            <Flex 
            w = "100%" h = "81px" 
            justifyContent = "space-between" 
            align = "center" p = {3} 
            borderBottom = "1px solid" borderColor = "gray.200"
            >
                <Flex align = "center">
                    <Avatar src = {user.photoURL} marginEnd = {3}/>
                    <Text>{user.displayName}</Text>
                </Flex>
                <IconButton isRound icon = {<CloseIcon/>} size = "sm" color = "#433491"/>
            </Flex>

            <Button bg = "blue.50" color = "blue.500" m = {5} p = {4} _hover = {{bg: "blue.100", cursor: "pointer"}}
            onClick = {() => newChat()}>
                New Chat
            </Button>

            <Flex overflowY = "auto" direction = "column" sx = {{scrollbarWidth: "none"}} flex = {1}>
                {chatList()}
            </Flex>
        </Flex>
    )
}

export default Sidebar