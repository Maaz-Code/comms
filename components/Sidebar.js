import { CloseIcon } from "@chakra-ui/icons"
import { Avatar, Button, Flex, IconButton, Text } from "@chakra-ui/react"

const Chats = () => {
    return (
        <Flex align = "center" p = {3} _hover = {{bg: "gray.200", cursor: "pointer"}}>
            <Avatar src = "" marginEnd = {3}/>
            <Text>Kyojuro Rengoku</Text>
        </Flex>
    )
}

const Sidebar = () => {
    return (
        <Flex 
        w = "300px"
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
                    <Avatar src = "" marginEnd = {3}/>
                    <Text>Tengen Uzui</Text>
                </Flex>
                <IconButton isRound icon = {<CloseIcon/>} size = "sm" />
            </Flex>

            <Button m = {5} p = {4}>New Chat</Button>

            <Flex overflowY = "auto" direction = "column" sx = {{scrollbarWidth: "none"}} flex = {1}>
                <Chats/>
                <Chats/>
                <Chats/>
            </Flex>

        </Flex>
    )
}

export default Sidebar