const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const { sanitizeInput } = require("./helpers"); // Import your helper functions

// Function to create a new trade request
exports.createTradeRequest = functions.https.onCall(async (data, context) => {
  //Check if the user is authenticated.
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Only authenticated users can create trade requests"
    );
  }
  const { itemId, offeredItem } = data;

  if (!itemId || !offeredItem) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "itemId and offeredItem are required."
    );
  }

  const sanitizedOfferedItem = sanitizeInput(offeredItem);

  try {
    await db.collection("tradeRequests").add({
      itemId: itemId,
      offeredItem: sanitizedOfferedItem,
      requesterId: context.auth.uid,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { message: "Trade request created successfully!" };
  } catch (error) {
    console.error("Error creating trade request:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Error creating trade request."
    );
  }
});

// Function to get all trade requests for a specific item (Optional)
exports.getTradeRequestsForItem = functions.https.onCall(
  async (data, context) => {
    const { itemId } = data;
    const tradeRequests = [];

    try {
      const querySnapshot = await db
        .collection("tradeRequests")
        .where("itemId", "==", itemId)
        .get();
      querySnapshot.forEach((doc) => {
        tradeRequests.push({ id: doc.id, ...doc.data() });
      });
      return tradeRequests;
    } catch (error) {
      throw new functions.https.HttpsError(
        "internal",
        "Error fetching trade requests."
      );
    }
  }
);

// Function to update the status of a trade request (Optional)
// This is a more advanced function that would require more detailed implementation based on your trade workflow
exports.updateTradeRequestStatus = functions.https.onCall(
  async (data, context) => {
    //Add implementation for updating trade request status.
  }
);

//Add any other trade-related functions as required
