import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Button,
  Text,
  useBreakpointValue,
  Spacer,
  IconButton,
} from '@chakra-ui/react';
import { FaBars } from 'react-icons/fa';

const Navbar = ({ setIsLoggedIn, setUserRole }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('userLoggedIn'); // Check login status from local storage

  const handleLogout = () => {
    localStorage.clear(); // Clear local storage on logout
    setIsLoggedIn(false); // Update login state
    setUserRole(''); // Reset role state
    navigate('/login', { replace: true }); // Redirect to login
  };

  return (
    <Box bgGradient="linear(to-r, teal.500, blue.500)" p={4} color="white" boxShadow="md">
      <Flex align="center" justify="space-between" wrap="wrap">
        <Link to="/">
          <Text fontSize="2xl" fontWeight="bold" color="white" _hover={{ color: 'teal.200' }}>
            Hostel Mate
          </Text>
        </Link>

        <Spacer />

        {isMobile ? (
          <Flex align="center">
            <IconButton
              icon={<FaBars />}
              variant="ghost"
              color="white"
              size="md"
              aria-label="Menu"
              mr={4}
              _hover={{ bg: 'teal.600' }}
            />
            {isLoggedIn ? (
              <Button colorScheme="red" variant="solid" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button colorScheme="blue" variant="solid" size="sm" mr={2}>
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button colorScheme="green" variant="solid" size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
            {/* FAQ link for mobile view */}
            <Link to="/faq">
              <Button colorScheme="teal" variant="solid" size="sm" ml={2}>
                FAQ
              </Button>
            </Link>
          </Flex>
        ) : (
          <Flex gap={6} align="center">
            {/* FAQ link for desktop view */}
            <Link to="/faq">
              <Text
                fontSize="lg"
                fontWeight="medium"
                color="white"
                _hover={{ color: 'teal.200', textDecoration: 'underline' }}
              >
                FAQ
              </Text>
            </Link>

            {!isLoggedIn && (
              <>
                <Link to="/login">
                  <Text
                    fontSize="lg"
                    fontWeight="medium"
                    color="white"
                    _hover={{ color: 'teal.200', textDecoration: 'underline' }}
                  >
                    Login
                  </Text>
                </Link>
                <Link to="/register">
                  <Text
                    fontSize="lg"
                    fontWeight="medium"
                    color="white"
                    _hover={{ color: 'teal.200', textDecoration: 'underline' }}
                  >
                    Register
                  </Text>
                </Link>
              </>
            )}
            {isLoggedIn && (
              <Button
                colorScheme="red"
                variant="outline"
                onClick={handleLogout}
                _hover={{ bg: 'red.600', color: 'white' }}
              >
                Logout
              </Button>
            )}
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar;
