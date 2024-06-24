import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Input,
  Checkbox,
  CheckboxGroup,
  Text,
  Image,
  Button,
  CardBody,
  Card,
  Flex,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { AddEventModal } from "../components/AddEventModal";
import { format } from "date-fns";
import { nl } from "date-fns/locale";

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch("http://localhost:3000/events");
      const eventData = await response.json();
      setEvents(eventData);
    };

    const fetchCategories = async () => {
      const response = await fetch("http://localhost:3000/categories");
      const categoryData = await response.json();
      setCategories(categoryData);
    };

    fetchEvents();
    fetchCategories();
  }, []);

  const handleAddEvent = async (newEvent) => {
    const response = await fetch("http://localhost:3000/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent),
    });

    if (response.ok) {
      const eventData = await response.json();
      setEvents([...events, eventData]);
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      (event.categoryIds &&
        event.categoryIds.some((id) =>
          selectedCategories.includes(id.toString())
        ));
    return matchesSearch && matchesCategory;
  });

  const handleCategoryChange = (categoryIds) => {
    setSelectedCategories(categoryIds);
  };

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
    <Box ml={20} mr={20} textAlign="center">
      <Heading mt={2} >Frederieks Event Page</Heading>
      <Box my={4}>
        <Input
          width={300}
          placeholder="Search events by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      <Box my={4}>
        <CheckboxGroup
          value={selectedCategories}
          onChange={handleCategoryChange}
        >
          <Text mb={2} fontSize="md">Filter events by category</Text>
          <Flex direction="row" alignItems="center" justifyContent="center">
            {categories.map((category) => (
              <Checkbox key={category.id} value={category.id.toString()} mr={2} >
                {category.name}
              </Checkbox>
            ))}
          </Flex>
        </CheckboxGroup>
      </Box>
      <Button onClick={() => setIsModalOpen(true)}mb={2} >Add Event</Button>
      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddEvent={handleAddEvent}
        categories={categories}
      />

      <Flex flexWrap="wrap" justifyContent="center">
        {filteredEvents.map((event) => (
          <Box
            key={event.id}
            width={{ base: "90%", md: "300px", lg: "300px" }}
            p={2}
            m={1}
          >
            <Card
              size={"sm"}
              border={"solid"}
              borderColor="red.400"
              borderRadius="2xl"
              bgColor="gray.200"
              h="100%"
            >
              <CardBody>
                <Link to={`/event/${event.id}`}>
                  <Box flexGrow={1}>
                    <Image
                      src={event.image}
                      alt={event.title}
                      h={40}
                      w={"100%"}
                      borderRadius="2xl"
                      objectFit="cover"
                    />
                  </Box>
                  <Heading as="h3" size="md" mt={2} mb={2}>
                    {event.title}
                  </Heading>
                  <Box>
                    <p>{event.description}</p>
                    <p>Location: {event.location}</p>
                    <p>Start time: {formatDate(event.startTime)}</p>
                    <p>End time: {formatDate(event.endTime)}</p>
                    <p>Categories: {getCategoryNames(event.categoryIds)}</p>
                  </Box>
                </Link>
              </CardBody>
            </Card>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

