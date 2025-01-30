import React, { useState, useContext, useEffect, useRef } from "react";
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
const padPin = (pin) => {
  const pinString = pin.toString();
  const numericPin = pinString.replace(/[^0-9]/g, ""); // Remove non-numeric characters
  return numericPin.padStart(8, "0"); // Pad to 8 digits
};

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const recaptchaContainerRef = useRef(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null); // Added RecaptchaVerifier state
  const [recaptchaInitialized, setRecaptchaInitialized] = useState(false); //Track initialization
  const [initError, setInitError] = useState(null); //Track any errors during init
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // Empty dependency array means this runs only once on mount
  // Added ref for the container

  useEffect(() => {
    const container = recaptchaContainerRef.current; // Get the container using the ref
    if (container) {
      try {
        const appVerifier = new RecaptchaVerifier(
          container, //Use the ref directly
          {
            size: "invisible",
            callback: (response) => {
              console.log("reCAPTCHA allow signInWithPhoneNumber.");
            },
            "expired-callback": () => {
              console.log(
                "Response expired. Ask user to solve reCAPTCHA again."
              );
            },
          },
          auth
        );
        setRecaptchaVerifier(appVerifier);
        setRecaptchaInitialized(true);
      } catch (error) {
        console.error("Error initializing RecaptchaVerifier:", error);
        setInitError(error);
      }
    } else {
      console.error("Recaptcha container not found.");
    }
  }, [recaptchaContainerRef]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setUser(user);
      await callCreateUserDetails(user);
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  const handlePhoneSignIn = async () => {
    if (!recaptchaVerifier) {
      console.error("RecaptchaVerifier not initialized.");
      return;
    }
    try {
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier
      );
      const code = prompt("Enter the verification code:");
      if (code) {
        await confirmation.confirm(code);
        const user = auth.currentUser;
        setUser(user);
        await callCreateUserDetails(user);
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const paddedPin = padPin(password);
      if (paddedPin.length !== 4 && paddedPin.length !== 6) {
        throw new Error(
          "Invalid PIN length. PIN should be either 4 or 6 digits."
        );
      }
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      setUser(user);
      await callCreateUserDetails(user);
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
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
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4">
            <Card.Title>Login</Card.Title>
            <Form onSubmit={handleSubmit}>
              {/* ... email and password input fields ... */}
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <FormControl
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <FormControl
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Phone Number</Form.Label>
                <FormControl
                  type="tel"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Form.Group>
              <Row className="justify-content-center">
                <Col md={6}>
                  <Card className="p-1">
                    {/* ... your form ... */}
                    <div ref={recaptchaContainerRef} id="recaptcha-container">
                      Recaptcha
                    </div>{" "}
                    {/* Use the ref here */}
                    {/* ... rest of your form and buttons ... */}
                  </Card>
                </Col>
              </Row>
              <ButtonGroup className="w-100 mt-3">
                <Button variant="primary" type="submit">
                  Login
                </Button>
                <Button variant="outline-primary" onClick={handleGoogleSignIn}>
                  Sign in with Google
                </Button>
                <Button variant="outline-primary" onClick={handlePhoneSignIn}>
                  Sign in with Phone
                </Button>
              </ButtonGroup>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserLogin;
