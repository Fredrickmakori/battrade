import axios from "axios";

const API_BASE_URL = "/api"; // Base URL for your Cloud Functions API

// Function to fetch all items
export const fetchItems = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/items`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch items: " + error.message);
  }
};

// Function to fetch a single item by ID
export const fetchItemById = async (itemId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/items/${itemId}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch item: " + error.message);
  }
};

// Function to add a new item
export const addItem = async (itemData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/items`, itemData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to add item: " + error.message);
  }
};

// Function to submit a trade request
export const submitTradeRequest = async (tradeRequestData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/tradeRequests`,
      tradeRequestData
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to submit trade request: " + error.message);
  }
};

// Add more API functions as needed (e.g., for user authentication, profile updates, etc.)
