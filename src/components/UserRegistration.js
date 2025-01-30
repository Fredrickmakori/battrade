import { useRegisterUser } from "../services/api";
import {
  Card,
  Alert,
  Container,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";
import { useState, useContext } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../services/firebase";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { sendAdminRequestEmailApi } from "../services/api";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";
import {
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

const UserRegistration = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [requestAdmin, setRequestAdmin] = useState(false); // Add state for admin request
  const [error, setError] = useState(null);
  const [locationDetails, setLocationDetails] = useState({});
  const [useManualLocation, setUseManualLocation] = useState(false); // State to toggle manual entry
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [manualLocation, setManualLocation] = useState("");
  const [uid, setUid] = useState("");
  const { registerUser } = useRegisterUser();
  const [loading, setLoading] = useState(false);
  const padPin = (pin) => {
    if (!pin) {
      return "";
    }
    const pinString = pin.toString();
    const numericPin = pinString.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    return numericPin.padStart(8, "0"); // Pad to 8 digits
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;
      await registerUser(user); //Call function to save details
      setUser(user);
      navigate("/profile");
    } catch (error) {
      setError(error.message);
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
        await registerUser(user);
        setUser(user);
        navigate("/profile");
      } else {
        setError("Verification code not provided");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // customHook.js

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const paddedPin = padPin(pin);
      const password = paddedPin;
      const createdUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await signInWithEmailAndPassword(auth, email, password);
      const user = createdUser.user;
      setUser(user);
      setUid(user.uid);
      const userDetails = {
        uid: createdUser.user.uid,
        firstName: firstName,
        lastName: lastName,
        mobileNumber: mobileNumber,
        idNumber: idNumber,
        location: useManualLocation ? manualLocation : location, // Use manual or Google locationm
        email: email.toLowerCase(),
        locationDetails: location,
        password: password, // Add password to user object
      };

      if (user && user.idToken) {
        const registrationResult = await registerUser(userDetails);
        console.log("Registration result:", registrationResult);
      }
      setError("Failed to register user");
      //Save user details after creation.

      if (requestAdmin) {
        // Only send the email if requestAdmin is true
        await sendAdminRequestEmailApi(user); // Call the API function
      }

      navigate("/profile");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSelect = async (value) => {
    setLocation(value.label);
    setUseManualLocation(false);
    //seManualLocation(false);
    const results = await geocodeByAddress(value.label);
    const latLng = await getLatLng(results[0]);
    setLocationDetails({
      ...value,
      latLng,
      country: results[0].address_components.find((component) =>
        component.types.includes("country")
      )?.long_name,
      state: results[0].address_components.find((component) =>
        component.types.includes("administrative_area_level_1")
      )?.long_name,
      city: results[0].address_components.find((component) =>
        component.types.includes("locality")
      )?.long_name,
    });
  };
  const handleManualLocationChange = (e) => {
    setManualLocation(e.target.value);
    setLocationDetails({ manualLocation: e.target.value }); //Store manual location
  };

  return (
    <Container className="bg-light">
      <Row className="justify-content-center mt-5">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h2 className="mb-4">Register</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicCheckbox">
                  <Form.Check
                    type="checkbox"
                    label="Request Admin Access"
                    checked={requestAdmin}
                    onChange={(e) => setRequestAdmin(e.target.checked)}
                  />
                </Form.Group>
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
                  <PlacesAutocomplete
                    value={location}
                    onChange={setLocation}
                    onSelect={handleSelect}
                    apiKey="YOUR_GOOGLE_MAPS_API_KEY"
                  >
                    {({
                      getInputProps,
                      suggestions,
                      getSuggestionItemProps,
                      loading,
                    }) => (
                      <div>
                        <input
                          {...getInputProps({
                            placeholder: "Enter your location",
                          })}
                        />
                        {loading ? (
                          <div>Loading...</div>
                        ) : (
                          <div>
                            {suggestions.map((suggestion) => {
                              const style = {
                                backgroundColor: suggestion.isHighlighted
                                  ? "#eee"
                                  : "#fff",
                              };
                              return (
                                <div
                                  {...getSuggestionItemProps(suggestion, {
                                    style,
                                  })}
                                  key={suggestion.placeId}
                                >
                                  {suggestion.description}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </PlacesAutocomplete>
                  <Form.Check // Checkbox to enable manual entry
                    type="checkbox"
                    label="Enter Location Manually"
                    checked={useManualLocation}
                    onChange={(e) => setUseManualLocation(e.target.checked)}
                  />
                  {useManualLocation && ( // Conditionally render manual input
                    <Form.Control
                      type="text"
                      value={manualLocation}
                      onChange={handleManualLocationChange}
                      placeholder="Enter your location"
                    />
                  )}
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
                  variant="outline-dark"
                  onClick={handleGoogleSignIn}
                  className="mr-2"
                >
                  <i className="fab fa-google mr-2"></i>Sign in with Google
                </Button>
                <Button
                  variant="outline-dark"
                  onClick={() => handlePhoneSignIn(mobileNumber)}
                  className="ml-2"
                  value
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
