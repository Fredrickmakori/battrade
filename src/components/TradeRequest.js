import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { db, auth, storage } from "../services/firebase";

const TradeRequest = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [offer, setOffer] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const docRef = db.collection("items").doc(itemId);
        const doc = await docRef.get();
        if (doc.exists) {
          setItem(doc.data());
        } else {
          setError("Item not found");
        }
      } catch (error) {
        setError("Error fetching item");
      }
    };
    fetchItem();
  }, [itemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Create a trade request document in Firestore
      await db.collection("tradeRequests").add({
        itemId: itemId,
        offeredItem: offer,
        requester: auth.currentUser.uid, // Get current user ID
        timestamp: storage.FieldValue.serverTimestamp(),
      });
      setSuccess("Trade request submitted successfully!");
      // Optionally, redirect to a confirmation page or update the UI
      navigate("/items"); // Or navigate to a confirmation page
    } catch (error) {
      setError("Error submitting trade request: " + error.message);
    }
  };

  if (error) {
    return (
      <Container>
        <Row className="justify-content-center mt-5">
          <Col md={6}>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  if (!item) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Make a Trade Offer for {item.name}</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicOffer">
                  <Form.Label>Offer Item</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter item you wish to offer"
                    value={offer}
                    onChange={(e) => setOffer(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit Offer
                </Button>
              </Form>
              {success && <Alert variant="success">{success}</Alert>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TradeRequest;
