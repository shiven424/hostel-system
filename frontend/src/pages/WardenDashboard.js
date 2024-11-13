import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, Button, useToast, Spinner, Container, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getData } from '../api/apiFunctions';

const WardenDashboard = () => {
  const [wardenData, setWardenData] = useState(null);
  const [students, setStudents] = useState([]); // State for students in the hostel
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const userLoggedIn = localStorage.getItem('userLoggedIn');
    if (!userLoggedIn) {
      navigate('/login');
      return;
    }

    // Fetch warden data using email from localStorage
    const fetchWardenData = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        const response = await getData(`/user/${email}`);
        setWardenData(response);
        console.log(response);

        // Fetch students data based on the warden's hostel
        if (response && response.hostel_name) {
          const studentsResponse = await getData(`/hostels/${response.hostel_name}/students`);
          setStudents(studentsResponse);
          console.log(studentsResponse);
        }

        setLoading(false);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load warden or students data.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
      }
    };
    fetchWardenData();
  }, [navigate, toast]);

  if (loading) {
    return (
      <Container centerContent>
        <Spinner size="xl" />
        <Text mt={4}>Loading your data...</Text>
      </Container>
    );
  }

  if (!wardenData) {
    return (
      <Box p={6} boxShadow="md" borderWidth="1px" borderRadius="md">
        <Text>Unable to load warden data. Please try again later.</Text>
      </Box>
    );
  }

  return (
    <Box p={6} boxShadow="md" borderWidth="1px" borderRadius="md">
      <Heading as="h1" size="lg" mb={4}>
        Welcome, {wardenData.username}
      </Heading>
      <Text>Here are your details:</Text>
      <Box mt={4} p={4} borderWidth="1px" borderRadius="md" bg="gray.100">
        <Text><strong>Email:</strong> {wardenData.email}</Text>
        <Text><strong>BITS ID:</strong> {wardenData.bits_id}</Text>
        <Text><strong>Contact Number:</strong> {wardenData.contact_number}</Text>
        <Text><strong>Hostel Name:</strong> {wardenData.hostel_name}</Text>
      </Box>

      {/* Buttons to navigate to Pending and Closed Room Requests */}
      <Box mt={6} display="flex" justifyContent="space-between">
        <Button colorScheme="teal" onClick={() => navigate('/pending-room-requests')}>
          View Pending Room Requests
        </Button>
        <Button colorScheme="purple" onClick={() => navigate('/closed-room-requests')}>
          View Closed Room Requests
        </Button>
      </Box>

      <Heading as="h2" size="md" mt={8} mb={4}>Students in Your Hostel</Heading>
      {students.length > 0 ? (
        <VStack align="start" spacing={4}>
          {students.map((student) => (
            <Box key={student.bits_id} p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
              <Text><strong>Name:</strong> {student.username}</Text>
              <Text><strong>Email:</strong> {student.email}</Text>
              <Text><strong>BITS ID:</strong> {student.bits_id}</Text>
              <Text><strong>Contact Number:</strong> {student.contact_number}</Text>
              <Text><strong>Room Number:</strong> {student.room_number || 'N/A'}</Text>
            </Box>
          ))}
        </VStack>
      ) : (
        <Text>No students assigned to your hostel.</Text>
      )}
    </Box>
  );
};

export default WardenDashboard;
