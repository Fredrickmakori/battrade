const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { createItem, getAllItems, getItemById } = require("./services/items");
const {
  createTradeRequest,
  getTradeRequestsForItem,
} = require("./services/trades");
const { updateUserProfile, getUserProfile } = require("./services/users");
const { sanitizeInput } = require("./services/helpers");
const admin = require("firebase-admin");
const db = admin.firestore();
const e = require("express");
exports.createUserDetails = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Only authenticated users can create items"
    );
  }
  const sanitizedData = {};
  for (const key in data) {
    sanitizedData[key] = sanitizeInput(data[key]);
  }
  try {
    await db
      .collection("user-details")
      .doc(context.auth.uid)
      .set(sanitizedData);
    return { message: "User details created successfully!" };
  } catch (error) {
    console.error("Error creating user details:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Error creating user details"
    );
  }
});
exports.createItem = functions.https.onCall(createItem);
exports.getAllItems = functions.https.onCall(getAllItems);
exports.getItemById = functions.https.onCall(getItemById);
exports.createTradeRequest = functions.https.onCall(createTradeRequest);
exports.getTradeRequestsForItem = functions.https.onCall(
  getTradeRequestsForItem
);
exports.updateUserProfile = functions.https.onCall(updateUserProfile);
exports.getUserProfile = functions.https.onCall(getUserProfile);

const app = express();
app.use(cors());
app.use(express.json());

// Item routes
app.get("/items", (req, res) => {
  getAllItems(req, res);
});
app.get("/items/:itemId", (req, res) => {
  getItemById(req, res);
});
app.post("/items", (req, res) => {
  createItem(req, res);
});

// Trade request routes
app.post("/tradeRequests", (req, res) => {
  createTradeRequest(req, res);
});
app.get("/tradeRequests/:itemId", (req, res) => {
  getTradeRequestsForItem(req, res);
});

// User routes
app.put("/users/profile", (req, res) => {
  updateUserProfile(req, res);
});
app.get("/users/profile", (req, res) => {
  getUserProfile(req, res);
});
