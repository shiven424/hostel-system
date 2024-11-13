import api from './axios';

// Fetch all records (generic function)
export const getAllRecords = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching records:', error);
    throw error;
  }
};

// Fetch a single record by ID
export const getRecordById = async (endpoint, id) => {
  try {
    const response = await api.get(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching record:', error);
    throw error;
  }
};

// Create a new record
export const createRecord = async (endpoint, data) => {
    try {
      const response = await api.post(endpoint, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating record:', error);
      throw error;
    }
  };

// Update an existing record by ID
export const updateRecord = async (endpoint, id, data) => {
    try {
      const response = await api.put(`${endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating record:', error);
      throw error;
    }
  };

// Delete a record by ID
export const deleteRecord = async (endpoint, id) => {
    try {
      const response = await api.delete(`${endpoint}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting record:', error);
      throw error;
    }
  };

// Generic POST function
export const postData = async (url, data) => {
  try {
    const response = await api.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;  // Return the response data directly
  } catch (error) {
    throw new Error(error.response?.data?.message || 'API request failed');
  }
};

// Generic GET function
export const getData = async (url) => {
  try {
    const response = await api.get(url);
    return response.data;  // Return the response data directly
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch data');
  }
};

// Generic PUT (update) function
export const updateData = async (url, data) => {
  try {
    const response = await api.put(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;  // Return the response data directly
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update data');
  }
};