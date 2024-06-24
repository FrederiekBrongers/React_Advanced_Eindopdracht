import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Image,
  Button,
  useDisclosure,
  Text,
  Center,
  Card,
  CardBody,
  Flex,
} from "@chakra-ui/react";
import { DeleteEventModal } from "../components/DeleteEventModal";
import { EditEventModal } from "../components/EditEventModal"; 
import { format } from "date-fns";
import { nl } from "date-fns/locale";

export const EventPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [creator, setCreator] = useState(null); 
  const [categories, setCategories] = useState([]); 
  const [users, setUsers] = useState([]); 
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:3000/events/${eventId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch event");
        }
        const eventData = await response.json();
        setEvent(eventData);

        // Fetch creator information
        const creatorResponse = await fetch(
          `http://localhost:3000/users/${eventData.createdBy}`
        );
        if (!creatorResponse.ok) {
          throw new Error("Failed to fetch creator");
        }
        const creatorData = await creatorResponse.json();
        setCreator(creatorData);
      } catch (error) {
        console.error("Error fetching event and creator:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const categoriesData = await response.json();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const usersData = await response.json();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchEvent();
    fetchCategories();
    fetchUsers();
  }, [eventId]);

  const handleDeleteEvent = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete event");
      }
      console.log("Event deleted successfully");
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      onDeleteClose();
    }
  };

  const handleUpdateEvent = (updatedEvent) => {
    setEvent(updatedEvent);
  };

  if (!event || !creator) {
    return (
      <Flex mt={20} alignItems="center" justifyContent="center">
        <Text>Something went wrong...</Text>
      </Flex>
    );
  }

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd MMMM yyyy, HH:mm 'uur'", {
      locale: nl,
    });
  };

  const getCategoryNames = (categoryIds) => {
    return categoryIds
      .map((id) => categories.find((category) => category.id === id)?.name)
      .filter((name) => name)
      .join(", ");
  };

  return (
    <Center flexDir="column" gap={4}>
      <Box width={{ base: "90%", md: "70%", lg: "50%" }} p={2} m={1}>
        <Card
          size={"sm"}
          border={"solid"}
          borderColor="red.400"
          borderRadius="2xl"
          bgColor="gray.200"
          h="90%"
        >
          <CardBody>
            <Image
              h={60}
              w={"100%"}
              borderRadius="2xl"
              objectFit={"cover"}
              src={event.image}
              alt={event.title}
            />
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Heading m={2}>{event.title}</Heading>
              <p>Description: {event.description}</p>
              <p>Location: {event.location}</p>
              <p>Start time: {formatDate(event.startTime)}</p>
              <p>End time: {formatDate(event.endTime)}</p>
              <p>Categories: {getCategoryNames(event.categoryIds)}</p>
              <Flex
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                <Text mt={3}>Created by: </Text>
                <Image
                  src={creator.image}
                  alt={creator.name}
                  boxSize="50px"
                  borderRadius="full"
                />
                {creator.name}
              </Flex>
            </Flex>

            <Flex
              mt={3}
              direction="row"
              alignItems="center"
              justifyContent="center"
            >
              <Button colorScheme="red" onClick={onDeleteOpen}>
                Delete Event
              </Button>
              <Button colorScheme="blue" onClick={onEditOpen} ml={3}>
                Edit Event
              </Button>{" "}
              <DeleteEventModal
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
                onDeleteEvent={handleDeleteEvent}
              />
              <EditEventModal
                isOpen={isEditOpen}
                onClose={onEditClose}
                event={event}
                categories={categories}
                users={users}
                onUpdateEvent={handleUpdateEvent}
              />
            </Flex>
          </CardBody>
        </Card>
      </Box>
    </Center>
  );
};
