import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  CheckboxGroup,
  VStack,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const EditEventModal = ({ isOpen, onClose, event, categories, users, onUpdateEvent }) => {
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [image, setImage] = useState(event.image);
  const [location, setLocation] = useState(event.location);
  const [startTime, setStartTime] = useState(event.startTime);
  const [endTime, setEndTime] = useState(event.endTime);
  const [categoryIds, setCategoryIds] = useState(event.categoryIds);
  const [createdBy, setCreatedBy] = useState(event.createdBy);

  const toast = useToast();
  const navigate = useNavigate();

  const handleCheckboxChange = (e) => {
    const value = parseInt(e.target.value);
    setCategoryIds((prev) =>
      e.target.checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };

  const handleSubmit = async () => {
    if (!title || !description || !image || !location || !startTime || !endTime || categoryIds.length === 0 || !createdBy) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all fields before submitting.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const updatedEvent = {
      ...event,
      title,
      description,
      image,
      location,
      startTime,
      endTime,
      categoryIds,
      createdBy: parseInt(createdBy),
    };

    try {
      const response = await fetch(`http://localhost:3000/events/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEvent),
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      const data = await response.json();
      onUpdateEvent(data);
      onClose();

      toast({
        title: "Event updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate('/'); // Redirect to EventsPage after successful update
    } catch (error) {
      toast({
        title: "Failed to update event",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Event</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Image URL</FormLabel>
            <Input value={image} onChange={(e) => setImage(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Location</FormLabel>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Start Time</FormLabel>
            <Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>End Time</FormLabel>
            <Input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Categories</FormLabel>
            <CheckboxGroup defaultValue={categoryIds.map(String)}>
              <VStack align="start">
                {categories.map((category) => (
                  <Checkbox
                    key={category.id}
                    value={category.id.toString()}
                    onChange={handleCheckboxChange}
                    isChecked={categoryIds.includes(category.id)}
                  >
                    {category.name}
                  </Checkbox>
                ))}
              </VStack>
            </CheckboxGroup>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Created By</FormLabel>
            <Select value={createdBy} onChange={(e) => setCreatedBy(e.target.value)}>
              <option value="">Select Creator</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Save Changes
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
