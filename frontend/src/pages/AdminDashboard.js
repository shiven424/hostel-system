import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, VStack, Container, Spinner, Select, Button, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getData, updateData } from '../api/apiFunctions';

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);
  const [hostels, setHostels] = useState([]);
  const [wardens, setWardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const email = localStorage.getItem('userEmail');
        const adminResponse = await getData(`/user/${email}`);
        setAdminData(adminResponse);

        const hostelsResponse = await getData('/hostels');
        console.log("Fetched Hostels Data:", hostelsResponse);
        setHostels(hostelsResponse);

        await fetchWardens();  // Fetch wardens here initially
      } catch (error) {
        console.error('Failed to load admin, hostels, or wardens data.');
        toast({
          title: 'Error',
          description: 'Failed to load data. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate, toast]);

  const fetchWardens = async () => {
    try {
      const wardensResponse = await getData('/wardens-for-assign');
      console.log("Fetched Wardens Data:", wardensResponse);
      setWardens(wardensResponse);
    } catch (error) {
      console.error('Failed to load wardens data.');
    }
  };

  const handleAssignWarden = async (hostelName, wardenEmail) => {
    try {
      const selectedWarden = wardens.find((warden) => warden.email === wardenEmail);
      if (!selectedWarden) {
        toast({
          title: 'Error',
          description: 'Warden not found.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      await updateData(`/hostels/${hostelName}/assign-warden`, { warden_email: wardenEmail });
      console.log(wardenEmail);

      // Update hostels to reflect the assigned warden
      setHostels((prevHostels) =>
        prevHostels.map((hostel) =>
          hostel.hostel_name === hostelName
            ? { 
                ...hostel, 
                warden_name: selectedWarden.username, 
                warden_contact: selectedWarden.contact_number,
                warden_email: selectedWarden.email 
              }
            : hostel
        )
      );

      await fetchWardens();  // Re-fetch wardens after assignment

      toast({
        title: 'Warden Assigned',
        description: `Warden ${selectedWarden.username} assigned to hostel.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Failed to assign warden.', error);
      toast({
        title: 'Error',
        description: 'Failed to assign warden.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRemoveWarden = async (hostelName, wardenEmail) => {
    try {
      await updateData(`/hostels/${hostelName}/remove-warden`, { warden_email: wardenEmail });
      console.log(wardenEmail);

      // Update hostels to reflect the removal of the warden
      setHostels((prevHostels) =>
        prevHostels.map((hostel) =>
          hostel.hostel_name === hostelName 
            ? { ...hostel, warden_name: null, warden_contact: null, warden_email: null }
            : hostel
        )
      );

      await fetchWardens();  // Re-fetch wardens after removal

      toast({
        title: 'Warden Removed',
        description: 'Warden removed from hostel.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Failed to remove warden.', error);
      toast({
        title: 'Error',
        description: 'Failed to remove warden.',
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
      <Heading as="h1" size="lg" mb={4}>Welcome, {adminData?.username}</Heading>
      <Text>Here are your details:</Text>
      <Box mt={4} p={4} border="1px" borderRadius="md" bg="gray.100">
        <Text><strong>Email:</strong> {adminData?.email}</Text>
        <Text><strong>BITS ID:</strong> {adminData?.bits_id}</Text>
        <Text><strong>Contact Number:</strong> {adminData?.contact_number}</Text>
      </Box>

      <Box mt={6} display="flex" justifyContent="space-between">
        <Button colorScheme="teal" onClick={() => navigate('/pending-requests')}>
          View Pending Requests
        </Button>
        <Button colorScheme="purple" onClick={() => navigate('/closed-requests')}>
          View Closed Requests
        </Button>
      </Box>

      <Heading as="h2" size="md" mt={8} mb={4}>Hostels and Room Information</Heading>
      {hostels.map((hostel) => (
        <Box key={hostel._id} mt={4} p={4} border="1px" borderRadius="md" bg="gray.100">
          <Text><strong>Hostel Name:</strong> {hostel.hostel_name}</Text>
          <Text><strong>Location:</strong> {hostel.location}</Text>
          <Text><strong>Total Rooms:</strong> {hostel.total_rooms}</Text>
          <Text><strong>Capacity:</strong> {hostel.capacity}</Text>
          <Text><strong>Current Occupancy:</strong> {hostel.current_occupancy}</Text>
          <Text><strong>Warden Name:</strong> {hostel.warden_name || 'N/A'}</Text>
          <Text><strong>Warden Contact:</strong> {hostel.warden_contact || 'N/A'}</Text>

          <VStack align="start" mt={2}>
            <Text><strong>Assign Warden:</strong></Text>
            <Select
              placeholder="Select Warden"
              onChange={(e) => handleAssignWarden(hostel.hostel_name, e.target.value)}
            >
              {wardens.map((warden) => (
                <option key={warden.email} value={warden.email}>{warden.username}</option>
              ))}
            </Select>

            {hostel.warden_email && (
              <Button
                mt={2}
                colorScheme="red"
                onClick={() => handleRemoveWarden(hostel.hostel_name, hostel.warden_email)}
              >
                Remove Warden
              </Button>
            )}
          </VStack>
        </Box>
      ))}
    </Box>
  );
};

export default AdminDashboard;
