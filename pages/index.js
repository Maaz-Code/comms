import Head from 'next/head'
import { Center, Flex, Text } from '@chakra-ui/react'
import Sidebar from '../components/Sidebar'

export default function Home({ user }) {
  return (
    <Flex minH="100dvh">
      <Head>
        <title>Comms</title>
        <meta name="description" content="Real-time messaging with Comms." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar user={user} />
      <Center as="main" display={{ base: "none", md: "flex" }} flex={1} bg="bg.subtle">
        <Text color="fg.muted">Select a chat to start messaging.</Text>
      </Center>
    </Flex>
  )
}
