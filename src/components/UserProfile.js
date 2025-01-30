import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../services/firebase";
import { useFetchUserProfile, updateUserProfile } from "../services/api";

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Navbar,
  Nav,
  Form,
  Alert,
} from "react-bootstrap";

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [email, setEmail] = useState("");
  const { userProfile } = useFetchUserProfile();
  useEffect(() => {
    if (userProfile) {
      setFirstName(userProfile.firstName || "");
      setLastName(userProfile.lastName || "");
      setMobileNumber(userProfile.mobileNumber || "");
      setIdNumber(userProfile.idNumber || "");
      setUserLocation(userProfile.location || "");
      setEmail(userProfile.email || "");
    }
  }, [userProfile]);
  useEffect(() => {
    if (user?.uid) {
      navigate("/login");
    }
  }, [user?.uid, navigate]);

  const handleSave = async () => {
    setEditing(true);
    try {
      await updateUserProfile({
        uid: user.uid,
        firstName,
        lastName,
        mobileNumber,
        idNumber,
        userLocation,

        email,
      });
      const fetchedData = await userProfile(user.uid);
      setUserData(fetchedData);
      updateUserProfile(userData);
      setEditing(false);
      setError(null);
    } catch (error) {
      console.error("Error updating user profile:", error);
      setError("Failed to update user profile. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            SwapHub
          </Navbar.Brand>
          <Nav className="me-auto">
            {/* Add other navigation links as needed here */}
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <Row className="justify-content-center mt-5">
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>
                  <h2>User Profile</h2>
                </Card.Title>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form>
                  <Form.Group controlId="formBasicFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={!editing}
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicLastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={!editing}
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicMobile">
                    <Form.Label>Mobile Number</Form.Label>
                    <Form.Control
                      type="text"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      disabled={!editing}
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicIdNumber">
                    <Form.Label>ID Number</Form.Label>
                    <Form.Control
                      type="text"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      disabled={!editing}
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicLocation">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"
                      value={userLocation}
                      onChange={(e) => setUserLocation(e.target.value)}
                      disabled={!editing}
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!editing}
                    />
                  </Form.Group>
                  {editing ? (
                    <Button variant="success" onClick={handleSave}>
                      Save Changes
                    </Button>
                  ) : (
                    <Button variant="primary" onClick={() => setEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </Form>
                <Button
                  variant="danger"
                  onClick={handleLogout}
                  className="mt-3"
                >
                  Logout
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UserProfile;
