import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, googleProvider } from "../services/firebase";
import {
  Card,
  Alert,
  Container,
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  FormControl,
  ButtonGroup,
} from "react-bootstrap";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { functions } from "../services/firebase";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(""); // Added state for phone number
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"; // Fixed path handling

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setUser(user);
      await callCreateUserDetails(user); // Call after successful sign-in
      navigate(from, { replace: true });
    } catch (error) {
      setError(error.message);
    }
  };

  const handlePhoneSignIn = async () => {
    const appVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          console.log("reCAPTCHA  allow signInWithPhoneNumber.");
        },
        "expired-callback": () => {
          console.log("Response expired. Ask user to solve reCAPTCHA again.");
        },
      },
      auth
    );
    try {
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      const code = prompt("Enter the verification code:");
      if (code) {
        await confirmation.confirm(code);
        const user = auth.currentUser;
        setUser(user);
        await callCreateUserDetails(user); // Call after successful sign-in
        navigate(from, { replace: true });
      } else {
        setError("Verification code not provided");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      setUser(user);
      await callCreateUserDetails(user); //Call after successful sign-in
      navigate(from, { replace: true });
    } catch (error) {
      setError(error.message);
    }
  };

  const callCreateUserDetails = async (user) => {
    try {
      const createUserDetails = httpsCallable(functions, "createUserDetails");
      await createUserDetails({
        uid: user.uid,
        firstName: user.displayName?.split(" ")[0] || "",
        lastName: user.displayName?.split(" ")[1] || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
    } catch (error) {
      console.error("Error creating user details:", error);
      setError("Failed to update user profile. Please try again later.");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4">
            <Card.Title>Login</Card.Title>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail" className="mb-3">
                <Form.Label>Email address</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-envelope"></i>
                  </InputGroup.Text>
                  <FormControl
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="formBasicPassword" className="mb-3">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-key"></i>
                  </InputGroup.Text>
                  <FormControl
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </InputGroup>
              </Form.Group>
              <ButtonGroup className="w-100">
                <Button variant="primary" type="submit">
                  Login
                </Button>
                <Button variant="outline-primary" onClick={handleGoogleSignIn}>
                  <i className="bi bi-google"></i> Sign in with Google
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={() => handlePhoneSignIn(phoneNumber)}
                >
                  <i className="bi bi-phone"></i> Sign in with Phone
                </Button>
              </ButtonGroup>
              <div id="recaptcha-container"></div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserLogin;
