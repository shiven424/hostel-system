import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Flex,
} from '@chakra-ui/react';

const Home = () => {
  return (
    <Flex
      minH="91vh"
      align="center"
      justify="center"
      bgGradient="linear(to-r, teal.500, blue.500)"
    >
      <Container maxW="lg" bg="white" p={8} borderRadius="lg" boxShadow="lg" textAlign="center">
        <Heading as="h1" size="2xl" mb={4} color="teal.600">
          Welcome to the Hostel Mate
        </Heading>
        <Text fontSize="lg" mb={6} color="gray.600">
          This application helps you manage hostel rooms, applications, and user allotments efficiently.
        </Text>

        <VStack spacing={4}>
          <Link to="/register">
            <Button colorScheme="teal" size="lg" width="200px" boxShadow="md" _hover={{ bg: 'teal.600' }}>
              Register
            </Button>
          </Link>
          <Link to="/login">
            <Button colorScheme="blue" size="lg" width="200px" boxShadow="md" _hover={{ bg: 'blue.600' }}>
              Login
            </Button>
          </Link>
        </VStack>
      </Container>
    </Flex>
  );
};

export default Home;
