// UserRegistration.js
import React, { useState, useContext } from "react";
import {
  Card,
  Alert,
  Container,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  GoogleAuthProvider,
} from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const UserRegistration = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState(null);

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;
      const colRef = collection(db, "user-details");
      await setDoc(doc(colRef, user.uid), {
        firstName,
        lastName,
        mobileNumber,
        idNumber,
        location,
        email,
      });
      setUser(user);
      navigate("/profile");
    } catch (error) {
      console.error(error);
    }
  };

  const handlePhoneSignIn = async (phoneNumber) => {
    try {
      const appVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {},
        auth
      );
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      const code = prompt("Enter the verification code:");
      if (code) {
        await confirmation.confirm(code);
        const user = auth.currentUser;
        const colRef = collection(db, "user-details");
        await setDoc(doc(colRef, user.uid), {
          firstName,
          lastName,
          mobileNumber,
          idNumber,
          location,
          email,
        });
        setUser(user);
        navigate("/profile");
      } else {
        setError("Verification code not provided");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const padPin = (pin) => {
    return pin.toString().padStart(6, "0");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const paddedPin = padPin(pin);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        paddedPin
      );
      const user = userCredential.user;
      const colRef = collection(db, "user-details");
      await setDoc(doc(colRef, user.uid), {
        firstName,
        lastName,
        mobileNumber,
        idNumber,
        location,
        email,
      });
      setUser(user);
      navigate("/profile");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container className="bg-dark">
      <Row className="justify-content-center mt-5">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h2 className="mb-4">Register</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>ID Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>PIN</Form.Label>
                  <Form.Control
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button type="submit" className="mt-3">
                  Register
                </Button>
              </Form>
              <div className="text-center mt-3">
                <Button
                  variant="outline-light"
                  onClick={handleGoogleSignIn}
                  className="mr-2"
                >
                  <i className="fab fa-google mr-2"></i>Sign in with Google
                </Button>
                <Button
                  variant="outline-dark"
                  onClick={() => handlePhoneSignIn(mobileNumber)}
                  className="ml-2"
                >
                  <i className="fas fa-mobile-alt mr-2"></i>Sign in with Phone
                </Button>
                <div id="recaptcha-container"></div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserRegistration;
