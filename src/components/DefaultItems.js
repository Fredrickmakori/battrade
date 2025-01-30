import React from "react";
import {
  Container,
  Row,
  Col,
  Image,
  Navbar,
  Nav,
  NavLink,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { productCategories } from "../images/productCategories";

const DefaultItems = () => {
  return (
    <div>
      <Navbar bg="light" expand="lg" className="shadow-sm mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/">
            SwapHub
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavLink as={Link} to="/">
                Home
              </NavLink>
              <NavLink as={Link} to="/upload">
                Upload Item
              </NavLink>{" "}
              {/* Assuming /upload exists */}
              {/* Add other navigation links as needed */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Row>
          {productCategories.map((category) => (
            <Col key={category.id} md={4} className="mb-4">
              <div className="card h-100">
                <Image src={category.image} fluid alt={category.name} />
                <div className="card-body">
                  <h5 className="card-title">{category.name}</h5>
                  <p className="card-text">
                    {/* Add description or other details here */}
                    Example description for {category.name}
                  </p>
                  <Link
                    to={`/itemDetails/${category.id}`}
                    className="btn btn-primary"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default DefaultItems;
