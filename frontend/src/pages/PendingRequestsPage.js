import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, Container, Spinner, VStack, Select, Button, useToast } from '@chakra-ui/react';
import { getData, updateData } from '../api/apiFunctions';

const PendingRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hostels, setHostels] = useState([]); // Available hostels
  const [selectedHostels, setSelectedHostels] = useState({}); // Track selected hostel for each bits_id
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [requestsResponse, hostelsResponse] = await Promise.all([
          getData('/pending-requests-admin'), // Fetch pending requests from the backend
          getData('/available-hostels'), // Fetch list of available hostels
        ]);
        setRequests(requestsResponse);
        setHostels(hostelsResponse);
        setLoading(false);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load data.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const handleHostelSelection = (bitsId, hostelName) => {
    // Update selected hostel for each student's bits_id
    setSelectedHostels((prev) => ({
      ...prev,
      [bitsId]: hostelName,
    }));
  };

  const handleAssignHostel = async (bitsId) => {
    const selectedHostel = selectedHostels[bitsId];
    console.log(selectedHostel)
    console.log(bitsId)
    if (!selectedHostel) {
      toast({
        title: 'Error',
        description: 'Please select a hostel before assigning.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Update request on the backend using bits_id
      await updateData(`/assign-hostel/${bitsId}`, {
        hostel_name: selectedHostel,
      });

      // Update the request list to mark the request as processed
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.bits_id !== bitsId)
      );

      toast({
        title: 'Hostel Assigned',
        description: `Hostel ${selectedHostel} has been assigned to the student with BITS ID ${bitsId}.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to assign hostel.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Container centerContent>
        <Spinner size="xl" />
        <Text mt={4}>Loading pending requests...</Text>
      </Container>
    );
  }

  return (
    <Box p={6} boxShadow="md" borderWidth="1px" borderRadius="md">
      <Heading as="h1" size="lg" mb={4}>Pending Requests</Heading>
      {requests.length > 0 ? (
        <VStack align="start" spacing={4}>
          {requests.map((request) => (
            <Box key={request.bits_id} p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
              <Text><strong>Student BITS ID:</strong> {request.bits_id}</Text>
              <Text><strong>Hostel Preference:</strong> {request.hostel_preference.join(', ')}</Text>
              <Text><strong>Room Type Preference:</strong> {request.room_type_preference}</Text>
              <Text><strong>Hostel Status:</strong> {request.hostel_status}</Text>
              <Text><strong>Date:</strong> {new Date(request.application_date).toLocaleDateString()}</Text>

              <Text mt={2}><strong>Select Hostel to Assign:</strong></Text>
              <Select
                placeholder="Select Hostel"
                value={selectedHostels[request.bits_id] || ''}
                onChange={(e) => handleHostelSelection(request.bits_id, e.target.value)}
                mt={2}
              >
                {hostels.map((hostel) => (
                  <option key={hostel.hostel_name} value={hostel.hostel_name}>
                    {hostel.hostel_name}
                  </option>
                ))}
              </Select>

              <Button
                mt={3}
                colorScheme="blue"
                onClick={() => handleAssignHostel(request.bits_id)}
                isDisabled={!selectedHostels[request.bits_id]}
              >
                Assign Hostel
              </Button>
            </Box>
          ))}
        </VStack>
      ) : (
        <Text>No pending requests found.</Text>
      )}
    </Box>
  );
};

export default PendingRequestsPage;
