import React, { useContext } from "react";
import {
  Container,
  Navbar,
  Nav,
  NavDropdown,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "./logo.png";
import { auth } from "../services/firebase";

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate(user ? "/ItemList" : "/login", {
      state: { redirectTo: "/ItemList" },
    });
  };

  return (
    <div className="homepage">
      <Navbar bg="light" expand="lg" className="shadow-sm mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img src={logo} alt="Logo" height="30" className="me-2" />
            <span className="ms-2">SwapHub</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to={!user ? "/defaultItems" : "/itemlist"}>
                Browse Items
              </Nav.Link>
              {user && (
                <Nav.Link as={Link} to={!user ? "/defaultItems" : "/itemlist"}>
                  Upload Item
                </Nav.Link>
              )}
              {user ? (
                <NavDropdown
                  title={user.displayName || user.email}
                  id="user-dropdown"
                  className="mt-2"
                >
                  <NavDropdown.Item as={Link} to="/profile">
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={() => auth.signOut()}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
              )}
              {!user && (
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-5">
        <section className="hero text-center py-5 bg-light rounded shadow-sm">
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              <h1 className="display-4 mb-3">
                {user ? "Hi, " + user.displayName : " "} Welcome to SwapHub!
              </h1>
              <p className="lead mb-4">Where Barter Meets Simplicity</p>
              <p className="mb-5">
                Looking to exchange your old TV for a fridge? Or swap a guitar
                for a bike? At SwapHub, we bring back the age-old concept of
                barter trading but with a modern twist!
              </p>
              <h2 className="mt-5 mb-3">How It Works:</h2>
              <ul className="list-unstyled mb-5">
                <li className="mb-3">
                  <strong>List Your Item</strong> – Upload what you have,
                  whether it’s a gadget, furniture, or something unique. Set its
                  approximate value.
                </li>
                <li className="mb-3">
                  <strong>Explore Listings</strong> – Browse through items from
                  others in your community.
                </li>
                <li>
                  <strong>Make a Match</strong> – Found what you need? We'll
                  help connect you with someone interested in what you’re
                  offering.
                </li>
              </ul>
              <p className="mb-4">
                No money, no hassles—just smart and straightforward trades!
              </p>
              <p>
                Join the SwapHub Community Today and start exchanging value for
                value.
              </p>
              <Button
                onClick={handleGetStarted}
                variant="primary"
                size="lg"
                className="mt-4"
              >
                Get Started
              </Button>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
};

export default HomePage;
