import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Button, Select, useToast, Spinner, Container } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getData, postData } from '../api/apiFunctions';

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hostels, setHostels] = useState([]);
  const [hostelPreference, setHostelPreference] = useState('');
  const [roomTypePreference, setRoomTypePreference] = useState(''); // Room type preference
  const [availableRooms, setAvailableRooms] = useState([]); // Available rooms for selected hostel and room type
  const [roomPreference, setRoomPreference] = useState(''); // Selected room number
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const userLoggedIn = localStorage.getItem('userLoggedIn');
    if (!userLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchStudentData = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        const response = await getData(`/user/${email}`);
        setStudentData(response);

        const hostelsResponse = await getData('/hostels'); // Fetch hostels from the backend
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
    fetchStudentData();
  }, [navigate, toast]);

  const handleHostelChange = async (hostelName) => {
    setHostelPreference(hostelName);
    setRoomTypePreference(''); // Reset room type preference when hostel changes
    setRoomPreference(''); // Reset room preference
    setAvailableRooms([]); // Clear available rooms

    // Fetch available room types based on the selected hostel if needed
  };

  const handleRoomTypeChange = async (roomType) => {
    setRoomTypePreference(roomType);
    setRoomPreference(''); // Reset room preference when room type changes

    try {
      // Fetch available rooms based on selected hostel and room type
      const availableRoomsResponse = await getData(`/hostels/${hostelPreference}/available_rooms?type=${roomType}`);
      setAvailableRooms(availableRoomsResponse);
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      setAvailableRooms([]);
      toast({
        title: 'Error',
        description: 'Failed to fetch available rooms for the selected hostel and room type.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRoomRequest = async () => {
    try {
      await postData('/applications', {
        user_id: studentData.bits_id,
        hostel_preference: hostelPreference ? [hostelPreference] : [],
        room_type_preference: roomTypePreference,
        room_preference: roomPreference, // Include room preference
      });

      toast({
        title: 'Room Request Submitted',
        description: 'Your room request has been submitted for admin approval.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit your request.',
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
        <Text mt={4}>Loading your data...</Text>
      </Container>
    );
  }

  return (
    <Box p={6} boxShadow="md" borderWidth="1px" borderRadius="md">
      <Heading as="h1" size="lg" mb={4}>
        Welcome, {studentData.username}
      </Heading>
      <Text>Here are your details:</Text>
      <Box mt={4} p={4} border="1px" borderRadius="md" bg="gray.100">
        <Text><strong>Email:</strong> {studentData.email}</Text>
        <Text><strong>BITS ID:</strong> {studentData.bits_id}</Text>
        <Text><strong>Contact Number:</strong> {studentData.contact_number}</Text>
        <Text><strong>Room:</strong> {studentData.room_number || 'No room assigned'}</Text>
        <Text><strong>Building:</strong> {studentData.hostel_name || 'N/A'}</Text>
      </Box>

      {!studentData.room_number && (
        <>
          <Text mt={4}>Select Hostel Preference:</Text>
          <Select
            placeholder="Select Hostel"
            onChange={(e) => handleHostelChange(e.target.value)}
            value={hostelPreference}
          >
            {hostels.map((hostel) => (
              <option key={hostel.hostel_name} value={hostel.hostel_name}>{hostel.hostel_name}</option>
            ))}
          </Select>

          {hostelPreference && (
            <>
              <Text mt={4}>Select Room Type Preference:</Text>
              <Select
                placeholder="Select Room Type"
                onChange={(e) => handleRoomTypeChange(e.target.value)}
                value={roomTypePreference}
              >
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="triple">Triple</option>
              </Select>
            </>
          )}

          {roomTypePreference && (
            <>
              <Text mt={4}>Select Room Preference:</Text>
              <Select
                placeholder="Select Room"
                onChange={(e) => setRoomPreference(e.target.value)}
                value={roomPreference}
              >
                {availableRooms.map((room) => (
                  <option key={room.room_number} value={room.room_number}>{room.room_number}</option>
                ))}
              </Select>
            </>
          )}

          <Button mt={4} colorScheme="blue" onClick={handleRoomRequest}>
            Request Room
          </Button>
        </>
      )}
    </Box>
  );
};

export default StudentDashboard;
