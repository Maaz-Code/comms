import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Button,
} from "@chakra-ui/react";

function DialogBox({isOpen, onClose, newChat}) {
  
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <ModalCloseButton />
          </ModalHeader>

          <ModalBody>
            <form
              id="email-form"
              onSubmit={async (e) => {
                e.preventDefault();
                if(e.target[0].value !== "") {
                    await newChat(e.target[0].value);
                    onClose();
                }
              }}
            >
              <FormControl>
                <FormLabel>Enter email of the recipient</FormLabel>
                <Input type="email" />
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button type="submit" form="email-form" bg = "blue.50" color = "blue.500" _hover = {{bg: "blue.100", cursor: "pointer"}}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
export default DialogBox;
