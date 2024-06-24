import React, { useState, useEffect } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, FormControl, FormLabel, Input, Checkbox, CheckboxGroup, VStack, Select, useToast } from "@chakra-ui/react";

export const AddEventModal = ({ isOpen, onClose, onAddEvent, categories }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [categoryIds, setCategoryIds] = useState([]);
  const [createdBy, setCreatedBy] = useState("");
  const [users, setUsers] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("http://localhost:3000/users");
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const handleCheckboxChange = (e) => {
    const value = parseInt(e.target.value);
    setCategoryIds((prev) =>
      e.target.checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };

  const handleSubmit = () => {
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

    const newEvent = {
      title,
      description,
      image,
      location,
      startTime,
      endTime,
      categoryIds,
      createdBy: parseInt(createdBy),
    };
    onAddEvent(newEvent);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Event</ModalHeader>
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
            <CheckboxGroup>
              <VStack align="start">
                {categories.map((category) => (
                  <Checkbox
                    key={category.id}
                    value={category.id.toString()}
                    onChange={handleCheckboxChange}
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
            Add Event
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
