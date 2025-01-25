import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { db } from "../services/firebase"; // Import only db, not storage
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage"; // Import storage functions
import { addDoc, collection } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { functions } from "../services/firebase";

const UploadForm = () => {
  // ... (Your existing state variables: item, images, error, uploading) ...
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [item, setItem] = useState({
    name: "",
    description: "",
    category: "",
    location: "",
    desiredCommodity: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError(null);

    try {
      const storage = getStorage(); // Get the Firebase Storage service

      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const storageRef = ref(storage, `item-images/${image.name}`); // Create a reference
          const uploadTask = uploadBytesResumable(storageRef, image);

          return new Promise((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
              },
              (error) => {
                reject(error); // Reject the promise if an error occurs
              },
              () => {
                // Upload completed successfully, get the download URL
                getDownloadURL(uploadTask.snapshot.ref)
                  .then((downloadURL) => {
                    resolve(downloadURL); // Resolve the promise with the download URL
                  })
                  .catch((error) => reject(error)); // Reject if getting the URL fails
              }
            );
          });
        })
      );

      const newItem = { ...item, images: imageUrls }; // Add image URLs to item data
      const createdItemFn = httpsCallable(functions, "createItem");
      await createdItemFn(newItem);
      //
      await addDoc(collection(db, "items"), newItem);
      setUploading(false);
      navigate("/items");
    } catch (error) {
      setUploading(false);
      setError(error.message);
    }
  };

  // ... (Your existing JSX for the form) ...
  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={8}>
          <h1>Upload Item</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicName">
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter item name"
                name="name"
                value={item.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Add other Form.Group elements for category, description, etc. */}
            {/* Example: */}
            <Form.Group controlId="formBasicCategory">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={item.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                {/* Add more categories as needed */}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="formBasicDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={item.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formFileMultiple" className="mb-3">
              <Form.Label>Upload Images</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleImageChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location"
                name="location"
                value={item.location}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicDesiredCommodity">
              <Form.Label>Desired Commodity</Form.Label>
              <Form.Control
                type="text"
                placeholder="What do you want in exchange?"
                name="desiredCommodity"
                value={item.desiredCommodity}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={uploading}>
              {uploading ? "Uploading..." : "Submit"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default UploadForm;
