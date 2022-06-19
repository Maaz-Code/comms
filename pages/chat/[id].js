import { ArrowRightIcon } from "@chakra-ui/icons"
import { Avatar, Flex, Heading, IconButton, Input, Button } from "@chakra-ui/react"
import Sidebar from "../../components/Sidebar"
import { signOut } from "firebase/auth"
import { auth } from "../../firebaseconfig"
import Head from "next/head"


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
    return (
        <Flex h = "100vh">
            <Head>
                <title>Comms</title>
            </Head>
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