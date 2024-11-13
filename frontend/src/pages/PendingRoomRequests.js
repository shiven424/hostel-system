import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, VStack, Container, Spinner, Button, Select, useToast } from '@chakra-ui/react';
import { getData, updateData } from '../api/apiFunctions';

const PendingRoomRequests = () => {
  const [requests, setRequests] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wardenData, setWardenData] = useState(null);
  const [selectedRooms, setSelectedRooms] = useState({});
  const toast = useToast();

  useEffect(() => {
    // Fetch warden data once when the component mounts
    const fetchWardenData = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        const response = await getData(`/user/${email}`);
        setWardenData(response);
        console.log("Warden Data:", response);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load warden data.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchWardenData();
  }, [toast]); 

  useEffect(() => {
    const fetchPendingRequestsAndRooms = async () => {
      if (wardenData && wardenData.hostel_name) {
        try {
          setLoading(true);
          
          // Fetch pending room requests
          const requestsResponse = await getData(`/pending-requests-warden/${wardenData.hostel_name}`);
          setRequests(requestsResponse);
          
          // Fetch available rooms in the warden's hostel
          const roomsResponse = await getData(`/hostels/${wardenData.hostel_name}/available_rooms`);
          setAvailableRooms(roomsResponse);

        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to load pending room requests or available rooms.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPendingRequestsAndRooms();
  }, [wardenData, toast]); 

  const handleRoomSelection = (bits_id, room_number) => {
    setSelectedRooms((prev) => ({
      ...prev,
      [bits_id]: room_number, // Store the room number instead of _id
    }));
  };

  const handleAssignRoom = async (bits_id) => {
    const selectedRoomNumber = selectedRooms[bits_id];
    if (!selectedRoomNumber) {
      toast({
        title: 'Error',
        description: 'Please select a room before assigning.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await updateData(`/room-requests/${bits_id}/assign-room`, { 
        room_number: selectedRoomNumber, 
        hostel_name: wardenData.hostel_name 
      });
      setRequests((prev) => prev.filter((request) => request.bits_id !== bits_id)); 
      toast({
        title: 'Room Assigned',
        description: 'The room has been assigned to the student.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to assign room.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleReject = async (bits_id) => {
    try {
      await updateData(`/room-requests/${bits_id}/reject`, { status: 'rejected' });
      setRequests((prev) => prev.filter((request) => request.bits_id !== bits_id));
      toast({
        title: 'Request Rejected',
        description: 'The room request has been rejected.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject the room request.',
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
        <Text mt={4}>Loading pending room requests...</Text>
      </Container>
    );
  }

  return (
    <Box p={6} boxShadow="md" borderWidth="1px" borderRadius="md">
      <Heading as="h1" size="lg" mb={4}>Pending Room Requests</Heading>
      {requests.length > 0 ? (
        <VStack align="start" spacing={4}>
          {requests.map((request) => (
            <Box key={request._id} p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
              <Text><strong>Student BITS ID:</strong> {request.bits_id}</Text>
              <Text><strong>Room Type Preference:</strong> {request.room_type_preference}</Text>
              <Text><strong>Date:</strong> {new Date(request.application_date).toLocaleDateString()}</Text>

              {/* Room selection dropdown */}
              <Text mt={2}><strong>Select Room to Assign:</strong></Text>
              <Select
                placeholder="Select Room"
                onChange={(e) => handleRoomSelection(request.bits_id, e.target.value)}
                mt={2}
              >
                {availableRooms
                  .filter((room) => room.type === request.room_type_preference)
                  .map((room) => (
                    <option key={room._id} value={room.room_number}>
                      Room {room.room_number} (Available spots: {room.capacity - room.current_occupancy})
                    </option>
                  ))}
              </Select>

              {/* Action buttons */}
              <Button colorScheme="green" onClick={() => handleAssignRoom(request.bits_id)} mt={2}>
                Assign Room
              </Button>
              <Button colorScheme="red" onClick={() => handleReject(request.bits_id)} mt={2} ml={3}>
                Reject
              </Button>
            </Box>
          ))}
        </VStack>
      ) : (
        <Text>No pending room requests found.</Text>
      )}
    </Box>
  );
};

export default PendingRoomRequests;
