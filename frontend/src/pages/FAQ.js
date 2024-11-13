import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Container,
  Text,
  Link,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const FAQ = () => {
  const [userRole, setUserRole] = useState('');

  // Retrieve user role from local storage on component mount
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role || '');
  }, []);

  return (
    <Container maxW="3xl" py={10}>
      <Heading as="h1" size="xl" mb={8} textAlign="center">
        Frequently Asked Questions (FAQ)
      </Heading>

      {/* Content for Unauthenticated Users */}
      {!userRole && (
        <Box mb={10}>
          <Heading as="h2" size="lg" mb={4} color="gray.600">
            Getting Started
          </Heading>
          <Text fontSize="lg" mb={4}>
            Welcome to Hostel Mate! Please register or log in to access the application features.
          </Text>
          <Accordion allowToggle>
            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  How do I register for an account?
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                Go to the <Link as={RouterLink} to="/register" color="teal.500" fontWeight="bold">Register</Link> page, fill out the required details, and submit the form. After successful registration, you can log in to access your dashboard.
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  I already have an account. How do I log in?
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                Go to the <Link as={RouterLink} to="/login" color="teal.500" fontWeight="bold">Login</Link> page, enter your email and password, and click the "Login" button to access your dashboard.
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  What if I forgot my password?
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                If you forgot your password, please contact the admin or support team for assistance with password recovery.
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      )}

      {/* Conditionally render FAQ for Admin */}
      {userRole === 'admin' && (
        <Box mb={10}>
          <Heading as="h2" size="lg" mb={4} color="blue.600">
            FAQ for Admin
          </Heading>
          <Accordion allowToggle>
            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  How do I assign a warden to a hostel?
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                Go to the Admin Dashboard, navigate to the hostel you wish to assign a warden, and use the "Assign Warden" dropdown. Once you select the warden, confirm the assignment.
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Can I remove a warden from a hostel?
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                Yes, on the Admin Dashboard, locate the hostel with the assigned warden and click "Remove Warden." This will unassign the warden from that hostel.
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  How do I approve or reject room requests?
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                Navigate to the "Pending Requests" section. Here, you can view all pending room requests and either approve or reject them. Once approved, you may assign the room as per availability.
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      )}

      {/* Conditionally render FAQ for Warden */}
      {userRole === 'warden' && (
        <Box mb={10}>
          <Heading as="h2" size="lg" mb={4} color="teal.600">
            FAQ for Warden
          </Heading>
          <Accordion allowToggle>
            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  How can I view the students in my assigned hostel?
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                On the Warden Dashboard, you can find a section listing all the students currently assigned to your hostel along with their details.
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  How do I handle pending room requests?
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                Go to the "Pending Room Requests" section, where you’ll see all requests from students for your hostel. Here, you can approve or reject requests, as well as assign rooms based on availability.
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  What if there are no available rooms for a specific room type?
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                If there are no available rooms for a student's preferred room type, you can either reject the request or coordinate with the admin for possible reassignments.
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      )}

      {/* Conditionally render FAQ for Student */}
      {userRole === 'student' && (
        <Box mb={10}>
          <Heading as="h2" size="lg" mb={4} color="purple.600">
            FAQ for Student
          </Heading>
          <Accordion allowToggle>
            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  How do I request a room in a specific hostel?
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                Go to the Student Dashboard, select your preferred hostel and room type, and submit your room request. Your request will be reviewed by the warden or admin.
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Can I choose multiple hostel preferences?
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                Yes, when submitting a request, you can select multiple hostel preferences to increase your chances of getting a room.
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  How do I check the status of my room request?
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                In your Student Dashboard, you can check the status of your request under the "My Requests" section. You’ll see whether it’s pending, approved, or rejected.
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  What happens if my room request is rejected?
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                If your room request is rejected, you can submit another request with different preferences or consult the admin/warden for further clarification.
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      )}
    </Container>
  );
};

export default FAQ;
