import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../services/firebase";
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
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

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
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user) {
          const userDocRef = doc(db, "user-details", user.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data());
            setFirstName(docSnap.data().firstName);
            setLastName(docSnap.data().lastName);
            setMobileNumber(docSnap.data().mobileNumber);
            setIdNumber(docSnap.data().idNumber);
            setLocation(docSnap.data().location);
            setEmail(docSnap.data().email);
          } else {
            const initialData = {
              firstName: user.displayName?.split(" ")[0] || "",
              lastName: user.displayName?.split(" ")[1] || "",
              email: user.email || "",
              phoneNumber: user.phoneNumber || "",
              photoURL: user.photoURL || null,
              idNumber: "",
              location: "",
              mobileNumber: "",
            };
            await setDoc(userDocRef, initialData);
            setUserData(initialData);
            setFirstName(initialData.firstName);
            setLastName(initialData.lastName);
            setMobileNumber(initialData.mobileNumber);
            setIdNumber(initialData.idNumber);
            setLocation(initialData.location);
            setEmail(initialData.email);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data.");
      }
    };
    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSave = async () => {
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }
      const userDocRef = doc(db, "user-details", user.uid);
      await updateDoc(userDocRef, {
        firstName,
        lastName,
        mobileNumber,
        idNumber,
        location,
        email,
      });
      setEditing(false);
      setError(null);
      // Fetch updated data to reflect changes
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    } catch (error) {
      setError("Failed to save changes.");
      console.error("Error saving user data:", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>Loading user data...</div>;
  }

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
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
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
