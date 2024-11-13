import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, VStack, Container, Spinner, useToast } from '@chakra-ui/react';
import { getData } from '../api/apiFunctions';

const ClosedRoomRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wardenData, setWardenData] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchWardenData = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        const wardenResponse = await getData(`/user/${email}`);
        setWardenData(wardenResponse);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load warden data.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
      }
    };

    fetchWardenData();
  }, [toast]);

  useEffect(() => {
    const fetchClosedRequests = async () => {
      if (wardenData && wardenData.hostel_name) {
        try {
          const response = await getData(`/closed-requests-warden/${wardenData.hostel_name}`);
          setRequests(response);
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to load closed room requests.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        } finally {
          setLoading(false);
        }
      }
    };

    // Fetch closed requests after wardenData is set
    if (wardenData) {
      fetchClosedRequests();
    }
  }, [wardenData, toast]);

  if (loading) {
    return (
      <Container centerContent>
        <Spinner size="xl" />
        <Text mt={4}>Loading closed room requests...</Text>
      </Container>
    );
  }

  return (
    <Box p={6} boxShadow="md" borderWidth="1px" borderRadius="md">
      <Heading as="h1" size="lg" mb={4}>Closed Room Requests</Heading>
      {requests.length > 0 ? (
        <VStack align="start" spacing={4}>
          {requests.map((request) => (
            <Box key={request._id} p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
              <Text><strong>Student BITS ID:</strong> {request.bits_id}</Text>
              <Text><strong>Room Type Preference:</strong> {request.room_type_preference}</Text>
              <Text><strong>Hostel Status:</strong> {request.hostel_status}</Text>
              <Text><strong>Room Status:</strong> {request.room_status}</Text>
              {/* <Text><strong>Room Number:</strong> {request.alloted_room}</Text> */}
              <Text><strong>Alloted Room Number:</strong> {request.alloted_room}</Text>
              <Text><strong>Date:</strong> {new Date(request.application_date).toLocaleDateString()}</Text>
            </Box>
          ))}
        </VStack>
      ) : (
        <Text>No closed room requests found.</Text>
      )}
    </Box>
  );
};

export default ClosedRoomRequests;
