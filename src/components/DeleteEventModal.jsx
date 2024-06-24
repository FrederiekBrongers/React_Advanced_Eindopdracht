import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const DeleteEventModal = ({ isOpen, onClose, onDeleteEvent }) => {
  const navigate = useNavigate();
  const toast = useToast();

  const handleDelete = async () => {
    try {
      await onDeleteEvent();
      onClose();
      toast({
        title: "Event deleted.",
        description: "The event has been successfully deleted.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: "Unable to delete the event.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm Delete Event</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to delete this event?
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
