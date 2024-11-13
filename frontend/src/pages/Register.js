import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Heading,
  Select,
  useToast,
  Stack,
  Icon,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaIdCard, FaUserTag } from 'react-icons/fa';
import { postData } from '../api/apiFunctions';

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [bitsId, setBitsId] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const toast = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !role || !fullName || !password || !bitsId || !contactNumber) {
      toast({
        title: 'Error',
        description: 'All fields are required!',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const data = {
      name: fullName,
      email: email,
      password: password,
      role: role,
      bits_id: bitsId,
      contact_number: contactNumber,
    };

    try {
      const result = await postData('/register', data);
      toast({
        title: 'Registration Successful',
        description: result.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      minH="91vh"
      bgGradient="linear(to-r, teal.500, blue.500)"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Container maxW="lg" bg="white" p={5} borderRadius="lg" boxShadow="lg">
        <Heading as="h1" size="lg" mb={6} textAlign="center" color="teal.600">
          Register
        </Heading>
        <form onSubmit={handleRegister}>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                size="md"
                leftIcon={<Icon as={FaUser} color="gray.500" />}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="md"
                leftIcon={<Icon as={FaEnvelope} color="gray.500" />}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="md"
                leftIcon={<Icon as={FaLock} color="gray.500" />}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Contact Number</FormLabel>
              <Input
                type="text"
                placeholder="Enter your contact number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                size="md"
                leftIcon={<Icon as={FaPhone} color="gray.500" />}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>BITS ID</FormLabel>
              <Input
                type="text"
                placeholder="Enter your BITS ID"
                value={bitsId}
                onChange={(e) => setBitsId(e.target.value)}
                size="md"
                leftIcon={<Icon as={FaIdCard} color="gray.500" />}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Role</FormLabel>
              <Select
                placeholder="Select role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                size="md"
                icon={<Icon as={FaUserTag} color="gray.500" />}
              >
                <option value="student">Student</option>
                <option value="warden">Warden</option>
                <option value="admin">Admin</option>
              </Select>
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              width="full"
              size="lg"
              boxShadow="md"
              _hover={{ bg: "teal.600" }}
            >
              Register
            </Button>
          </Stack>
        </form>
      </Container>
    </Box>
  );
};

export default RegisterPage;
