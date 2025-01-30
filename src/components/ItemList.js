import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { functions } from "../services/firebase";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); // Start loading state
    setError(null); // Clear previous errors

    const q = query(collection(db, "items"), orderBy("timestamp", "desc")); // Order by timestamp

    const fetchItems = async () => {
      setLoading(true); //Set loading to true before fetching
      try {
        const getAllItemsFn = httpsCallable(functions, "getAllItems");
        const result = await getAllItemsFn();
        setItems(result.data);
      } catch (error) {
        setError("Error fetching items: " + error.message);
      } finally {
        setLoading(false); //Set loading to false after fetching, regardless of success or failure.
      }
    };

    fetchItems(); //Call the function to fetch the items

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const itemsData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setItems(itemsData);
        setLoading(false); // Set loading to false after data is fetched
      },
      (error) => {
        setError("Error fetching items: " + error.message);
        setLoading(false); // Set loading to false even on error
      }
    );
    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  if (loading) {
    return <p>Loading items...</p>; // Simple loading indicator
  }

  if (error) {
    window.Location.href = "/ItemDetails";
  }

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={10}>
          <Row xs={1} md={3} className="g-4">
            {items.map((item) => (
              <Col key={item.id}>
                <Card>
                  <Card.Img
                    variant="top"
                    src={
                      (item.images && item.images?.[0]) || "/placeholder.jpg"
                    } //Safe access to images
                    style={{ height: "200px", objectFit: "cover" }} //Added styling
                  />
                  <Card.Body>
                    <Card.Title>{item.itemName || "Untitled Item"}</Card.Title>
                    <Card.Text>
                      {item.description?.substring(0, 50) || "No description"}
                      ...
                    </Card.Text>
                    <Link to={`/items/${item.id}`}>
                      <Button variant="primary">View Details</Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ItemList;
