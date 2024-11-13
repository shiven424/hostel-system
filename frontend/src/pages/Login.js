import React from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Heading,
  useToast,
  Text,
  Stack,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { postData } from '../api/apiFunctions';

const Login = ({ setIsLoggedIn, setUserRole }) => {
  const toast = useToast();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email format').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await postData('/login', values);
        if (response && response.user) {
          localStorage.setItem('userLoggedIn', 'true');
          localStorage.setItem('userRole', response.user.role);
          localStorage.setItem('userEmail', response.user.email);
          setIsLoggedIn(true);
          setUserRole(response.user.role);
          navigate(`/${response.user.role}-dashboard`, { replace: true });
        } else {
          toast({
            title: 'Login Failed',
            description: 'Invalid credentials. Please try again.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error('Login failed:', error);
        toast({
          title: 'Login Failed',
          description: 'An error occurred during login. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    },
  });

  return (
    <Flex
      minH="91vh"
      align="center"
      justify="center"
      bgGradient="linear(to-r, teal.500, blue.500)"
    >
      <Container maxW="sm" bg="white" p={8} borderRadius="lg" boxShadow="lg">
        <Heading as="h1" size="lg" mb={6} textAlign="center" color="teal.600">
          Login
        </Heading>
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={4}>
            <FormControl isRequired isInvalid={formik.errors.email && formik.touched.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                size="md"
                bg={useColorModeValue('gray.100', 'gray.700')}
                _placeholder={{ color: 'gray.500' }}
              />
              {formik.errors.email && formik.touched.email ? (
                <Text color="red.500" fontSize="sm">{formik.errors.email}</Text>
              ) : null}
            </FormControl>

            <FormControl isRequired isInvalid={formik.errors.password && formik.touched.password}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                size="md"
                bg={useColorModeValue('gray.100', 'gray.700')}
                _placeholder={{ color: 'gray.500' }}
              />
              {formik.errors.password && formik.touched.password ? (
                <Text color="red.500" fontSize="sm">{formik.errors.password}</Text>
              ) : null}
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              width="full"
              size="lg"
              isLoading={formik.isSubmitting}
              boxShadow="md"
              _hover={{ bg: 'teal.600' }}
            >
              Login
            </Button>
          </Stack>
        </form>
      </Container>
    </Flex>
  );
};

export default Login;
