import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Image, Alert } from "react-bootstrap";
import { db } from "../services/firebase"; // Import your Firebase service

const ItemDetails = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const docRef = db.collection("items").doc(itemId);
        const doc = await docRef.get();

        if (doc.exists) {
          setItem({ id: doc.id, ...doc.data() });
        } else {
          setError("Item not found");
        }
      } catch (error) {
        setError("Error fetching item details");
      }
    };

    fetchItem();
  }, [itemId]);

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
    return (
      <Container>
        <Row className="justify-content-center mt-5">
          <Col md={6}>
            <p>Loading...</p>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>
                <h3>{item.name}</h3>
              </Card.Title>
              {item.images.map((imageUrl, index) => (
                <Image
                  src={imageUrl}
                  fluid
                  rounded
                  className="mb-2"
                  key={index}
                />
              ))}
              <Card.Text>
                <p>
                  <strong>Description:</strong> {item.description}
                </p>
                <p>
                  <strong>Category:</strong> {item.category}
                </p>
                <p>
                  <strong>Location:</strong> {item.location}
                </p>
                <p>
                  <strong>Desired Commodity:</strong> {item.desiredCommodity}
                </p>
                {/* Add other details as needed */}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ItemDetails;
