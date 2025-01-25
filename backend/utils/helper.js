// helpers.js

// Function to generate a unique ID (useful for trade requests or other unique identifiers)
const generateUniqueId = () => {
  return Math.random().toString(36).substring(2, 15); // Adjust length as needed
};

// Function to sanitize user input (preventing XSS attacks and other vulnerabilities)
const sanitizeInput = (input) => {
  // Implement robust input sanitization here using a library like DOMPurify
  // or a custom sanitization function.  This is crucial for security.
  //Example - VERY BASIC, not sufficient for production
  return input.replace(/<\/?[^>]+(>|$)/g, "");
};

// Function to format dates (for displaying timestamps, etc.)
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString(); // Customize the date format as needed
};

// Function to check if a user is authorized to perform an action (e.g., edit an item)
const isAuthorized = (userId, itemId) => {
  //Implement your authorization logic here.  This should check if the user who is trying to edit the item is the owner.
  //You would typically retrieve the owner ID from the item's data in the database.
  //This function should return true if authorized, false otherwise.
  return true; // Replace with your actual authorization logic
};

// Function to calculate distance between two coordinates (using latitude and longitude)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Implement Haversine formula or use a library for distance calculation
  //This requires a distance calculation formula, often the Haversine formula.  There are also npm packages you can use that handle this for you.
  return 0; //Replace with distance calculation logic.
};

//Export the helper functions
module.exports = {
  generateUniqueId,
  sanitizeInput,
  formatDate,
  isAuthorized,
  calculateDistance,
};
