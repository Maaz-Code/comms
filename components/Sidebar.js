import { Avatar, Button, Flex, Spinner, Text, useDisclosure } from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import { collection, doc, FieldPath, query, setDoc, updateDoc, where } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebaseconfig";
import getChatDisplayName from "../utils/getChatDisplayName";
import getOtherEmail from "../utils/getOtherEmail";
import { toaster } from "../utils/toasters";
import DialogBox from "./DialogBox";

export default function Sidebar({ user, activeChatId }) {
    const router = useRouter();
    const { open, onClose, onOpen } = useDisclosure();
    const [signingOut, setSigningOut] = useState(false);
    const [signOutError, setSignOutError] = useState("");
    const email = user.email.toLowerCase();
    const displayName = user.displayName?.trim();
    const submittedNames = useRef(new Map());
    const conversations = collection(db, "chats");
    const [snapshot, loading, error] = useCollection(query(
        conversations,
        user.email === email
            ? where("users", "array-contains", email)
            : where("users", "array-contains-any", [user.email, email])
    ));
    const chats = snapshot?.docs.flatMap(chat => {
        const { users, displayNames } = chat.data();
        const recipient = getOtherEmail(users, user);
        if (!recipient) return [];
        return [{
            id: chat.id,
            recipient,
            username: getChatDisplayName(displayNames, recipient),
        }];
    }) ?? [];

    useEffect(() => {
        if (!displayName || !snapshot) return;
        const nameField = new FieldPath("displayNames", email);
        for (const chat of snapshot.docs) {
            if (chat.get(nameField) === displayName || submittedNames.current.get(chat.id) === displayName) continue;
            submittedNames.current.set(chat.id, displayName);
            void updateDoc(chat.ref, nameField, displayName).catch(error => {
                console.warn("Couldn’t save the chat display name.", error.code);
            });
        }
    }, [displayName, email, snapshot]);

    async function newChat(recipient) {
        const existing = chats.find(chat => chat.recipient.toLowerCase() === recipient);
        let id = existing?.id;
        if (!id) {
            const users = [email, recipient].sort();
            // Both participants derive the same ID without putting their emails in the URL.
            const encoder = new TextEncoder();
            const pair = `${encoder.encode(users[0]).length}:${users.join("")}`;
            const digest = await crypto.subtle.digest("SHA-256", encoder.encode(pair));
            id = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
            await setDoc(doc(conversations, id), { users }, { merge: true });
        }
        await router.push(`/chat/${encodeURIComponent(id)}`);
    }

    async function handleSignOut() {
        setSigningOut(true);
        setSignOutError("");
        try {
            await signOut(auth);
            toaster.success({ title: "Signed out" });
            await router.replace("/");
        } catch {
            setSignOutError("Couldn’t sign out. Please try again.");
        } finally {
            setSigningOut(false);
        }
    }

    return (
        <Flex
            as="aside"
            aria-label="Chats"
            display={activeChatId ? { base: "none", md: "flex" } : "flex"}
            w={{ base: "100%", md: "330px" }}
            h="100dvh"
            flexShrink={0}
            borderEnd="1px solid"
            borderColor="gray.200"
            direction="column"
        >
            {open && <DialogBox currentEmail={email} onClose={onClose} newChat={newChat} />}
            <Flex justifyContent="space-between" align="center" gap={3} p={3} minH="81px">
                <Flex align="center" gap={3} minW={0}>
                    <Avatar.Root>
                        <Avatar.Fallback name={user.displayName || user.email} />
                        {user.photoURL && <Avatar.Image src={user.photoURL} />}
                    </Avatar.Root>
                    <Text fontSize="lg" truncate>{user.displayName || user.email}</Text>
                </Flex>
                <Button variant="ghost" colorPalette="red" size="sm" loading={signingOut} onClick={handleSignOut}>
                    Sign out
                </Button>
            </Flex>
            {signOutError && <Text role="alert" color="red.600" px={4}>{signOutError}</Text>}

            <Button colorPalette="blue" variant="subtle" mx={5} my={3} onClick={onOpen} disabled={!snapshot || !!error}>
                New Chat
            </Button>

            <Flex as="nav" aria-label="Conversations" overflowY="auto" direction="column" flex={1}>
                {error ? (
                    <Text role="alert" color="red.600" p={4}>Couldn’t load your chats. Refresh to try again.</Text>
                ) : loading ? (
                    <Spinner alignSelf="center" m={4} role="status" aria-label="Loading chats" />
                ) : chats.length === 0 ? (
                    <Text p={4} color="fg.muted">Start a chat using someone’s email address.</Text>
                ) : chats.map(({ id, username }) => (
                    <Flex
                        key={id}
                        asChild
                        align="center"
                        gap={3}
                        p={3}
                        bg={id === activeChatId ? "blue.subtle" : undefined}
                        _hover={{ bg: "bg.muted" }}
                        _focusVisible={{ outlineOffset: "-2px" }}
                    >
                        <Link href={`/chat/${encodeURIComponent(id)}`} aria-current={id === activeChatId ? "page" : undefined}>
                            <Avatar.Root><Avatar.Fallback name={username} /></Avatar.Root>
                            <Text truncate>{username}</Text>
                        </Link>
                    </Flex>
                ))}
            </Flex>
        </Flex>
    );
}
