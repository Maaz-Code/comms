import { ArrowRightIcon } from "@chakra-ui/icons"
import { Avatar, Flex, Heading, IconButton, Input } from "@chakra-ui/react"
import Sidebar from "../../components/Sidebar"

const Topbar = () => {
    return (
        <Flex align = "center" w = "100%" h = "81px" p = {3}>
            <Avatar src = "" marginEnd = {3}/>
            <Heading size = "md">Zenitsu</Heading>
        </Flex>
    )
}

const Bottombar = () => {
    return (
        <Flex borderTop = "1px solid" borderTopColor = "gray.200" p = {3}>
            <Input placeholder = "Type a message..." marginEnd = {3}/>
            <IconButton icon = {<ArrowRightIcon/>} size = "md" />
        </Flex>
    )
}

export default function Chat () {
    return (
        <Flex h = "100vh">
            <Sidebar/>
            <Flex flex = {1} direction = "column">
                <Topbar/>
                <Flex flex = {1}></Flex>
                <Bottombar/>
            </Flex>
        </Flex>
    )
}