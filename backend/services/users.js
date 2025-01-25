const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const { sanitizeInput } = require("./helpers"); // Import your helper functions

// Function to update user profile information (Example)
exports.updateUserProfile = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Only authenticated users can update their profile"
    );
  }

  const { displayName, phoneNumber, address } = data; //Example fields
  const userId = context.auth.uid;

  // Sanitize user inputs before updating
  const sanitizedDisplayName = sanitizeInput(displayName);
  const sanitizedPhoneNumber = sanitizeInput(phoneNumber);
  const sanitizedAddress = sanitizeInput(address);

  try {
    await db.collection("users").doc(userId).update({
      displayName: sanitizedDisplayName,
      phoneNumber: sanitizedPhoneNumber,
      address: sanitizedAddress,
    });
    return { message: "User profile updated successfully!" };
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Error updating user profile"
    );
  }
});

// Function to get user profile information (Example)
exports.getUserProfile = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Only authenticated users can view their profile"
    );
  }
  const userId = context.auth.uid;

  try {
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      throw new functions.https.HttpsError(
        "not-found",
        "User profile not found"
      );
    }
    return userDoc.data();
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Error getting user profile"
    );
  }
});

// Add other user-related functions here as needed (e.g., ban user, delete user account)
