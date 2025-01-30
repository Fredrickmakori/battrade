import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api"; //Set Base url

export const useFetchUserProfile = (uid) => {
  const { user } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!uid) {
        setError("User ID is missing");
        setLoading(false);
        return;
      }
      if (!user || !user.idToken) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_BASE_URL}/user/profile/${uid}`,
          {
            headers: {
              Authorization: `Bearer ${user.idToken}`,
            },
          }
        );
        setUserProfile(response.data);
      } catch (error) {
        setError(error.message || "Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile(); //Removed Redundant Definition
  }, [uid, user]);

  return { userProfile, error, loading };
};

// Function to update user profile (unchanged)
export const updateUserProfile = async (userData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/user/profile/${userData.uid}`,
      userData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    if (error.response) {
      console.error("Error response:", error.response.data);
      console.error("Error response status:", error.response.status);
    }
    throw error;
  }
};

export const useRegisterUser = () => {
  const { user } = useContext(AuthContext);
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

  const registerUser = async (userdata) => {
    if (!user || !user.idToken) {
      throw new Error("User or idToken is missing");
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, userdata, {
        headers: {
          Authorization: `Bearer ${user.idToken}`,
        },
        firstName: userdata.firstName,
        lastName: userdata.lastName,
        email: userdata.email,
        password: userdata.password,
        location: userdata.location,
        locationDetails: userdata.location,
        uid: userdata.uid,
        mobileNumber: userdata.mobileNumber,
        idNumber: userdata.idNumber,
      });
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error response status:", error.response.status);
      }
      //You should throw a more informative error here for the user.
      throw new Error("Failed to register user. Please check your details.");
    }
  };

  return { registerUser };
};

export const sendAdminRequestEmailApi = async (user) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/adminRequest`, user);
    return response.data;
  } catch (error) {
    console.error("Error sending email:", error);
    if (error.response) {
      console.error("Error response:", error.response.data);
      console.error("Error response status:", error.response.status);
    }
    throw error;
  }
};
