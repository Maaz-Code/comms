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
                <Flex flex = {1} direction = "column" pt = {4} mx = {5} overflowY = "auto" sx = {{scrollbarWidth: "none"}}>
                    <Flex bg = "gray.100" w = "fit-content" minWidth = "100px" p = {3} m = {1} borderRadius = "lg">
                        Where are you going this year?
                    </Flex>
                    <Flex bg = "#433491" color = "white" w = "fit-content" minWidth = "100px" p = {3} m = {1} alignSelf = "flex-end" borderRadius = "lg">
                        I will be travelling to Japan.
                    </Flex>
                    <Flex bg = "gray.100" w = "fit-content" minWidth = "100px" p = {3} m = {1} borderRadius = "lg">
                        Great choice.
                    </Flex>
                    <Flex bg = "#433491" color = "white" w = "fit-content" minWidth = "60px" p = {3} m = {1} alignSelf = "flex-end" borderRadius = "lg">
                        Thanks!
                    </Flex>
                </Flex>
                <Bottombar/>
            </Flex>
        </Flex>
    )
}