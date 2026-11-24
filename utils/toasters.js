import { Portal, Stack, Toast, Toaster, createToaster } from "@chakra-ui/react";

export const toaster = createToaster({ placement: "bottom-end" });

export default function Toasts() {
    return (
        <Portal>
            <Toaster toaster={toaster} w="min(22rem, calc(100vw - 2rem))">
                {toast => (
                    <Toast.Root flexDirection="row" alignItems="center" pe={4}>
                        <Toast.Indicator />
                        <Stack gap={1} flex={1} minW={0} overflowWrap="anywhere">
                            {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
                            {toast.description && <Toast.Description>{toast.description}</Toast.Description>}
                        </Stack>
                        <Toast.CloseTrigger position="static" flexShrink={0} aria-label="Dismiss notification" />
                    </Toast.Root>
                )}
            </Toaster>
        </Portal>
    );
}
