import { Avatar, Button, Center, Flex, Heading, IconButton, Input, Spinner, Text } from "@chakra-ui/react";
import { addDoc, collection, doc, orderBy, query, serverTimestamp, Timestamp } from "firebase/firestore";
import { ArrowLeft, Send } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import Sidebar from "../../components/Sidebar";
import { db } from "../../firebaseconfig";
import getChatDisplayName from "../../utils/getChatDisplayName";
import getOtherEmail from "../../utils/getOtherEmail";

const timeFormat = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });
const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
});
const fullDateTimeFormat = new Intl.DateTimeFormat(undefined, {
    year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
});

function MessageTime({ timestamp, today }) {
    if (!(timestamp instanceof Timestamp)) return null;
    const sentAt = timestamp.toDate();
    if (Number.isNaN(sentAt.getTime())) return null;

    let formatter = fullDateTimeFormat;
    if (sentAt.toDateString() === today.toDateString()) {
        formatter = timeFormat;
    } else if (sentAt.getFullYear() === today.getFullYear()) {
        formatter = dateTimeFormat;
    }

    return (
        <Text as="time" dateTime={sentAt.toISOString()} alignSelf="flex-end" fontSize="xs" opacity={0.85}>
            {formatter.format(sentAt)}
        </Text>
    );
}

function Composer({ messages, email }) {
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    async function sendMessage(event) {
        event.preventDefault();
        const text = input.trim();
        if (!text || sending) return;

        setSending(true);
        setError("");
        try {
            await addDoc(messages, { text, sender: email, timestamp: serverTimestamp() });
            setInput(draft => draft === input ? "" : draft);
        } catch {
            setError("Couldn’t send your message. Please try again.");
        } finally {
            setSending(false);
        }
    }

    return (
        <Flex as="form" direction="column" gap={2} p={3} borderTopWidth="1px" onSubmit={sendMessage}>
            {error && <Text role="alert" color="red.600">{error}</Text>}
            <Flex align="center" gap={3}>
                <Input
                    aria-label="Message"
                    placeholder="Type a message…"
                    autoComplete="off"
                    value={input}
                    onChange={event => setInput(event.target.value)}
                />
                <IconButton
                    aria-label="Send message"
                    type="submit"
                    bg="#1E293B"
                    color="white"
                    _hover={{ bg: "#1E293B" }}
                    loading={sending}
                    disabled={!input.trim()}
                >
                    <Send size={18} />
                </IconButton>
            </Flex>
        </Flex>
    );
}

function Messages({ chatId, email }) {
    const list = useRef(null);
    const nearBottom = useRef(true);
    const messages = collection(db, "chats", chatId, "messages");
    const [snapshot, loading, error] = useCollection(query(messages, orderBy("timestamp")));
    const lastMessage = snapshot?.docs.at(-1);
    const lastMessageKey = lastMessage && `${lastMessage.id}:${lastMessage.metadata.hasPendingWrites}`;
    const today = new Date();

    useEffect(() => {
        if (nearBottom.current && list.current) {
            list.current.scrollTop = list.current.scrollHeight;
        }
    }, [lastMessageKey]);

    return (
        <>
            <Flex
                ref={list}
                flex={1}
                minH={0}
                direction="column"
                p={4}
                gap={2}
                overflowY="auto"
                onScroll={event => {
                    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
                    nearBottom.current = scrollHeight - scrollTop - clientHeight < 60;
                }}
            >
                {loading ? (
                    <Spinner alignSelf="center" role="status" aria-label="Loading messages" />
                ) : error ? (
                    <Text role="alert" color="red.600">Couldn’t load messages. Refresh to try again.</Text>
                ) : snapshot?.empty ? (
                    <Text color="fg.muted" textAlign="center">Send the first message.</Text>
                ) : snapshot?.docs.map(message => {
                    const { sender, text, timestamp } = message.data();
                    if (typeof text !== "string") return null;
                    const fromMe = typeof sender === "string" && sender.toLowerCase() === email.toLowerCase();
                    return (
                        <Flex
                            key={message.id}
                            alignSelf={fromMe ? "flex-end" : "flex-start"}
                            direction="column"
                            gap={1}
                            bg={fromMe ? "#1E293B" : "bg.muted"}
                            color={fromMe ? "white" : "fg"}
                            borderRadius="lg"
                            maxW="85%"
                            px={3}
                            py={2}
                        >
                            <Text overflowWrap="anywhere" whiteSpace="pre-wrap">{text}</Text>
                            {!message.metadata.hasPendingWrites && <MessageTime timestamp={timestamp} today={today} />}
                        </Flex>
                    );
                })}
            </Flex>
            {!error && <Composer messages={messages} email={email} />}
        </>
    );
}

function Conversation({ chatId, user }) {
    const [chat, loading, error] = useDocument(doc(db, "chats", chatId));
    const { users, displayNames } = chat?.data() ?? {};
    const isParticipant = Array.isArray(users) && (
        users.includes(user.email) || users.includes(user.email.toLowerCase())
    );
    const recipient = isParticipant ? getOtherEmail(users, user) : undefined;
    const name = recipient ? getChatDisplayName(displayNames, recipient) : undefined;

    return (
        <Flex as="main" flex={1} minW={0} direction="column" bg="bg.subtle">
            <Flex as="header" align="center" gap={3} p={3} minH="81px" borderBottomWidth="1px">
                <Button asChild variant="ghost" display={{ base: "inline-flex", md: "none" }}>
                    <Link href="/"><ArrowLeft size={18} /> Chats</Link>
                </Button>
                {name && <Avatar.Root><Avatar.Fallback name={name} /></Avatar.Root>}
                <Heading as="h1" size="md" truncate>{name || "Conversation"}</Heading>
            </Flex>
            {loading ? (
                <Center flex={1}><Spinner role="status" aria-label="Loading conversation" /></Center>
            ) : error || !recipient ? (
                <Center flex={1} p={4}>
                    <Text role="alert" color="red.600">
                        {error && error.code !== "permission-denied"
                            ? "Couldn’t load this chat. Refresh to try again."
                            : "This chat is unavailable."}
                    </Text>
                </Center>
            ) : (
                <Messages chatId={chatId} email={user.email} />
            )}
        </Flex>
    );
}

export default function Chat({ user }) {
    const router = useRouter();
    const { id } = router.query;

    if (!router.isReady) {
        return <Center minH="100dvh"><Spinner role="status" aria-label="Opening chat" /></Center>;
    }
    if (typeof id !== "string" || !id || id.includes("/")) {
        return (
            <Center minH="100dvh" flexDirection="column" gap={3}>
                <Text role="alert">This chat is unavailable.</Text>
                <Button asChild><Link href="/">Back to chats</Link></Button>
            </Center>
        );
    }

    return (
        <Flex h="100dvh">
            <Head><title>Comms</title></Head>
            <Sidebar user={user} activeChatId={id} />
            <Conversation key={id} chatId={id} user={user} />
        </Flex>
    );
}
