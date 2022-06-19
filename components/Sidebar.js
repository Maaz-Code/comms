import { CloseIcon } from "@chakra-ui/icons"
import { Avatar, Button, Flex, IconButton, Text } from "@chakra-ui/react"
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "../firebaseconfig";

const Chats = () => {
    return (
        <Flex align = "center" p = {3} _hover = {{bg: "gray.200", cursor: "pointer"}}>
            <Avatar src = "" marginEnd = {3}/>
            <Text>Kyojuro Rengoku</Text>
        </Flex>
    )
}

const Sidebar = () => {
    const [user] = useAuthState(auth);

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
                <Chats/>
                <Chats/>
                <Chats/>
            </Flex>
        </Flex>
    )
}

export default Sidebar