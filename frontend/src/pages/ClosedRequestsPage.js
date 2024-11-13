import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, Container, Spinner, VStack, useToast } from '@chakra-ui/react';
import { getData } from '../api/apiFunctions';

const ClosedRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchClosedRequests = async () => {
      try {
        const response = await getData('/closed-requests-admin'); // Fetch closed requests from the backend
        setRequests(response);
        setLoading(false);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load closed requests.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
      }
    };
    fetchClosedRequests();
  }, [toast]);

  if (loading) {
    return (
      <Container centerContent>
        <Spinner size="xl" />
        <Text mt={4}>Loading closed requests...</Text>
      </Container>
    );
  }

  return (
    <Box p={6} boxShadow="md" borderWidth="1px" borderRadius="md">
      <Heading as="h1" size="lg" mb={4}>Closed Requests</Heading>
      {requests.length > 0 ? (
        <VStack align="start" spacing={4}>
          {requests.map((request) => (
            <Box key={request._id} p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
              <Text><strong>Student BITS ID:</strong> {request.bits_id}</Text>
              <Text><strong>Hostel Assigned:</strong> {request.alloted_hostel}</Text>
              {/* <Text><strong>Room Number:</strong> {request.room_number}</Text> */}
              <Text><strong>Hostel Status:</strong> {request.hostel_status}</Text>
              <Text><strong>Room Status:</strong> {request.room_status}</Text>
              <Text><strong>Application Date:</strong> {new Date(request.application_date).toLocaleDateString()}</Text>
            </Box>
          ))}
        </VStack>
      ) : (
        <Text>No closed requests found.</Text>
      )}
    </Box>
  );
};

export default ClosedRequestsPage;
