const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const { sanitizeInput } = require("./helpers"); // Import your helper functions

//Function to create a new item
exports.createItem = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Only authenticated users can create items"
    );
  }
  const { name, category, description, images, location, desiredCommodity } =
    data;
  if (
    !name ||
    !category ||
    !description ||
    !images ||
    !location ||
    !desiredCommodity
  ) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "All fields (name, category, description, images, location, desiredCommodity) are required"
    );
  }
  const newItem = {
    name: sanitizeInput(name),
    category: sanitizeInput(category),
    description: sanitizeInput(description),
    images: images,
    location: location,
    desiredCommodity: sanitizeInput(desiredCommodity),
    userId: context.auth.uid, //add the user id who created the item
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  try {
    await db.collection("items").add(newItem);
    return { message: "Item created successfully!" };
  } catch (error) {
    console.error("Error creating item:", error);
    throw new functions.https.HttpsError("internal", "Error creating item");
  }
});

//Function to get all items
exports.getAllItems = functions.https.onCall(async (data, context) => {
  try {
    const querySnapshot = await db.collection("items").get();
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return items;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw new functions.https.HttpsError("internal", "Error fetching items");
  }
});

//Function to get a single item by ID
exports.getItemById = functions.https.onCall(async (data, context) => {
  const { itemId } = data;
  try {
    const doc = await db.collection("items").doc(itemId).get();
    if (!doc.exists) {
      throw new functions.https.HttpsError("not-found", "Item not found");
    }
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error("Error fetching item:", error);
    throw new functions.https.HttpsError("internal", "Error fetching item");
  }
});

//Add other item-related functions here as needed (e.g., update item, delete item)
