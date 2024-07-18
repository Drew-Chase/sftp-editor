import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";

export default function ShortcutsModal({isOpen, onClose, onOpenChange}: { isOpen: boolean, onClose: () => void, onOpenChange: (open: boolean) => void })
{
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(localOnClose) => (
                    <>
                        <ModalHeader>Shortcuts</ModalHeader>
                        <ModalBody>
                            <p>Shortcuts go here</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button onPress={() =>
                            {
                                onClose();
                                localOnClose();
                            }} variant={"light"}>Close</Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}