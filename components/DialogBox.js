import { Button, CloseButton, Dialog, Field, Input, Portal } from "@chakra-ui/react";
import { useState } from "react";

export default function DialogBox({ currentEmail, onClose, newChat }) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        if (submitting) return;

        const email = new FormData(event.currentTarget).get("email").trim().toLowerCase();
        if (email === currentEmail) {
            setError("Enter an email address other than your own.");
            return;
        }

        setSubmitting(true);
        setError("");
        try {
            await newChat(email);
            onClose();
        } catch {
            setError("Couldn’t open the chat. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Dialog.Root open placement="center" onOpenChange={({ open }) => {
            if (!open && !submitting) onClose();
        }}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>New chat</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" aria-label="Close new chat" disabled={submitting} />
                        </Dialog.CloseTrigger>
                        <form onSubmit={handleSubmit}>
                            <Dialog.Body>
                                <Field.Root invalid={!!error} required>
                                    <Field.Label>Recipient email</Field.Label>
                                    <Input name="email" type="email" autoComplete="email" required />
                                    {error && <Field.ErrorText role="alert">{error}</Field.ErrorText>}
                                </Field.Root>
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Button
                                    type="submit"
                                    bg="#1E293B"
                                    color="white"
                                    _hover={{ bg: "#1E293B" }}
                                    loading={submitting}
                                    loadingText="Opening chat…"
                                >
                                    Open chat
                                </Button>
                            </Dialog.Footer>
                        </form>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
