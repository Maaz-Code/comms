import { CloseIcon } from "@chakra-ui/icons"
import { Avatar, Button, Flex, IconButton, Text } from "@chakra-ui/react"
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from "../firebaseconfig";
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection } from "firebase/firestore";


const Sidebar = () => {
    const [user] = useAuthState(auth);
    const [snapshot, loading, error] = useCollection(collection(db, 'chats'));
    const chats = snapshot?.docs.map(docs => ({id: docs.id, ...docs.data()}));

    const chatList = () => {
        return (
            chats?.map ( chat => (
                <Flex key = {Math.random()} align = "center" p = {3} _hover = {{bg: "gray.200", cursor: "pointer"}}>
                    <Avatar src = "" marginEnd = {3}/>
                    <Text>{chat.users}</Text>
                </Flex>
            ))
        )
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

            <Button bg = "blue.50" color = "blue.500" m = {5} p = {4} _hover = {{bg: "blue.100", cursor: "pointer"}}>New Chat</Button>

            <Flex overflowY = "auto" direction = "column" sx = {{scrollbarWidth: "none"}} flex = {1}>
                {chatList()}
            </Flex>
        </Flex>
    )
}

export default Sidebar