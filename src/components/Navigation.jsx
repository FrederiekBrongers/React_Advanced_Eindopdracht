import React from "react";
import { Link } from "react-router-dom";
import { Box, Center, Image } from "@chakra-ui/react";

export const Navigation = () => {
  return (
    <Link to="/">
      <Center>
        <Box>
          <Image
            mt={8}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrrezqcO2ovuXx11B-3Uzx1F9IyTrYvOF0oA&s"
            alt="House"
            boxSize="50px"
          />
        </Box>
      </Center>
    </Link>
  );
};
