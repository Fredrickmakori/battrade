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

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.pathname || "/profile";

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setUser(user);
      navigate(from, { replace: true });
    } catch (error) {
      setError(error.message);
    }
  };

  const handlePhoneSignIn = async () => {
    const appVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        invisible: true,
        size: "400x200",
        badge: "inline",
        callback: (response) => {
          console.log(response);
        },
      },
      auth
    );

    //Get the verification code from user
    let phoneNumber = prompt("Enter code sent to your phone number");
    if (!phoneNumber) {
      // Check if the user canceled or entered nothing
      setError("Phone number is required.");
      return;
    }
    try {
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      let code = prompt("Enter the verification code sent to your phone:");
      if (!code) {
        setError("Verification code is required.");
        return;
      }
      await confirmation.confirm(code);
      const user = auth.currentUser;
      setUser(user);
      navigate(from, { replace: true });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors

    try {
      await signInWithEmailAndPassword(email, password);
      const user = auth.currentUser;
      setUser(user); // Update the AuthContext
      navigate(from, { replace: true }); // Navigate to user profile
    } catch (error) {
      setError(error.message); // Set error message from Firebase
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4">
            <Card.Title>Login</Card.Title>
            {error && <Alert variant="danger">{error}</Alert>}{" "}
            {/* Display error message */}
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
                  <i className="bi bi-google"></i>
                  Sign in with Google
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={() => handlePhoneSignIn("+15551234567")}
                >
                  <i className="bi bi-phone"></i>
                  Sign in with Phone
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
